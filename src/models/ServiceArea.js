import mongoose from 'mongoose';

const serviceAreaSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  area: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
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
  serviceStart: {
    type: String,
    required: true,
  },
  serviceEnd: {
    type: String,
    required: true,
  },
});

serviceAreaSchema.index({ area: '2dsphere' });

export const ServiceArea = mongoose.model('ServiceArea', serviceAreaSchema);

