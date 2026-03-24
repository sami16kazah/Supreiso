import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import GiftBox from '@/models/GiftBox';
import { checkAdmin } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const box = await GiftBox.findById(id);
    if (!box) return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    return NextResponse.json(box);
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
    const updatedBox = await GiftBox.findByIdAndUpdate(id, body, { new: true });
    if (!updatedBox) return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    return NextResponse.json(updatedBox);
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
    const deletedBox = await GiftBox.findByIdAndDelete(id);
    if (!deletedBox) return NextResponse.json({ error: 'Box not found' }, { status: 404 });
    return NextResponse.json({ message: 'Box deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
