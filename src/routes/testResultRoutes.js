import { Router } from "express";
import { isTeacher } from "../middlewares/teacherMiddlewares.js";
import wrapAsync from "../common/utils/wrapAsync.js";
import {
  getTestResult,
  postTestResult,
} from "../controllers/testResultControllers.js";
import { verifyAccessJWT } from "../middlewares/authMiddlewares.js";
import { isStudent } from "../middlewares/studentMiddlewares.js";
const router = Router();

// protected routes
router.post(
  "/:t_id/:c_id/:s_id",
  verifyAccessJWT,
  isTeacher,
  wrapAsync(postTestResult)
);

router.get("/", verifyAccessJWT, isStudent, wrapAsync(getTestResult));

export default router;
