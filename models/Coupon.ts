import mongoose, { Schema, model, models } from 'mongoose';

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    refProduct: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    discountAmount: { type: Number, required: true },
    isPercentage: { type: Boolean, default: false },
    activationDate: { type: Date, default: Date.now },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon = models.Coupon || model('Coupon', CouponSchema);

export default Coupon;
