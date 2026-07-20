import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   GET /api/reports/attendance
 * @desc    Get attendance data for reports
 * @access  Private (Employee fetches own, Admin/Manager fetches all)
 */
router.get('/attendance', protect, async (req, res) => {
  try {
    const { role, _id } = req.user;
    const { startDate, endDate, status } = req.query;

    let query = {};
    
    // If the user is an employee, they can only see their own report
    if (role === 'employee') {
      query.employee = _id;
    }

    // Apply Date Range Filter
    if (startDate || endDate) {
      query.attendanceDate = {};
      if (startDate) query.attendanceDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.attendanceDate.$lte = end;
      }
    }

    // Apply Status Filter
    if (status && status !== 'All') {
      query.status = status;
    }
    
    // For simplicity, we just fetch the last 100 records for the report
    
    const reportsData = await Attendance.find(query)
      .populate('employee', 'name email role')
      .sort({ attendanceDate: -1 })
      .limit(100); // Prevent massive payloads for now
      
    res.status(200).json({ reportsData });
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
});

export default router;