import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Attendance from './src/models/Attendance.js';
import Leave from './src/models/Leave.js';
import Overtime from './src/models/Overtime.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee-management';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Delete all existing data
    await User.deleteMany();
    await Attendance.deleteMany();
    await Leave.deleteMany();
    await Overtime.deleteMany();
    console.log('Old data cleared.');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@company.com',
      password: 'password123',
      role: 'admin',
      department: 'Management'
    });

    // 2. Create Managers
    const manager1 = await User.create({
      name: 'John Manager',
      email: 'manager1@company.com',
      password: 'password123',
      role: 'manager',
      department: 'Engineering'
    });

    const manager2 = await User.create({
      name: 'Sarah Manager',
      email: 'manager2@company.com',
      password: 'password123',
      role: 'manager',
      department: 'HR'
    });

    // 3. Create Employees
    const employees = [];
    for (let i = 1; i <= 10; i++) {
      const emp = await User.create({
        name: `Employee ${i}`,
        email: `employee${i}@company.com`,
        password: 'password123',
        role: 'employee',
        department: i <= 5 ? 'Engineering' : 'HR'
      });
      employees.push(emp);
    }
    
    console.log('Users created successfully.');

    // 4. Generate Attendance for the current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.getDate();
    
    const attendances = [];
    for (const emp of employees) {
      // Loop through past days of this month
      for (let d = 1; d <= today; d++) {
        const date = new Date(currentYear, currentMonth, d);
        if (date.getDay() === 0) continue; // Skip Sundays
        
        // Randomly decide if present (80%), late/half-day (10%), absent (10%)
        const rand = Math.random();
        if (rand < 0.1) continue; // Absent, no record

        let punchIn = new Date(date);
        punchIn.setHours(9, Math.floor(Math.random() * 30), 0); // 9:00 AM - 9:30 AM
        
        let punchOut = null;
        let hours = 0;
        let status = 'Pending';

        if (d < today) {
          // Past days must have punched out
          punchOut = new Date(date);
          
          if (rand < 0.9) {
            punchOut.setHours(18, Math.floor(Math.random() * 30), 0); // 6:00 PM - 6:30 PM
            hours = 9;
            status = 'Completed';
          } else {
            // Half day
            punchOut.setHours(14, 0, 0); // 2:00 PM
            hours = 5;
            status = 'Incomplete';
          }
        }

        attendances.push({
          employee: emp._id,
          punchIn,
          punchOut,
          workingHours: hours,
          attendanceDate: date,
          status,
          checkInLatitude: 22.73,
          checkInLongitude: 75.88,
          checkOutLatitude: 22.73,
          checkOutLongitude: 75.88
        });
      }
    }
    await Attendance.insertMany(attendances);
    console.log('Attendance records generated.');

    // 5. Generate Leaves
    const leaves = [];
    for (let i = 0; i < 5; i++) {
      const start = new Date(currentYear, currentMonth, Math.floor(Math.random() * 20) + 1);
      const end = new Date(start);
      end.setDate(start.getDate() + Math.floor(Math.random() * 3));
      
      leaves.push({
        employee: employees[Math.floor(Math.random() * employees.length)]._id,
        startDate: start,
        endDate: end,
        leaveType: ['Sick Leave', 'Casual Leave', 'Annual Leave'][Math.floor(Math.random() * 3)],
        reason: 'Personal reason',
        status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)]
      });
    }
    await Leave.insertMany(leaves);
    console.log('Leave records generated.');

    // 6. Generate Overtimes
    const overtimes = [];
    for (let i = 0; i < 15; i++) {
      overtimes.push({
        employee: employees[Math.floor(Math.random() * employees.length)]._id,
        date: new Date(currentYear, currentMonth, Math.floor(Math.random() * today) + 1),
        hours: [1, 2, 2.5, 3, 4][Math.floor(Math.random() * 5)],
        reason: 'Project deadline',
        status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)]
      });
    }
    await Overtime.insertMany(overtimes);
    console.log('Overtime records generated.');

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
