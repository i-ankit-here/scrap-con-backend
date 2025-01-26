import { User } from "../../models/User.js"
import { UserAddress } from "../../models/UserAddress.js"
import { generateToken } from "../../utils/auth.js"
import { getLocationDetails } from "../../services/geocodingService.js"

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error("User already exists")
    }

    const user = await User.create({ name, email, phone, password })
    const token = generateToken(user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
    })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).populate("address")

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id)
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token,
        address: user.address
          ? {
              coordinates: user.address.coordinates,
              addressLine1: user.address.addressLine1,
              addressLine2: user.address.addressLine2,
              city: user.address.city,
              state: user.address.state,
              pincode: user.address.pincode,
            }
          : null,
      })
    } else {
      res.status(401)
      throw new Error("Invalid email or password")
    }
  } catch (error) {
    next(error)
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    } else {
      res.status(404)
      throw new Error("User not found")
    }
  } catch (error) {
    next(error)
  }
}

export const updateUserLocation = async (req, res, next) => {
  try {
    const { pinCode, coordinates } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error("User not found")
    }

    let locationDetails

    if (coordinates) {
      locationDetails = await getLocationDetails({coordinates})
    } else if (pinCode) {
      locationDetails = await getLocationDetails({ pinCode })
    } else {
      res.status(400)
      throw new Error("Either PIN code or coordinates must be provided")
    }

    let userAddress = await UserAddress.findOne({ user: user._id })
    if (!userAddress) {
      userAddress = new UserAddress({ user: user._id })
    }

    userAddress.addressLine1 = locationDetails.addressLine1 || ""
    userAddress.addressLine2 = locationDetails.addressLine2 || ""
    userAddress.city = locationDetails.city
    userAddress.state = locationDetails.state
    userAddress.pincode = locationDetails.pincode
    userAddress.coordinates = locationDetails.coordinates

    await userAddress.save()

    // Update the user's address reference
    user.address = userAddress._id
    await user.save()

    res.json({
      message: "Location updated successfully",
      address: userAddress,
    })
  } catch (error) {
    next(error)
  }
}

