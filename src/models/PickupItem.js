import mongoose from 'mongoose';

const pickupItemSchema = new mongoose.Schema({
  pickup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScrapCategory',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const PickupItem = mongoose.model('PickupItem', pickupItemSchema);

