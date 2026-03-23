import { checkAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(req: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const body = await req.json();
    await dbConnect();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
