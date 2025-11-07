import Class from "../models/classModel.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import mongoose from "mongoose";
import logger from "../common/utils/logger.js";
import ServerError from "../common/errors/ServerError.js";
import ServerResponse from "../common/utils/ServerResponse.js";

export const getAllClasses = async (req, res) => {
  const { userType } = req.params; // "0" for student, "2" for teacher
  const userId = req.user._id;

  logger.http(
    `getAllClasses - GET ${req.originalUrl} userType=${userType} user=${userId}`
  );

  if (!["0", "2"].includes(userType.toString())) {
    throw new ServerError(400, "Invalid user type provided.");
  }

  let classes;

  if (userType == 2) {
    // Teacher
    classes = await Class.find({ teacher: userId })
      .select("_id subject courseType semester stream")
      .sort({ createdAt: -1 });
  } else {
    // Student
    classes = await Class.find({ students: userId })
      .select("_id subject courseType semester stream")
      .sort({ createdAt: -1 });
  }

  if (!classes || classes.length === 0) {
    logger.warn(
      `getAllClasses - No classes found for user ${userId} (${userType})`
    );
    return res
      .status(200)
      .json(new ServerResponse(200, [], "No classes found."));
  }

  logger.info(
    `getAllClasses - ${classes.length} classes found for user ${userId}`
  );

  return res
    .status(200)
    .json(new ServerResponse(200, classes, "Classes fetched successfully."));
};

export const getClass = async (req, res) => {
  const { c_id } = req.params;

  logger.http(`getClass - GET ${req.originalUrl} classId=${c_id}`);

  if (!mongoose.Types.ObjectId.isValid(c_id)) {
    throw new ServerError(400, "Invalid class ID provided.");
  }

  const classData = await Class.findById(c_id)
    .populate(
      "teacher",
      "firstName lastName email empId stream subjectsHandled"
    )
    .populate("students", "firstName lastName email rollNum semester stream")
    .lean();

  if (!classData) {
    logger.warn(`getClass - No class found for ID ${c_id}`);
    throw new ServerError(404, "Class not found.");
  }

  logger.info(
    `getClass - Class ${c_id} fetched successfully with ${
      classData.students?.length || 0
    } students.`
  );

  return res
    .status(200)
    .json(
      new ServerResponse(200, classData, "Class details fetched successfully.")
    );
};
