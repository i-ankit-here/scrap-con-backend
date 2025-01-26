import mongoose from "mongoose"

const scrapCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const ScrapCategory = mongoose.model("ScrapCategory", scrapCategorySchema)

