import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  databaseURL: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  environment: process.env.NODE_ENV || 'development',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
};

