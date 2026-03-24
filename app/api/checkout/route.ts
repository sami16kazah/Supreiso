import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";
import GiftBox from "@/models/GiftBox";
import BriefCard from "@/models/BriefCard";
import Product from "@/models/Product";
import Mailjet from "node-mailjet";

// Initialize Stripe ensuring the key is present
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any,
});

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY
});

export async function POST(req: Request) {
  try {
    const { items, email, name, shippingAddress, city, streetName, houseAddress, phoneNumber, postalCode, userId, couponCode } = await req.json();

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price * 100), // convert to cents
      },
      quantity: item.quantity,
    }));

    let stripeCouponId = undefined;
    let finalTotalAmount = items.reduce((total: number, i: any) => total + (i.product.price * i.quantity), 0);

    if (couponCode) {
      await dbConnect();
      const coupon: any = await Coupon.findOne({ code: couponCode, isActive: true });
      const now = Date.now();
      if (coupon && now >= new Date(coupon.activationDate).getTime() && now <= new Date(coupon.expirationDate).getTime()) {
        const stripeCouponObj: any = { duration: 'once' };
        if (coupon.isPercentage) {
           stripeCouponObj.percent_off = coupon.discountAmount;
           finalTotalAmount = finalTotalAmount - (finalTotalAmount * (coupon.discountAmount / 100));
        } else {
           stripeCouponObj.amount_off = Math.round(coupon.discountAmount * 100);
           stripeCouponObj.currency = 'usd';
           finalTotalAmount = finalTotalAmount - coupon.discountAmount;
        }
        const createdStripeCoupon = await stripe.coupons.create(stripeCouponObj);
        stripeCouponId = createdStripeCoupon.id;
      }
    }
    finalTotalAmount = Math.max(0, finalTotalAmount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : undefined,
      success_url: `${process.env.NEXTAUTH_URL}/profile`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: email,
    });

    await dbConnect();
    const orderItems = items.map((i: any) => ({
      product: i.product._id,
      name: i.product.name,
      priceAtPurchase: i.product.price,
      quantity: i.quantity,
      giftBoxData: i.giftBoxData || undefined,
    }));

    const totalAmount = finalTotalAmount;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      city,
      streetName,
      houseAddress,
      postalCode,
      phoneNumber,
      paymentStatus: "pending",
      stripeSessionId: session.id,
      deliveryStatus: "pending",
    });

    if (process.env.MAILJET_API_KEY) {
      try {
        await mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_SENDER_EMAIL,
                Name: "Surpriso Store"
              },
              To: [
                {
                  Email: email,
                  Name: name || "Customer"
                }
              ],
              Subject: "Your Surpriso Order Details",
              TextPart: `Thank you for your order! Your total is $${totalAmount.toFixed(2)}. Complete your payment via the Stripe checkout link.`,
              HTMLPart: `<h3>Thank you, ${name || "Customer"}!</h3><p>Your order #${order._id.toString().slice(-6)} has been created.</p><p>Total: $${totalAmount.toFixed(2)}</p><br/><i>Note: The payment is currently pending until Stripe completes processing it.</i>`
            }
          ]
        });
      } catch (err) {
        console.error("Mailjet failed to send: ", err);
      }
    }

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
