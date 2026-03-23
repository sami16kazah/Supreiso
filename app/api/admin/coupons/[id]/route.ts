import { checkAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    await dbConnect();
    const coupon = await Coupon.findById(id);
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();
    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    await dbConnect();
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Coupon deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
