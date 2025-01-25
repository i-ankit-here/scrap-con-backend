import mongoose from 'mongoose';

const scrapCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  unit: {
    type: String,
    required: true,
  },
  iconUrl: String,
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const ScrapCategory = mongoose.model('ScrapCategory', scrapCategorySchema);

