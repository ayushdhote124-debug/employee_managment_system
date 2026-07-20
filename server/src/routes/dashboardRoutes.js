import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Overtime from '../models/Overtime.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/employee
 * @desc    Get employee dashboard stats
 * @access  Private (Employee)
 */
router.get('/employee', protect, authorize('employee'), async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Present Days & Working Hours (Current Month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const attendancesThisMonth = await Attendance.find({ 
      employee: userId,
      attendanceDate: { $gte: startOfMonth }
    });
    
    const presentDays = attendancesThisMonth.length;
    const totalWorkingHours = attendancesThisMonth.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);

    // 2. Leave Balance
    const approvedLeaves = await Leave.find({ employee: userId, status: 'Approved' });
    const leaveBalance = 15 - approvedLeaves.length;

    // 3. Pending Overtime
    const pendingOvertimeRequests = await Overtime.countDocuments({ employee: userId, status: 'Pending' });

    // 4. Recent Data for Tables
    const recentAttendance = await Attendance.find({ employee: userId })
      .sort({ attendanceDate: -1 })
      .limit(5);
      
    const recentLeaves = await Leave.find({ employee: userId })
      .sort({ createdAt: -1 })
      .limit(3);
      
    const recentOvertime = await Overtime.find({ employee: userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // 5. Chart Data (Last 7 Days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      
      const record = await Attendance.findOne({
        employee: userId,
        attendanceDate: { 
          $gte: d, 
          $lt: new Date(d.getTime() + 24 * 60 * 60 * 1000) 
        }
      });
      
      chartData.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: record ? (record.workingHours || 0) : 0
      });
    }

    res.json({
      presentDays,
      totalWorkingHours: Math.round(totalWorkingHours),
      leaveBalance,
      pendingOvertimeRequests,
      recentAttendance,
      recentLeaves,
      recentOvertime,
      chartData
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/dashboard/manager
 * @desc    Get manager dashboard stats
 * @access  Private (Manager)
 */
router.get('/manager', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    // For manager, show team stats. Assuming manager manages all for now or specific dept.
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    const pendingOT = await Overtime.countDocuments({ status: 'Pending' });
    
    res.json({
      totalEmployees,
      pendingLeaves,
      pendingOT,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/dashboard/admin
 * @desc    Get admin dashboard stats
 * @access  Private (Admin)
 */
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeEmployees = await User.countDocuments({ role: 'employee' });
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    
    // dummy data for charts
    const chartData = [
      { name: 'Mon', attendance: 40, leaves: 2 },
      { name: 'Tue', attendance: 42, leaves: 1 },
      { name: 'Wed', attendance: 41, leaves: 3 },
      { name: 'Thu', attendance: 39, leaves: 4 },
      { name: 'Fri', attendance: 38, leaves: 5 },
    ];

    res.json({
      totalUsers,
      activeEmployees,
      pendingLeaves,
      chartData
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
