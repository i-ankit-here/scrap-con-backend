import express from "express"
import {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile,
  updateServiceArea,
  getServiceArea,
  updateVendorLocation,
  getNearbyVendors,
  getNearbyVendorsForUser,
  updateVendorAvailability,
  createScrapRates,
  createScrapRate,
  updateScrapRate,
  deleteScrapRate,
  deleteScrapRateByCategoryId
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
router.get("/nearby", getNearbyVendors)
router.get("/nearby-for-user", protect, getNearbyVendorsForUser)
router.put("/availability", protect, vendorOnly, updateVendorAvailability)
router.post("/createScrapRates", protect, vendorOnly, createScrapRates)
router.post("/createScrapRate", protect, vendorOnly, createScrapRate)
router.put("/updateScrapRate", protect, vendorOnly, updateScrapRate)
router.delete("/deleteRateById/:rateId", protect, vendorOnly, deleteScrapRate)
router.delete("/deleteRateByCategoryId/:categoryId", protect, vendorOnly, deleteScrapRateByCategoryId)

export default router

