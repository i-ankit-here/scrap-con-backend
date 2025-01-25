import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAddress',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  completedAt: Date,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending',
  },
  totalAmount: Number,
  totalWeight: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
  },
  paymentMethod: String,
}, {
  timestamps: true,
});

export const Pickup = mongoose.model('Pickup', pickupSchema);

