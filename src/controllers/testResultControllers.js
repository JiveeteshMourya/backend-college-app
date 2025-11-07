import mongoose from "mongoose";
import Test from "../models/testModel.js";
import Class from "../models/classModel.js";
import TestResult from "../models/testResultModel.js";
import logger from "../common/utils/logger.js";
import ServerError from "../common/errors/ServerError.js";
import ServerResponse from "../common/utils/ServerResponse.js";

export const postTestResult = async (req, res) => {
  const { t_id, c_id, s_id } = req.params;
  const { marksObtained, totalMarks, remarks, status } = req.body;
  const teacherId = req.user._id;

  logger.http(
    `postTestResult - POST ${req.originalUrl} teacher=${teacherId} payload=${JSON.stringify(
      req.body
    )}`
  );

  // --- Validate Object IDs ---
  if (
    !mongoose.Types.ObjectId.isValid(t_id) ||
    !mongoose.Types.ObjectId.isValid(c_id) ||
    !mongoose.Types.ObjectId.isValid(s_id)
  ) {
    throw new ServerError(400, "Invalid test, class, or student ID provided.");
  }

  // --- Check if test exists and belongs to the teacher ---
  const test = await Test.findOne({ _id: t_id, classId: c_id, teacherId });
  if (!test) {
    throw new ServerError(404, "Test not found or access denied.");
  }

  // --- Check if student is part of this class ---
  const classData = await Class.findById(c_id).select("students");
  if (
    !classData ||
    !classData.students.includes(new mongoose.Types.ObjectId(s_id))
  ) {
    throw new ServerError(403, "Student does not belong to this class.");
  }

  // --- Validate Marks ---
  if (marksObtained > totalMarks) {
    throw new ServerError(400, "Marks obtained cannot exceed total marks.");
  }

  // --- Create or Update Test Result ---
  let result = await TestResult.findOne({ testId: t_id, studentId: s_id });

  if (result) {
    result.marksObtained = marksObtained;
    result.totalMarks = totalMarks;
    result.remarks = remarks || result.remarks;
    result.status = status || "DECLARED";
    await result.save();
    logger.info(
      `postTestResult - Updated marks for student ${s_id} in test ${t_id}`
    );
  } else {
    result = await TestResult.create({
      testId: t_id,
      classId: c_id,
      studentId: s_id,
      marksObtained,
      totalMarks,
      remarks,
      status: status || "DECLARED",
    });
    logger.info(
      `postTestResult - Created result for student ${s_id} in test ${t_id}`
    );
  }

  // --- Optional: auto-update test status if all results submitted ---
  const classStudents = classData.students.length;
  const declaredCount = await TestResult.countDocuments({
    testId: t_id,
    status: "DECLARED",
  });
  if (declaredCount === classStudents) {
    test.status = "COMPLETED";
    await test.save();
    logger.info(
      `postTestResult - All results declared, test ${t_id} marked COMPLETED.`
    );
  }

  // TODO: Trigger student + parent notification here

  return res
    .status(200)
    .json(
      new ServerResponse(
        200,
        result,
        "Test result saved and notifications sent."
      )
    );
};

export const getTestResult = async (req, res) => {
  const studentId = req.user._id;

  logger.http(`getTestResult - GET ${req.originalUrl} student=${studentId}`);

  const results = await TestResult.find({ studentId })
    .populate({
      path: "testId",
      select: "type number date totalMarks status",
      populate: {
        path: "classId",
        select: "subject courseType semester stream",
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  if (!results || results.length === 0) {
    return res
      .status(200)
      .json(
        new ServerResponse(200, [], "No test results found for this student.")
      );
  }

  logger.info(
    `getTestResult - ${results.length} results fetched for student ${studentId}`
  );

  return res
    .status(200)
    .json(
      new ServerResponse(200, results, "Test results fetched successfully.")
    );
};
