import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import Attendance from '../models/Attendance.js';
import { uploadToCloudinary } from '../middlewares/uploadMiddleware.js';
import { getAllAttendance } from '../controllers/attendanceController.js';

const router = express.Router();
const employeeOrManager = authorize('employee', 'manager');

/**
 * @route   GET /api/attendance/all
 * @desc    Get all employees' attendance
 * @access  Private (Admin/Manager)
 */
router.get('/all', protect, authorize('admin', 'manager'), getAllAttendance);

/**
 * @route   GET /api/attendance/today
 * @desc    Get today's attendance record for the employee
 * @access  Private (Employee Only)
 */
router.get('/today', protect, employeeOrManager, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employee: req.user._id,
      attendanceDate: { $gte: startOfToday, $lte: endOfToday },
    });

    res.status(200).json({ attendance });
  } catch (error) {
    console.error('Get Today Attendance Error:', error);
    res.status(500).json({ message: 'Server error while fetching today attendance' });
  }
});

/**
 * @route   POST /api/attendance/punch-in
 * @desc    Record employee punch in (photo, gps, timestamp)
 * @access  Private (Employee Only)
 */
router.post('/punch-in', protect, employeeOrManager, async (req, res) => {
  try {
    const { photo, latitude, longitude } = req.body;

    if (!photo || !latitude || !longitude) {
      return res.status(400).json({ message: 'Photo and location data are required.' });
    }

    // Check if already punched in today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      employee: req.user._id,
      attendanceDate: { $gte: startOfToday, $lte: endOfToday },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'You have already punched in for today.' });
    }

    // In a real scenario, this is where Cloudinary upload happens.
    // If the .env keys are missing, we'll gracefully mock the URL so the app doesn't crash during dev.
    let selfieUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
      selfieUrl = await uploadToCloudinary(photo, 'punch_in_selfies');
    } else {
      console.warn('Cloudinary keys missing. Skipping actual upload and using mock URL.');
    }

    const attendance = await Attendance.create({
      employee: req.user._id,
      attendanceDate: startOfToday,
      punchIn: new Date(),
      checkInSelfie: selfieUrl,
      checkInLatitude: latitude,
      checkInLongitude: longitude,
      status: 'Pending',
      validation: 'Pending'
    });

    res.status(201).json({ message: 'Successfully punched in', attendance });
  } catch (error) {
    console.error('Punch In Error:', error);
    res.status(500).json({ message: 'Server error during punch in' });
  }
});

/**
 * @route   POST /api/attendance/punch-out
 * @desc    Record employee punch out and calculate hours
 * @access  Private (Employee Only)
 */
router.post('/punch-out', protect, employeeOrManager, async (req, res) => {
  try {
    const { photo, latitude, longitude } = req.body;

    if (!photo || !latitude || !longitude) {
      return res.status(400).json({ message: 'Photo and location data are required.' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employee: req.user._id,
      attendanceDate: { $gte: startOfToday, $lte: endOfToday },
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No punch-in record found for today.' });
    }

    if (attendance.punchOut) {
      return res.status(400).json({ message: 'You have already punched out for today.' });
    }

    // Upload check-out selfie
    let selfieUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
      selfieUrl = await uploadToCloudinary(photo, 'punch_out_selfies');
    }

    // Calculate time differences
    const punchOutTime = new Date();
    const diffMs = punchOutTime.getTime() - attendance.punchIn.getTime();
    const diffHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    attendance.punchOut = punchOutTime;
    attendance.checkOutSelfie = selfieUrl;
    attendance.checkOutLatitude = latitude;
    attendance.checkOutLongitude = longitude;
    attendance.workingHours = diffHours;

    // Status logic as per requirements: >= 8 hours -> Completed, < 8 hours -> Incomplete
    if (diffHours >= 8) {
      attendance.status = 'Completed';
    } else {
      attendance.status = 'Incomplete';
    }

    await attendance.save();

    res.status(200).json({ message: 'Successfully punched out', attendance });
  } catch (error) {
    console.error('Punch Out Error:', error);
    res.status(500).json({ message: 'Server error during punch out' });
  }
});
/**
 * @route   GET /api/attendance/history
 * @desc    Get attendance history for the logged-in employee (last N days)
 * @access  Private (Employee Only)
 */
router.get('/history', protect, employeeOrManager, async (req, res) => {
  try {
    const history = await Attendance.find({ employee: req.user._id })
      .sort({ attendanceDate: -1 })
      .limit(30); // fetch last 30 for flexibility, frontend can pick 5
    res.status(200).json({ history });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance history' });
  }
});

export default router;