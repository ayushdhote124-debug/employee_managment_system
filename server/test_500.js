import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Attendance from './src/models/Attendance.js';

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    console.log('Testing getAllUsers...');
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    console.log(`Success: Found ${users.length} users`);

    console.log('Testing getAllAttendance...');
    const att = await Attendance.find({}).populate('employee', 'name email role department').sort({ attendanceDate: -1, punchIn: -1 });
    console.log(`Success: Found ${att.length} attendance records`);

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    mongoose.disconnect();
  }
}

test();
