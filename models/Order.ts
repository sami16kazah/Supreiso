import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    city: { type: String },
    streetName: { type: String },
    houseAddress: { type: String },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    stripeSessionId: { type: String },
    deliveryStatus: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  },
  { timestamps: true }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
