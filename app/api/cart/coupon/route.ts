import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "No code provided." }, { status: 400 });

    await dbConnect();
    
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
    }

    const now = Date.now();
    if (now < new Date(coupon.activationDate).getTime()) {
      return NextResponse.json({ error: "Coupon is not active yet." }, { status: 400 });
    }
    if (now > new Date(coupon.expirationDate).getTime()) {
      return NextResponse.json({ error: "Coupon has expired." }, { status: 400 });
    }

    return NextResponse.json({
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      isPercentage: coupon.isPercentage
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to validate coupon." }, { status: 500 });
  }
}
