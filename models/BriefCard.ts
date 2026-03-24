import mongoose, { Schema, model, models } from 'mongoose';

const BriefCardSchema = new Schema(
  {
    title: { type: String, required: true },
    photo: { type: String, required: true },
    characterLimit: { type: Number, required: true, default: 200 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BriefCard = models.BriefCard || model('BriefCard', BriefCardSchema);

export default BriefCard;
