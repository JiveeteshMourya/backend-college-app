import mongoose from "mongoose";
import { SUBJECTS } from "../constants.js";

const departmentSchema = new mongoose.Schema(
  {
    userType: { type: Number, default: 3 }, // 3 = department/club role
    deptName: { type: String, enum: SUBJECTS, unique: true, required: true },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    description: { type: String, trim: true },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "OTP", default: null },
    refreshToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
