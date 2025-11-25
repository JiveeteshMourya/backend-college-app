import logger from "../common/utils/logger.js";
import ServerError from "../common/errors/ServerError.js";
import ServerResponse from "../common/utils/ServerResponse.js";
import Attendance from "../models/attendanceModel.js";
import Class from "../models/classModel.js";

export const postAttendance = async (req, res) => {
  logger.http(
    `postAttendance - POST ${req.originalUrl} payload=${JSON.stringify(req.body)}`
  );

  const { classId, date, attendance } = req.body;

  if (!attendance || typeof attendance !== "object") {
    logger.warn("postAttendance - invalid attendance object");
    throw new ServerError(400, "Invalid attendance format");
  }

  // Check if class exists
  const classExists = await Class.findById(classId);
  if (!classExists) {
    logger.warn(`postAttendance - class not found: ${classId}`);
    throw new ServerError(404, "Class not found");
  }

  // Check if attendance for same class & date exists
  const existing = await Attendance.findOne({
    classId,
    date: new Date(date),
  });

  if (existing) {
    logger.warn(
      `postAttendance - duplicate attendance attempted for class=${classId} date=${date}`
    );
    throw new ServerError(409, "Attendance for this date already exists");
  }

  const newAttendance = await Attendance.create({
    classId,
    date: new Date(date),
    takenBy: req.user._id,
    attendance,
  });

  if (!newAttendance) {
    logger.error("postAttendance - Failed to create attendance");
    throw new ServerError(500, "Failed to create attendance");
  }

  logger.info(
    `postAttendance - Attendance created successfully for class=${classId} date=${date}`
  );

  return res
    .status(201)
    .json(
      new ServerResponse(
        201,
        { attendance: newAttendance },
        "Attendance created successfully"
      )
    );
};

export const getStudentAttendance = async (req, res) => {
  logger.http(
    `getStudentAttendance - GET ${req.originalUrl} params=${JSON.stringify(
      req.params
    )}, query=${JSON.stringify(req.query)}`
  );

  const { s_id } = req.params;
  const { month, year } = req.query;

  if (!s_id) {
    logger.warn("getStudentAttendance - missing student id");
    throw new ServerError(400, "Student ID is required");
  }

  if (!month || !year) {
    logger.warn("getStudentAttendance - missing month or year");
    throw new ServerError(400, "Month and year are required");
  }

  const m = parseInt(month);
  const y = parseInt(year);

  if (isNaN(m) || isNaN(y) || m < 1 || m > 12) {
    logger.warn("getStudentAttendance - invalid month/year");
    throw new ServerError(400, "Invalid month or year");
  }

  // Build date range
  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0); // last day of month

  // Fetch attendance for only this month
  const records = await Attendance.find({
    [`attendance.${s_id}`]: { $exists: true },
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  if (!records) {
    logger.error(
      `getStudentAttendance - database error while fetching for student=${s_id}`
    );
    throw new ServerError(500, "Failed to fetch attendance");
  }

  const formatted = records.map((r) => ({
    date: r.date,
    status: r.attendance.get(s_id),
  }));

  logger.info(
    `getStudentAttendance - Found ${formatted.length} records for student=${s_id} in month=${month}, year=${year}`
  );

  return res
    .status(200)
    .json(
      new ServerResponse(
        200,
        { attendance: formatted },
        "Student monthly attendance fetched successfully"
      )
    );
};

export const getAttendance = async (req, res) => {};
export const putAttendance = async (req, res) => {};
export const deleteAttendance = async (req, res) => {};
