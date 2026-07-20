import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    punchIn: {
      type: Date,
    },
    punchOut: {
      type: Date,
    },
    checkInSelfie: {
      type: String,
    },
    checkOutSelfie: {
      type: String,
    },
    checkInLatitude: {
      type: Number,
    },
    checkInLongitude: {
      type: Number,
    },
    checkOutLatitude: {
      type: Number,
    },
    checkOutLongitude: {
      type: Number,
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    attendanceDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Incomplete', 'Pending'],
      default: 'Pending',
    },
    remarks: {
      type: String,
    },
    validation: {
      type: String,
      enum: ['Valid', 'Invalid', 'Pending'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;