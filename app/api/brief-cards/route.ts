import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import BriefCard from '@/models/BriefCard';

// GET all brief cards (Public)
export async function GET() {
  try {
    await dbConnect();
    const cards = await BriefCard.find({}).sort({ createdAt: -1 });
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
