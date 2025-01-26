import mongoose from "mongoose"

const serviceAreaSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  center: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  radius: {
    type: Number,
    required: true,
    min: 0,
    max: 50, // Maximum 50 km radius
  },
  pincode: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  serviceStart: {
    type: String,
    required: true,
  },
  serviceEnd: {
    type: String,
    required: true,
  },
})

serviceAreaSchema.index({ center: "2dsphere" })

export const ServiceArea = mongoose.model("ServiceArea", serviceAreaSchema)

