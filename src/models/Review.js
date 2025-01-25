import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  pickup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    required: true,
  },
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
}, {
  timestamps: true,
});

export const Review = mongoose.model('Review', reviewSchema);

