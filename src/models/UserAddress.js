import mongoose from 'mongoose';

const userAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: String,
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

userAddressSchema.index({ coordinates: '2dsphere' });

export const UserAddress = mongoose.model('UserAddress', userAddressSchema);

