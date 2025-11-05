import mongoose from "mongoose";
import {
  STREAMS,
  SUBJECTS,
  COURSE_TYPES,
  TEST_TYPES,
  SEMESTERS,
  EDUCATIONS,
} from "../constants.js";

const testSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    number: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },

    type: {
      type: String,
      enum: TEST_TYPES,
      required: true,
      uppercase: true,
      trim: true,
    },

    stream: {
      type: String,
      enum: STREAMS,
      required: true,
      uppercase: true,
      trim: true,
    },

    subject: {
      type: String,
      enum: SUBJECTS,
      required: true,
      uppercase: true,
      trim: true,
    },

    forStudents: {
      type: String,
      enum: EDUCATIONS,
      required: true,
    },

    forSem: {
      type: Number,
      enum: SEMESTERS,
      required: true,
    },

    courseType: {
      type: String,
      enum: COURSE_TYPES,
      required: true,
      uppercase: true,
      trim: true,
    },

    syllabus: {
      type: String,
      trim: true,
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    remarks: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", testSchema);
export default Test;
