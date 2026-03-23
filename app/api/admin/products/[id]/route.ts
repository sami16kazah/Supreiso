import { checkAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();
    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await checkAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Clean up images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          const parts = imageUrl.split('/');
          const uploadIndex = parts.findIndex((p: string) => p === 'upload');
          if (uploadIndex !== -1) {
            let pathParts = parts.slice(uploadIndex + 1);
            if (pathParts[0].startsWith('v') && !isNaN(parseInt(pathParts[0].replace('v', ''), 10))) {
              pathParts.shift(); // remove version token
            }
            const fullPath = pathParts.join('/'); 
            const publicId = fullPath.substring(0, fullPath.lastIndexOf('.'));
            
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (imgErr) {
          console.error("Failed to delete image from cloudinary:", imageUrl, imgErr);
        }
      }
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
