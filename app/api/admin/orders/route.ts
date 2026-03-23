import { checkAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    await dbConnect();
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
