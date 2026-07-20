import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import Leave from '../models/Leave.js';
import User from '../models/User.js';

const router = express.Router();
const employeeOrManager = authorize('employee', 'manager');

/**
 * @route   POST /api/leaves
 * @desc    Apply for a new leave
 * @access  Private (Employee Only)
 */
router.post('/', protect, employeeOrManager, async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body;

    if (!startDate || !endDate || !leaveType || !reason) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      startDate,
      endDate,
      leaveType,
      reason
    });

    res.status(201).json({ message: 'Leave application submitted successfully', leave });
  } catch (error) {
    console.error('Apply Leave Error:', error);
    res.status(500).json({ message: 'Server error while applying for leave' });
  }
});

/**
 * @route   GET /api/leaves/my-leaves
 * @desc    Get logged in employee's leave history
 * @access  Private (Employee Only)
 */
router.get('/my-leaves', protect, employeeOrManager, async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ leaves });
  } catch (error) {
    console.error('Get My Leaves Error:', error);
    res.status(500).json({ message: 'Server error while fetching leaves' });
  }
});

/**
 * @route   GET /api/leaves/pending
 * @desc    Get all pending leave requests
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

    const leaves = await Leave.find(filter).populate('employee', 'name email role').sort({ createdAt: -1 });
    res.status(200).json({ leaves });
  } catch (error) {
    console.error('Get Pending Leaves Error:', error);
    res.status(500).json({ message: 'Server error while fetching pending leaves' });
  }
});

/**
 * @route   PATCH /api/leaves/:id/status
 * @desc    Approve or reject a leave
 * @access  Private (Manager/Admin Only)
 */
router.patch('/:id/status', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leave = await Leave.findById(req.params.id).populate('employee');
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    // Restrict manager from approving non-employee requests
    if (req.user.role === 'manager' && leave.employee.role !== 'employee') {
      return res.status(403).json({ message: 'Managers can only approve employee requests.' });
    }

    leave.status = status;
    // Add logic to record who approved it if schema supports it, e.g. leave.approvedBy = req.user._id
    await leave.save();

    res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    console.error('Update Leave Status Error:', error);
    res.status(500).json({ message: 'Server error while updating leave status' });
  }
});

export default router;
