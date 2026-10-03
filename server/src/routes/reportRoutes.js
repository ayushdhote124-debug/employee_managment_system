import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
  getAttendanceReport, 
  downloadAttendanceReportPDF, 
  downloadAttendanceReportExcel 
} from '../controllers/reportController.js';

const router = express.Router();

/**
 * @route   GET /api/reports/attendance
 * @desc    Get attendance data for reports
 * @access  Private (Employee fetches own, Admin/Manager fetches all)
 */
router.get('/attendance', protect, getAttendanceReport);
router.get('/attendance/download/pdf', protect, downloadAttendanceReportPDF);
router.get('/attendance/download/excel', protect, downloadAttendanceReportExcel);

export default router;