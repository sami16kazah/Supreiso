import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import BriefCard from '@/models/BriefCard';
import { checkAdmin } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const card = await BriefCard.findById(id);
    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    return NextResponse.json(card);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const updatedCard = await BriefCard.findByIdAndUpdate(id, body, { new: true });
    if (!updatedCard) return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    return NextResponse.json(updatedCard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    await dbConnect();
    const deletedCard = await BriefCard.findByIdAndDelete(id);
    if (!deletedCard) return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
