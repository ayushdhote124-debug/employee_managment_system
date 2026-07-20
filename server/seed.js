import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./src/models/User.js";
import Attendance from "./src/models/Attendance.js";
import Overtime from "./src/models/Overtime.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch(error){
    console.log(error.message);
    process.exit(1);
  }
};

const randomDate = () => {
  const start = new Date("2026-07-01");
  const end = new Date("2026-07-31");
  return new Date(
    start.getTime() +
    Math.random() *
    (end.getTime()-start.getTime())
  );
};

const createAttendance = (employeeId)=>{
  const date = randomDate();
  const punchIn = new Date(date);
  punchIn.setHours(
    9,
    Math.floor(Math.random()*30),
    0
  );

  const punchOut = new Date(punchIn);
  const hours = Math.floor(Math.random()*3)+8;
  punchOut.setHours(
    punchIn.getHours()+hours,
    0,
    0
  );

  return {
    employee: employeeId,
    punchIn,
    punchOut,
    checkInSelfie:"uploads/checkin.jpg",
    checkOutSelfie:"uploads/checkout.jpg",
    checkInLatitude:23.2599,
    checkInLongitude:77.4126,
    checkOutLatitude:23.2599,
    checkOutLongitude:77.4126,
    workingHours:hours,
    attendanceDate:date,
    status:"Completed",
    remarks: "Regular working day",
    validation:"Valid"
  };
};

const seedData = async()=>{
  try{
    await connectDB();

    await User.deleteMany({});
    await Attendance.deleteMany({});
    await Overtime.deleteMany({});

    console.log("Old Data Deleted");

    const password = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name:"Admin User",
      email:"admin@ems.com",
      password: "123456",
      role:"admin"
    });

    await User.insertMany([
      {
        name:"Amit Sharma",
        email:"amit@ems.com",
        password,
        role:"manager"
      },
      {
        name:"Neha Singh",
        email:"neha@ems.com",
        password,
        role:"manager"
      }
    ]);

    const employees = await User.insertMany([
      {
        name:"Rahul Sharma",
        email:"rahul@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Priya Verma",
        email:"priya@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Aman Patel",
        email:"aman@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Rohit Kumar",
        email:"rohit@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Pooja Gupta",
        email:"pooja@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Vikas Mehta",
        email:"vikas@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Karan Singh",
        email:"karan@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Anjali Sharma",
        email:"anjali@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Sahil Jain",
        email:"sahil@ems.com",
        password,
        role:"employee"
      },
      {
        name:"Ravi Verma",
        email:"ravi@ems.com",
        password,
        role:"employee"
      }
    ]);

    console.log("Users Created");

    // Attendance Create
    let attendanceData=[];
    for(let i=0;i<100;i++){
      const employee = employees[Math.floor(Math.random()*employees.length)];
      attendanceData.push(createAttendance(employee._id));
    }

    await Attendance.insertMany(attendanceData);
    console.log("Attendance Created");

    // Overtime
    let overtimeData=[];
    for(let i=0;i<30;i++){
      const employee = employees[Math.floor(Math.random()*employees.length)];
      overtimeData.push({
        employee:employee._id,
        date:randomDate(),
        startTime:"18:00",
        endTime:"20:00",
        hours: Number((Math.random()*3+1).toFixed(2)),
        reason: "Project deadline work",
        status: ["Pending", "Approved", "Rejected"][Math.floor(Math.random()*3)]
      });
    }

    await Overtime.insertMany(overtimeData);
    console.log("Overtime Created");

    console.log("🎉 EMS Database Seed Completed");
    process.exit(0);
  }
  catch(error){
    console.log(error);
    process.exit(1);
  }
};

seedData();
