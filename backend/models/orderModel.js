import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    product: {
      type: Object, // or you can define more detailed schema depending on your product structure
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    orderInstructions: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, default: Date.now },
    isDelivered: { type: Boolean, default: false }

  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
