import mongoose from "mongoose";
import { EDUCATIONS, SEMESTERS, STREAMS, SUBJECTS } from "../constants.js";

const studentSchema = new mongoose.Schema(
  {
    userType: {
      type: Number,
      default: 0, // 0 = student
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      default: null,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: null },
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
    rollNum: { type: String, unique: true, required: true, trim: true },

    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      default: null,
    },

    stream: { type: String, enum: STREAMS, required: true },
    majorSub: { type: String, enum: SUBJECTS, required: true },
    minorSub: { type: String, enum: SUBJECTS },
    genericSub: { type: String, enum: SUBJECTS },
    vocSub: { type: String, enum: SUBJECTS },
    currentEducation: { type: String, enum: EDUCATIONS, required: true },
    semester: { type: Number, enum: SEMESTERS, required: true },

    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", default: null },
    address: { type: String, trim: true },
    dob: { type: Date, required: true },
    validity: { type: Date, required: true },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "OTP", default: null },
    refreshToken: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
