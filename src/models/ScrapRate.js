import mongoose from 'mongoose';

const scrapRateSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScrapCategory',
    required: true,
  },
  ratePerUnit: {
    type: Number,
    required: true,
  },
  effectiveFrom: {
    type: Date,
    required: true,
  },
  effectiveTo: Date,
});

export const ScrapRate = mongoose.model('ScrapRate', scrapRateSchema);

