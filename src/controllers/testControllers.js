import mongoose from "mongoose";
import Test from "../models/testModel.js";
import Class from "../models/classModel.js";
import logger from "../common/utils/logger.js";
import ServerError from "../common/errors/ServerError.js";
import ServerResponse from "../common/utils/ServerResponse.js";

export const getTest = async (req, res) => {
  const { t_id } = req.params;

  logger.http(`getTest - GET ${req.originalUrl} testId=${t_id}`);

  if (!mongoose.Types.ObjectId.isValid(t_id)) {
    throw new ServerError(400, "Invalid test ID provided.");
  }

  const test = await Test.findById(t_id)
    .populate("teacherId", "firstName lastName email empId")
    .populate("classId", "subject courseType semester stream")
    .lean();

  if (!test) {
    throw new ServerError(404, "Test not found.");
  }

  logger.info(`getTest - Test ${t_id} fetched successfully.`);
  return res
    .status(200)
    .json(new ServerResponse(200, test, "Test details fetched successfully."));
};

export const postTest = async (req, res) => {
  const { classId, number, type, syllabus, date, totalMarks, remarks } =
    req.body;
  const teacherId = req.user._id;

  logger.http(
    `postTest - POST ${req.originalUrl} teacher=${teacherId} payload=${JSON.stringify(
      req.body
    )}`
  );

  if (!mongoose.Types.ObjectId.isValid(classId)) {
    throw new ServerError(400, "Invalid class ID provided.");
  }

  const classExists = await Class.findById(classId);
  if (!classExists) {
    throw new ServerError(404, "Class not found.");
  }

  const newTest = await Test.create({
    teacherId,
    classId,
    number,
    type,
    syllabus,
    date,
    totalMarks,
    remarks,
  });

  logger.info(
    `postTest - Test ${newTest._id} created successfully by ${teacherId}`
  );

  // TODO: Trigger notification to all students of that class here
  return res
    .status(201)
    .json(
      new ServerResponse(
        201,
        newTest,
        "Test created successfully and students notified."
      )
    );
};

export const myTests = async (req, res) => {
  const { status, _class } = req.query;
  const userType = req.userType;
  const userId = req.user._id;

  logger.http(
    `myTests - POST ${req.originalUrl} user=${userId} userType=${userType}`
  );

  const filters = {};

  // --- For Teacher ---
  if (userType === 2) {
    filters.teacherId = userId;
    if (_class) filters.classId = _class;
    if (status) filters.status = status;
  }

  // --- For Student ---
  if (userType === 0) {
    const classIds = await Class.find({ students: userId }).distinct("_id");
    filters.classId = { $in: classIds };
    if (status) filters.status = status;
  }

  const tests = await Test.find(filters)
    .populate("classId", "subject courseType semester stream")
    .sort({ date: 1 });

  if (!tests || tests.length === 0) {
    return res
      .status(200)
      .json(new ServerResponse(200, [], "No tests found for this user."));
  }

  logger.info(`myTests - ${tests.length} tests found for user ${userId}`);
  return res
    .status(200)
    .json(new ServerResponse(200, tests, "Tests fetched successfully."));
};

export const putTest = async (req, res) => {
  const { t_id } = req.params;
  const teacherId = req.user._id;

  logger.http(
    `putTest - PUT ${req.originalUrl} teacher=${teacherId} payload=${JSON.stringify(
      req.body
    )}`
  );

  if (!mongoose.Types.ObjectId.isValid(t_id)) {
    throw new ServerError(400, "Invalid test ID provided.");
  }

  const test = await Test.findOne({ _id: t_id, teacherId });
  if (!test) {
    throw new ServerError(404, "Test not found or access denied.");
  }

  Object.assign(test, req.body);
  await test.save();

  logger.info(
    `putTest - Test ${t_id} updated successfully by teacher ${teacherId}`
  );

  // TODO: Trigger notifications on update/completion
  return res
    .status(200)
    .json(
      new ServerResponse(
        200,
        test,
        "Test updated successfully and notifications sent."
      )
    );
};

export const deleteTest = async (req, res) => {
  const { t_id } = req.params;
  const teacherId = req.user._id;

  logger.http(`deleteTest - DELETE ${req.originalUrl} teacher=${teacherId}`);

  if (!mongoose.Types.ObjectId.isValid(t_id)) {
    throw new ServerError(400, "Invalid test ID provided.");
  }

  const test = await Test.findOne({ _id: t_id, teacherId });
  if (!test) {
    throw new ServerError(404, "Test not found or access denied.");
  }

  test.status = "CANCELLED";
  await test.save();

  logger.info(`deleteTest - Test ${t_id} cancelled by teacher ${teacherId}`);

  // TODO: Trigger cancellation notification to students
  return res
    .status(200)
    .json(
      new ServerResponse(
        200,
        test,
        "Test cancelled successfully and students notified."
      )
    );
};
