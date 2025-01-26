import axios from "axios"
import { config } from "../config/index.js"

export const getLocationDetails = async (input) => {
  try {
    let url
    if (input.pinCode) {
      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${input.pinCode}&key=${config.googleMapsApiKey}`
    } else if (input.coordinates) {
      const { latitude, longitude } = input.coordinates
      url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.googleMapsApiKey}`
    } else {
      throw new Error("Invalid input for geocoding")
    }

    const response = await axios.get(url)
    const result = response.data.results[0]

    if (!result) {
      throw new Error("No results found for the given location")
    }

    const addressComponents = result.address_components
    const formattedAddress = result.formatted_address

    const locationDetails = {
      addressLine1: formattedAddress.split(",")[0],
      addressLine2: "",
      city: getAddressComponent(addressComponents, "locality"),
      state: getAddressComponent(addressComponents, "administrative_area_level_1"),
      pincode: getAddressComponent(addressComponents, "postal_code"),
      coordinates: {
        type: "Point",
        coordinates: [result.geometry.location.lng, result.geometry.location.lat],
      },
    }

    return locationDetails
  } catch (error) {
    console.error("Error in geocoding service:", error)
    throw new Error("Failed to retrieve location details")
  }
}

const getAddressComponent = (components, type) => {
  const component = components.find((comp) => comp.types.includes(type))
  return component ? component.long_name : ""
}

