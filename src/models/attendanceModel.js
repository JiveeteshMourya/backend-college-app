import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    // each key is studentId, value = 0,1,2
    attendance: {
      type: Map,
      of: {
        type: Number, // 0 = not marked, 1 = present, 2 = absent
        enum: [0, 1, 2],
        default: 0,
      },
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;
