import express from "express"
import { createAdminUser, getAdminProfile } from "../controllers/adminController.js"
import { protect, adminOnly } from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/create", createAdminUser)
router.get("/profile", protect, adminOnly, getAdminProfile)

export default router

