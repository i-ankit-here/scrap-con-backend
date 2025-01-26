import express from "express"
import { protect, vendorOnly } from "../../middleware/authMiddleware.js"
import {
  requestPickup,
  getVendorPickups,
  getCustomerPickups,
  updatePickupStatus,
} from "../controllers/pickupController.js"

const router = express.Router()

router.post("/request", protect, requestPickup)
router.get("/vendor", protect, vendorOnly, getVendorPickups)
router.get("/customer", protect, getCustomerPickups)
router.put("/:pickupId/status", protect, vendorOnly, updatePickupStatus)

export default router

