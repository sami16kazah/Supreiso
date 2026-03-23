import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['package', 'item'], required: true },
    width: { type: Number, default: 1 }, 
    height: { type: Number, default: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    amount: { type: Number, required: true, default: 0 }, 
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Product = models.Product || model('Product', ProductSchema);

export default Product;
