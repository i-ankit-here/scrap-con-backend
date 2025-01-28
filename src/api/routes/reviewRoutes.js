import express from "express"
import { protect, vendorOnly } from "../../middleware/authMiddleware.js"
import{
    createReview,
    updateReview,
    getAllReviewsByUser,
    getReviewByPickup,
    deleteReview
} from "../controllers/reviewControllers.js"

const router = express.Router()

router.post("/createReview",protect, createReview)
router.put("/updateReview",protect, updateReview)
router.get("/getAllReviewsByUser", protect, getAllReviewsByUser)
router.get("/getReviewByPickup/:pickupId", protect, getReviewByPickup)
router.delete("/deleteReview/:reviewId", protect, deleteReview)

export default router
