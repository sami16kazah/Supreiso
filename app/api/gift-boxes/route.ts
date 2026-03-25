import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import GiftBox from '@/models/GiftBox';

// GET all active gift boxes (Public)
export async function GET() {
  try {
    await dbConnect();
    const boxes = await GiftBox.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(boxes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
