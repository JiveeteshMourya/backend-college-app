import mongoose from "mongoose";
import { TEST_TYPES } from "../constants.js";

const testSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
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
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema);
export default Test;
