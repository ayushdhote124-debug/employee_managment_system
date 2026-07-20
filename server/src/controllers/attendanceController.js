import Attendance from '../models/Attendance.js';

// @desc    Get all employees' attendance
// @route   GET /api/attendance/all
// @access  Private (Admin/Manager)
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate('employee', 'name email role department')
      .sort({ attendanceDate: -1, punchIn: -1 });
    
    res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    console.error('Get All Attendance Error:', error);
    res.status(500).json({ message: 'Server error while fetching all attendance' });
  }
};