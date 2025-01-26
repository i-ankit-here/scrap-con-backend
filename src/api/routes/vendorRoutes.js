import express from "express"
import {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile,
  updateServiceArea,
  getServiceArea,
  updateVendorLocation,
} from "../controllers/vendorController.js"
import { protect, vendorOnly } from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", registerVendor)
router.post("/login", loginVendor)
router.get("/profile", protect, vendorOnly, getVendorProfile)
router.put("/profile", protect, vendorOnly, updateVendorProfile)
router.put("/service-area", protect, vendorOnly, updateServiceArea)
router.get("/service-area", protect, vendorOnly, getServiceArea)
router.put("/location", protect, vendorOnly, updateVendorLocation)

export default router

