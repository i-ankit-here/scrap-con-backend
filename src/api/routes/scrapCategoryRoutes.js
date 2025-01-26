import express from "express"
import {
  createScrapCategory,
  getAllScrapCategories,
  getScrapCategoryById,
  updateScrapCategory,
  deleteScrapCategory,
} from "../controllers/scrapCategoryController.js"
import { protect, adminOnly,vendorOnly } from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, adminOnly, createScrapCategory)
router.get("/", getAllScrapCategories)
router.get("/:id", getScrapCategoryById)
router.put("/:id", protect, adminOnly, updateScrapCategory)
router.delete("/:id", protect, adminOnly, deleteScrapCategory)

export default router

