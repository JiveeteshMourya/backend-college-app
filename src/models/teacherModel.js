import mongoose from "mongoose";
import { STREAMS, SUBJECTS } from "../constants.js";

const teacherSchema = new mongoose.Schema(
  {
    userType: { type: Number, default: 2 }, // 2 = teacher
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },
    password: { type: String, required: true },
    contactNumber: { type: String, trim: true },
    gender: { type: String, enum: ["M", "F", "O"], default: null },

    empId: { type: String, required: true, unique: true },
    stream: { type: String, enum: STREAMS },
    subjectsHandled: [{ type: String, enum: SUBJECTS }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    clubAdvisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      default: null,
    },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "OTP", default: null },
    address: { type: String, trim: true },
    refreshToken: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
