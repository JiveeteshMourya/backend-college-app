import mongoose from "mongoose";
import Student from "../models/studentModel.js";
import Class from "../models/classModel.js";
import Test from "../models/testModel.js";
import TestResult from "../models/testResultModel.js";
import logger from "../common/utils/logger.js";
import ServerError from "../common/errors/ServerError.js";
import ServerResponse from "../common/utils/ServerResponse.js";

export const getTestResults = async (req, res) => {
  const parentId = req.user._id;

  logger.http(`getTestResults - GET ${req.originalUrl} parent=${parentId}`);

  // --- Find all students linked to this parent ---
  const students = await Student.find({ guardianId: parentId }).select(
    "_id firstName lastName"
  );

  if (!students.length) {
    logger.warn(`getTestResults - No students found for parent ${parentId}`);
    return res
      .status(200)
      .json(new ServerResponse(200, [], "No students linked to this parent."));
  }

  const studentIds = students.map((s) => s._id);

  // --- Fetch all declared test results for these students ---
  const results = await TestResult.find({
    studentId: { $in: studentIds },
    status: "DECLARED",
  })
    .populate({
      path: "testId",
      select: "type number date totalMarks status",
      populate: {
        path: "classId",
        select: "subject courseType semester stream",
      },
    })
    .populate("studentId", "firstName lastName rollNum")
    .sort({ createdAt: -1 })
    .lean();

  if (!results.length) {
    logger.info(`getTestResults - No test results yet for parent ${parentId}`);
    return res
      .status(200)
      .json(new ServerResponse(200, [], "No declared test results found."));
  }

  logger.info(
    `getTestResults - ${results.length} results fetched for parent ${parentId}`
  );

  return res
    .status(200)
    .json(
      new ServerResponse(200, results, "Test results fetched successfully.")
    );
};

export const getUpcomingTests = async (req, res) => {
  const parentId = req.user._id;

  logger.http(`getUpcomingTests - GET ${req.originalUrl} parent=${parentId}`);

  // --- Find all students linked to this parent ---
  const students = await Student.find({ guardianId: parentId }).select("_id");

  if (!students.length) {
    logger.warn(`getUpcomingTests - No students found for parent ${parentId}`);
    return res
      .status(200)
      .json(new ServerResponse(200, [], "No students linked to this parent."));
  }

  // --- Get all classIds these students belong to ---
  const classIds = await Class.find({
    students: { $in: students.map((s) => s._id) },
  }).distinct("_id");

  if (!classIds.length) {
    logger.warn(`getUpcomingTests - No classes found for parent ${parentId}`);
    return res
      .status(200)
      .json(
        new ServerResponse(200, [], "No classes found for linked students.")
      );
  }

  // --- Fetch all upcoming tests ---
  const today = new Date();
  const tests = await Test.find({
    classId: { $in: classIds },
    date: { $gte: today },
    status: "SCHEDULED",
  })
    .populate("classId", "subject courseType semester stream")
    .populate("teacherId", "firstName lastName email empId")
    .sort({ date: 1 })
    .lean();

  if (!tests.length) {
    logger.info(`getUpcomingTests - No upcoming tests for parent ${parentId}`);
    return res
      .status(200)
      .json(new ServerResponse(200, [], "No upcoming tests found."));
  }

  logger.info(
    `getUpcomingTests - ${tests.length} upcoming tests fetched for parent ${parentId}`
  );

  return res
    .status(200)
    .json(
      new ServerResponse(200, tests, "Upcoming tests fetched successfully.")
    );
};
