import mongoose from "mongoose";
import {
  EDUCATIONS,
  STREAMS,
  SEMESTERS,
  SUBJECTS,
  COURSE_TYPES,
} from "../constants.js";

const classSchema = new mongoose.Schema(
  {
    education: {
      type: String,
      enum: EDUCATIONS,
      required: true,
    },
    stream: {
      type: String,
      enum: STREAMS,
      required: true,
    },
    semester: {
      type: Number,
      enum: SEMESTERS,
      required: true,
    },
    subject: {
      type: String,
      enum: SUBJECTS,
      required: true,
    },
    courseType: {
      type: String,
      enum: COURSE_TYPES,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);
export default Class;
