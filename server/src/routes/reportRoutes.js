import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getAttendanceReport } from '../controllers/reportController.js';

const router = express.Router();

/**
 * @route   GET /api/reports/attendance
 * @desc    Get attendance data for reports
 * @access  Private (Employee fetches own, Admin/Manager fetches all)
 */
router.get('/attendance', protect, getAttendanceReport);

export default router;