import { User } from "../../models/User.js"
import { generateToken } from "../../utils/auth.js"

export const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400)
      throw new Error("User already exists")
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      isAdmin: true,
    })

    if (user) {
      const token = generateToken(user._id)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token,
      })
    } else {
      res.status(400)
      throw new Error("Invalid user data")
    }
  } catch (error) {
    next(error)
  }
}

export const getAdminProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (user && user.isAdmin) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error("Admin user not found")
    }
  } catch (error) {
    next(error)
  }
}

