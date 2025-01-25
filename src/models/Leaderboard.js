import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  totalCarbonSaved: {
    type: Number,
    required: true,
  },
  totalScrapSold: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

