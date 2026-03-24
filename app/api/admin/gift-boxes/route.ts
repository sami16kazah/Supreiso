import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import GiftBox from '@/models/GiftBox';
import { checkAdmin } from '@/lib/adminAuth';

// GET all gift boxes
export async function GET() {
  try {
    await dbConnect();
    const boxes = await GiftBox.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(boxes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new gift box (admin only)
export async function POST(req: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    await dbConnect();
    const body = await req.json();
    const newBox = await GiftBox.create(body);
    return NextResponse.json(newBox, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
