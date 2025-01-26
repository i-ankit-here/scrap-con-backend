import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import { Vendor } from "../models/Vendor.js"
import { config } from "../config/index.js"

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, config.jwtSecret)

      // Check if the user is a vendor
      const vendor = await Vendor.findById(decoded.id).select("-password")
      if (vendor) {
        req.user = vendor
        req.isVendor = true
      } else {
        req.user = await User.findById(decoded.id).select("-password")
        req.isVendor = false
      }

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
}

export const vendorOnly = (req, res, next) => {
  if (req.isVendor) {
    next()
  } else {
    res.status(403)
    throw new Error("Not authorized, vendor access only")
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403)
    throw new Error("Not authorized, admin access only")
  }
}

