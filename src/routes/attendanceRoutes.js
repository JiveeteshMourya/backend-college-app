import { Router } from "express";
import { verifyAccessJWT } from "../middlewares/authMiddlewares.js";
import {
  isClassTeacher,
  isTeacher,
} from "../middlewares/teacherMiddlewares.js";
import { validateRequest } from "../middlewares/validationMiddlewares.js";
import { joiAttendanceSchema } from "../common/utils/joiValidationSchemas.js";
import wrapAsync from "../common/utils/wrapAsync.js";
import {
  deleteAttendance,
  getAttendance,
  getStudentAttendance,
  postAttendance,
  putAttendance,
} from "../controllers/attendanceControllers.js";
import { isStudentOrParent } from "../middlewares/studentMiddlewares.js";

const router = Router();

// protected routes
router.post(
  "/",
  verifyAccessJWT,
  isTeacher,
  //   validateRequest(joiAttendanceSchema),
  wrapAsync(postAttendance)
);

router.get(
  "/student/:s_id",
  verifyAccessJWT,
  //   isStudentOrParent,
  wrapAsync(getStudentAttendance)
);

router.put(
  "/:a_id",
  verifyAccessJWT,
  isTeacher,
  //   isClassTeacher,
  wrapAsync(putAttendance)
);

router.get(
  "/",
  verifyAccessJWT,
  isTeacher,
  //   isClassTeacher,
  wrapAsync(getAttendance)
);

router.delete(
  "/:a_id",
  verifyAccessJWT,
  isTeacher,
  //   isClassTeacher,
  wrapAsync(deleteAttendance)
);

export default router;
