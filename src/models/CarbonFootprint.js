import mongoose from 'mongoose';

const carbonFootprintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    required: true,
  },
  carbonSaved: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export const CarbonFootprint = mongoose.model('CarbonFootprint', carbonFootprintSchema);

