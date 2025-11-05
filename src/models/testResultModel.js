import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
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
      enum: ["PENDING", "DECLARED", "ABSENT"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
