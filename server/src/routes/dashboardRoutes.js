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
    const totalManagers = await User.countDocuments({ role: 'manager' });
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    const pendingOvertime = await Overtime.countDocuments({ status: 'Pending' });
    
    // Today's date boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's Attendance
    const todaysAttendanceCount = await Attendance.countDocuments({
      attendanceDate: { $gte: today, $lt: tomorrow }
    });

    // Total Working Hours (Current Month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const attendancesThisMonth = await Attendance.find({ 
      attendanceDate: { $gte: startOfMonth }
    });
    const totalWorkingHours = attendancesThisMonth.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);

    // Department-wise Employees
    const deptAgg = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: "$department", value: { $sum: 1 } } }
    ]);
    const deptData = deptAgg.map(d => ({ name: d._id || 'General', value: d.value }));

    // Chart Data (Last 5 Days)
    const attendanceChartData = [];
    const overtimeData = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayAttendances = await Attendance.find({
        attendanceDate: { $gte: d, $lt: nextD }
      });

      let present = 0, absent = 0, late = 0;
      dayAttendances.forEach(record => {
        if (record.status === 'Completed') present++;
        else if (record.status === 'Incomplete') late++;
        else if (record.status === 'Pending') present++; // Consider pending (punched in but not out) as present
      });
      absent = Math.max(0, activeEmployees - (present + late));

      attendanceChartData.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        present,
        absent,
        late
      });

      // Overtime for this day
      const dayOvertimes = await Overtime.find({
        date: { $gte: d, $lt: nextD },
        status: 'Approved'
      });
      const dayOtHours = dayOvertimes.reduce((acc, curr) => acc + (curr.hours || 0), 0);
      overtimeData.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: dayOtHours
      });
    }

    // Working Hours (Weekly for current month - simplified to 4 weeks)
    const workingHoursData = [];
    let weekStart = new Date(startOfMonth);
    for (let i = 1; i <= 4; i++) {
      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const weekAttendances = await Attendance.find({
        attendanceDate: { $gte: weekStart, $lt: weekEnd }
      });
      const weekHours = weekAttendances.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);
      workingHoursData.push({
        name: `Week ${i}`,
        hours: weekHours
      });
      weekStart = weekEnd;
    }

    // Recent Attendance
    const recentAttendanceRecords = await Attendance.find()
      .populate('employee', 'name')
      .sort({ attendanceDate: -1, punchIn: -1 })
      .limit(5);

    const recentAttendance = recentAttendanceRecords.map(record => ({
      id: record._id,
      name: record.employee?.name || 'Unknown',
      time: record.punchIn ? new Date(record.punchIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
      status: record.status === 'Incomplete' ? 'Late' : 'On Time'
    }));

    res.json({
      totalUsers,
      activeEmployees,
      totalManagers,
      pendingLeaves,
      pendingOvertime,
      todaysAttendance: todaysAttendanceCount,
      totalWorkingHours: Math.round(totalWorkingHours),
      deptData,
      attendanceChartData,
      overtimeData,
      workingHoursData,
      recentAttendance
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
