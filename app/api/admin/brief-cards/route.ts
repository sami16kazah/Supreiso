import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import BriefCard from '@/models/BriefCard';
import { checkAdmin } from '@/lib/adminAuth';

// GET all brief cards (available for both admin and customers)
export async function GET() {
  try {
    await dbConnect();
    const cards = await BriefCard.find({}).sort({ createdAt: -1 });
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new brief card (admin only - middleware should handle auth)
export async function POST(req: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    await dbConnect();
    const body = await req.json();
    const newCard = await BriefCard.create(body);
    return NextResponse.json(newCard, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
