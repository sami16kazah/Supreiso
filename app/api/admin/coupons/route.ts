import { checkAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";

export async function GET(req: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const body = await req.json();
    await dbConnect();
    const coupon = await Coupon.create(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 });
  }
}
