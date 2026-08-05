import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { submitOvertime, getMyOvertime, getPendingOvertime, updateOvertimeStatus } from '../controllers/overtimeController.js';

const router = express.Router();
const employeeOrManager = authorize('employee', 'manager');

/**
 * @route   POST /api/overtime
 * @desc    Submit an overtime request
 * @access  Private (Employee Only)
 */
router.post('/', protect, employeeOrManager, submitOvertime);

/**
 * @route   GET /api/overtime/my-overtime
 * @desc    Get logged in employee's overtime history
 * @access  Private (Employee Only)
 */
router.get('/my-overtime', protect, employeeOrManager, getMyOvertime);

/**
 * @route   GET /api/overtime/pending
 * @desc    Get all pending overtime requests
 * @access  Private (Manager/Admin Only)
 */
router.get('/pending', protect, authorize('manager', 'admin'), getPendingOvertime);

/**
 * @route   PATCH /api/overtime/:id/status
 * @desc    Approve or reject an overtime request
 * @access  Private (Manager/Admin Only)
 */
router.patch('/:id/status', protect, authorize('manager', 'admin'), updateOvertimeStatus);

export default router;