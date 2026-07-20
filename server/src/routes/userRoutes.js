import express from 'express';
import { getAllUsers, getUserById, updateUserProfile, createUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'manager'), getAllUsers);
router.post('/', protect, authorize('admin'), createUser);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', protect, getUserById);

export default router;