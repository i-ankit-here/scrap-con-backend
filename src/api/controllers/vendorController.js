import { Vendor } from "../../models/Vendor.js"
import { ServiceArea } from "../../models/ServiceArea.js"
import { generateToken } from "../../utils/auth.js"
import { getLocationDetails } from "../../services/geocodingService.js"
import { User } from "../../models/User.js" // Import User model

export const registerVendor = async (req, res, next) => {
  try {
    const { businessName, ownerName, email, phone, password } = req.body

    const vendorExists = await Vendor.findOne({ email })
    if (vendorExists) {
      res.status(400)
      throw new Error("Vendor already exists")
    }

    const vendor = await Vendor.create({
      businessName,
      ownerName,
      email,
      phone,
      password,
      currentLocation: {
        type: "Point",
        coordinates: [0, 0], // Default coordinates, can be updated later
      },
    })

    if (vendor) {
      const token = generateToken(vendor._id)
      res.status(201).json({
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        isVerified: vendor.isVerified,
        token,
      })
    } else {
      res.status(400)
      throw new Error("Invalid vendor data")
    }
  } catch (error) {
    next(error)
  }
}

export const loginVendor = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const vendor = await Vendor.findOne({ email })

    if (vendor && (await vendor.matchPassword(password))) {
      const token = generateToken(vendor._id)
      res.json({
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        isVerified: vendor.isVerified,
        token,
      })
    } else {
      res.status(401)
      throw new Error("Invalid email or password")
    }
  } catch (error) {
    next(error)
  }
}

export const getVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.user._id).select("-password")
    if (vendor) {
      res.json(vendor)
    } else {
      res.status(404)
      throw new Error("Vendor not found")
    }
  } catch (error) {
    next(error)
  }
}

export const updateVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.user._id)

    if (vendor) {
      vendor.businessName = req.body.businessName || vendor.businessName
      vendor.ownerName = req.body.ownerName || vendor.ownerName
      vendor.email = req.body.email || vendor.email
      vendor.phone = req.body.phone || vendor.phone

      if (req.body.password) {
        vendor.password = req.body.password
      }

      const updatedVendor = await vendor.save()

      res.json({
        _id: updatedVendor._id,
        businessName: updatedVendor.businessName,
        ownerName: updatedVendor.ownerName,
        email: updatedVendor.email,
        phone: updatedVendor.phone,
        isVerified: updatedVendor.isVerified,
      })
    } else {
      res.status(404)
      throw new Error("Vendor not found")
    }
  } catch (error) {
    next(error)
  }
}

export const updateServiceArea = async (req, res, next) => {
  try {
    const { radius, serviceStart, serviceEnd } = req.body

    if (!radius || !serviceStart || !serviceEnd) {
      res.status(400)
      throw new Error("Radius, service start time, and service end time are required")
    }

    const vendor = await Vendor.findById(req.user._id)

    if (!vendor) {
      res.status(404)
      throw new Error("Vendor not found")
    }

    let serviceArea = await ServiceArea.findOne({ vendor: req.user._id })

    if (serviceArea) {
      serviceArea.radius = radius
      serviceArea.serviceStart = serviceStart
      serviceArea.serviceEnd = serviceEnd
    } else {
      if (!vendor.currentLocation || !vendor.currentLocation.coordinates) {
        res.status(400)
        throw new Error("Vendor location not set. Please update your location first.")
      }
      serviceArea = new ServiceArea({
        vendor: req.user._id,
        center: vendor.currentLocation,
        radius,
        pincode: vendor.pincode,
        city: vendor.city,
        state: vendor.state,
        serviceStart,
        serviceEnd,
      })
    }

    const updatedServiceArea = await serviceArea.save()

    res.json({
      message: "Service area updated successfully",
      serviceArea: updatedServiceArea,
    })
  } catch (error) {
    next(error)
  }
}

export const getServiceArea = async (req, res, next) => {
  try {
    const serviceArea = await ServiceArea.findOne({ vendor: req.user._id })

    if (!serviceArea) {
      res.status(404)
      throw new Error("Service area not found")
    }

    res.json(serviceArea)
  } catch (error) {
    next(error)
  }
}

export const updateVendorLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, pincode } = req.body

    if ((!latitude || !longitude) && !pincode) {
      res.status(400)
      throw new Error("Either GPS coordinates (latitude and longitude) or pincode must be provided")
    }

    const vendor = await Vendor.findById(req.user._id)

    if (!vendor) {
      res.status(404)
      throw new Error("Vendor not found")
    }

    let locationDetails

    if (latitude && longitude) {
      locationDetails = await getLocationDetails({ coordinates: { latitude, longitude } })
    } else {
      locationDetails = await getLocationDetails({ pinCode: pincode })
    }

    if (!locationDetails) {
      res.status(400)
      throw new Error("Failed to retrieve location details")
    }

    vendor.currentLocation = {
      type: "Point",
      coordinates: [locationDetails.coordinates.coordinates[0], locationDetails.coordinates.coordinates[1]],
    }
    vendor.pincode = locationDetails.pincode
    vendor.city = locationDetails.city
    vendor.state = locationDetails.state

    const updatedVendor = await vendor.save()

    // Update service area center if it exists
    const serviceArea = await ServiceArea.findOne({ vendor: vendor._id })
    if (serviceArea) {
      serviceArea.center = vendor.currentLocation
      serviceArea.pincode = locationDetails.pincode
      serviceArea.city = locationDetails.city
      serviceArea.state = locationDetails.state
      await serviceArea.save()
    }

    res.json({
      message: "Vendor location updated successfully",
      currentLocation: updatedVendor.currentLocation,
      address: {
        pincode: locationDetails.pincode,
        city: locationDetails.city,
        state: locationDetails.state,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getNearbyVendors = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query // radius in meters, default 5km

    if (!latitude || !longitude) {
      res.status(400)
      throw new Error("Latitude and longitude are required")
    }

    const nearbyVendors = await ServiceArea.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [Number.parseFloat(longitude), Number.parseFloat(latitude)] },
          distanceField: "distance",
          maxDistance: Number.parseInt(radius),
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      { $unwind: "$vendorDetails" },
      {
        $project: {
          _id: 0,
          vendorId: "$vendorDetails._id",
          businessName: "$vendorDetails.businessName",
          distance: 1,
          serviceStart: 1,
          serviceEnd: 1,
        },
      },
    ])

    res.json({
      count: nearbyVendors.length,
      vendors: nearbyVendors,
    })
  } catch (error) {
    next(error)
  }
}

export const getNearbyVendorsForUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("address")
    // console.log(user)

    if (!user || !user.address || !user.address.coordinates) {
      res.status(400)
      throw new Error("User location not found")
    }

    const [longitude, latitude] = user.address.coordinates.coordinates
    const radius = 5000 // 5km radius, you can make this configurable

    const nearbyVendors = await ServiceArea.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          maxDistance: radius,
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      { $unwind: "$vendorDetails" },
      {
        $project: {
          _id: 0,
          vendorId: "$vendorDetails._id",
          businessName: "$vendorDetails.businessName",
          distance: 1,
          serviceStart: 1,
          serviceEnd: 1,
        },
      },
    ])

    res.json({
      count: nearbyVendors.length,
      vendors: nearbyVendors,
    })
  } catch (error) {
    next(error)
  }
}

