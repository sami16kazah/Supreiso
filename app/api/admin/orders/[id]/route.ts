import { checkAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    await dbConnect();
    const order = await Order.findById(id).populate("user", "name email");
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();
    // Usually only update deliveryStatus or paymentStatus
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
