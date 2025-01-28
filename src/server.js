import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import mongoose from "mongoose"
import { config } from "./config/index.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { notFoundHandler } from "./middleware/notFoundHandler.js"
import userRoutes from "./api/routes/userRoutes.js"
import vendorRoutes from "./api/routes/vendorRoutes.js"
import pickupRoutes from "./api/routes/pickupRoutes.js"
import reviewRoutes from "./api/routes/reviewRoutes.js"
import scrapCategoryRoutes from "./api/routes/scrapCategoryRoutes.js"
import adminRoutes from "./api/routes/adminRoutes.js"

const app = express()

// Connect to MongoDB
mongoose
  .connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error))

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

// Routes
app.use("/api/users", userRoutes)
app.use("/api/vendors", vendorRoutes)
app.use("/api/pickups", pickupRoutes)
app.use("/api/scrap-categories", scrapCategoryRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/reviews", reviewRoutes)
//import controller for leaderboard
import {getAllUsers} from "./api/controllers/leaderboardController.js"
app.get("/api/leaderboard", getAllUsers)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

const PORT = config.port || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app

