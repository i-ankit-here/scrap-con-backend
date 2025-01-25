import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserLocation } from '../controllers/userController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/update-location', protect, updateUserLocation);

export default router;

