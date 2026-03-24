import mongoose, { Schema, model, models } from 'mongoose';

const SectionSchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, default: 0 },
  capacity: { type: Number, default: 1 },
  color: { type: String, default: '#ffffff' },
  priceModifier: { type: Number, default: 0 },
}, { _id: false });

const GiftBoxSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      length: { type: Number, required: true },
      depth: { type: Number, required: true },
    },
    sections: [SectionSchema],
    images: [{ type: String }],
    texture: { type: String },
    isActive: { type: Boolean, default: true },
    basePrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const GiftBox = models.GiftBox || model('GiftBox', GiftBoxSchema);

export default GiftBox;
