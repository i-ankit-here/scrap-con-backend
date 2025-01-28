import { Pickup } from "../../models/Pickup.js"
import { User } from "../../models/User.js"
import { Vendor } from "../../models/Vendor.js"
import { UserAddress } from "../../models/UserAddress.js"
import { CarbonFootprint } from "../../models/CarbonFootprint.js"
import { ScrapCategory } from "../../models/ScrapCategory.js"
import { Leaderboard } from "../../models/Leaderboard.js"

export const requestPickup = async (req, res, next) => {
  try {
    const { vendorId, scheduledDate, items, notes } = req.body

    const customer = await User.findById(req.user._id)
    // console.log(customer)
    if (!customer) {
      res.status(404)
      throw new Error("Customer not found")
    }

    const vendor = await Vendor.findById(vendorId)
    // console.log(vendor)
    if (!vendor) {
      res.status(404)
      throw new Error("Vendor not found")
    }

    const address = await UserAddress.findOne({ user: customer._id })
    if (!address) {
      res.status(400)
      throw new Error("Customer address not found")
    }

    const pickup = new Pickup({
      customer: customer._id,
      vendor: vendor._id,
      scheduledDate,
      address: address._id,
      items,
      notes,
    })

    const savedPickup = await pickup.save()

    res.status(201).json({
      message: "Pickup request created successfully",
      pickup: savedPickup,
    })
  } catch (error) {
    next(error)
  }
}

export const getVendorPickups = async (req, res, next) => {
  try {
    const pickups = await Pickup.find({ vendor: req.user._id })
      .populate("customer", "name email phone")
      .populate("address")
      .sort({ createdAt: -1 })

    res.json(pickups)
  } catch (error) {
    next(error)
  }
}

export const getCustomerPickups = async (req, res, next) => {
  try {
    const pickups = await Pickup.find({ customer: req.user._id })
      .populate("vendor", "businessName phone")
      .populate("address")
      .sort({ createdAt: -1 })

    res.json(pickups)
  } catch (error) {
    next(error)
  }
}

export const updatePickupStatus = async (req, res, next) => {
  try {
    const { pickupId } = req.params
    const { status } = req.body

    const pickup = await Pickup.findById(pickupId)
    if (!pickup) {
      res.status(404)
      throw new Error("Pickup not found")
    }

    if (pickup.vendor.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error("Not authorized to update this pickup")
    }
    if(pickup.status == "completed" && status == "completed"){
      res.status(401)
      throw new Error("Pickup status is already completed")
    }
    pickup.status = status
    const updatedPickup = await pickup.save()
    if (updatedPickup.status == "completed") {

      const categories = await ScrapCategory.find({});
      const obj = {};
      categories.forEach((item) => {
        obj[item._id] = item.carbonFootPrint;
      })
      let carbonSaved = 0;
      let totalQuantity = 0;
      updatedPickup.items.forEach((item) => {
        if (item.unit == "gm") {
          item.quantity = item.quantity / 1000;
        }
        carbonSaved += (obj[item.category] * item.quantity);
        totalQuantity += item.quantity;
      })
      const carbonSavedForPickup = await CarbonFootprint.create({
        user: updatedPickup.customer,
        pickup: updatedPickup._id,
        carbonSaved: carbonSaved
      })
      const leaderBoardUser = await Leaderboard.findOne({ user: updatedPickup.customer });
      if (leaderBoardUser) {
        leaderBoardUser.totalCarbonSaved += carbonSaved;
        leaderBoardUser.totalScrapSold += totalQuantity;
        await leaderBoardUser.save();
      } else {
        const newleaderBoardUser = await Leaderboard.create({
          user: updatedPickup.customer,
          totalCarbonSaved: carbonSaved,
          totalScrapSold: totalQuantity
        })
      }
    }

    res.json({
      message: "Pickup status updated successfully",
      pickup: updatedPickup,
    })
  } catch (error) {
    next(error)
  }
}


export const getPickupHistory = async (req, res, next) => {
  try {
    let history = [];
    if (req.isVendor) {
      history = await Pickup.find({
        vendor: req.user?._id
      })
    } else {
      history = await Pickup.find({
        customer: req.user?._id
      })
    }
    res.status(200).json({ data: history })
  } catch (error) {
    next(error)
  }
}

