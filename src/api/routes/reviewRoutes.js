import express from "express"
import { protect, vendorOnly } from "../../middleware/authMiddleware.js"
import{
    createReview,
    updateReview,
    getAllReviewsByUser,
    getReviewByPickup
} from "../controllers/reviewControllers.js"

const router = express.Router()

router.post("/createReview",protect, createReview)
router.post("/updateReview",protect, updateReview)
router.get("/getAllReviewsByUser", protect, getAllReviewsByUser)
router.get("/getReviewByPickup/:pickupId", protect, getReviewByPickup)

export default router
