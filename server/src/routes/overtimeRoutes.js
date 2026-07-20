import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import Overtime from '../models/Overtime.js';
import User from '../models/User.js';

const router = express.Router();
const employeeOrManager = authorize('employee', 'manager');

/**
 * @route   POST /api/overtime
 * @desc    Submit an overtime request
 * @access  Private (Employee Only)
 */
router.post('/', protect, employeeOrManager, async (req, res) => {
  try {
    const { date, startTime, endTime, hours, reason } = req.body;

    if (!date || !hours) {
      return res.status(400).json({ message: 'Date and hours are required.' });
    }

    const overtime = await Overtime.create({
      employee: req.user._id,
      date,
      startTime,
      endTime,
      hours,
      reason
    });

    res.status(201).json({ message: 'Overtime request submitted successfully', overtime });
  } catch (error) {
    console.error('Submit Overtime Error:', error);
    res.status(500).json({ message: 'Server error while submitting overtime' });
  }
});

/**
 * @route   GET /api/overtime/my-overtime
 * @desc    Get logged in employee's overtime history
 * @access  Private (Employee Only)
 */
router.get('/my-overtime', protect, employeeOrManager, async (req, res) => {
  try {
    const overtimes = await Overtime.find({ employee: req.user._id }).sort({ date: -1 });
    res.status(200).json({ overtimes });
  } catch (error) {
    console.error('Get My Overtime Error:', error);
    res.status(500).json({ message: 'Server error while fetching overtime requests' });
  }
});

/**
 * @route   GET /api/overtime/pending
 * @desc    Get all pending overtime requests
 * @access  Private (Manager/Admin Only)
 */
router.get('/pending', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    let filter = { status: 'Pending' };

    // If manager, only fetch requests from employees
    if (req.user.role === 'manager') {
      const employees = await User.find({ role: 'employee' }).select('_id');
      const employeeIds = employees.map(emp => emp._id);
      filter.employee = { $in: employeeIds };
    }

    const overtime = await Overtime.find(filter).populate('employee', 'name email role').sort({ createdAt: -1 });
    res.status(200).json({ overtime });
  } catch (error) {
    console.error('Get Pending Overtime Error:', error);
    res.status(500).json({ message: 'Server error while fetching pending overtime' });
  }
});

/**
 * @route   PATCH /api/overtime/:id/status
 * @desc    Approve or reject an overtime request
 * @access  Private (Manager/Admin Only)
 */
router.patch('/:id/status', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const overtime = await Overtime.findById(req.params.id).populate('employee');
    if (!overtime) return res.status(404).json({ message: 'Overtime request not found' });

    // Restrict manager from approving non-employee requests
    if (req.user.role === 'manager' && overtime.employee.role !== 'employee') {
      return res.status(403).json({ message: 'Managers can only approve employee requests.' });
    }

    overtime.status = status;
    await overtime.save();

    res.status(200).json({ message: `Overtime ${status.toLowerCase()} successfully`, overtime });
  } catch (error) {
    console.error('Update Overtime Status Error:', error);
    res.status(500).json({ message: 'Server error while updating overtime status' });
  }
});

export default router;