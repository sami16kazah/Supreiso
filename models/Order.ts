import mongoose, { Schema, model, models } from 'mongoose';

const GiftBoxDataSchema = new Schema({
  giftBoxId: { type: Schema.Types.ObjectId, ref: 'GiftBox', required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  briefCardId: { type: Schema.Types.ObjectId, ref: 'BriefCard', required: true },
  customMessage: { type: String, required: true },
  contents: [{
    sectionName: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  }]
}, { _id: false });

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' }, // Optional if it's a gift box item
    name: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    giftBoxData: { type: GiftBoxDataSchema },
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
