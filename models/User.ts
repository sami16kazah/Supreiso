import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    address: { type: String },
    postCode: { type: String },
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
