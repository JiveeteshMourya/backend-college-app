import { Router } from "express";
import { verifyAccessJWT } from "../middlewares/authMiddlewares.js";
import { isTeacher } from "../middlewares/teacherMiddlewares.js";
import wrapAsync from "../common/utils/wrapAsync.js";
import {
  deleteTest,
  getTest,
  myTests,
  postTest,
  putTest,
} from "../controllers/testControllers.js";
const router = Router();

router.get("/:t_id", wrapAsync(getTest));

// protected routes
router.post("/", verifyAccessJWT, isTeacher, wrapAsync(postTest));

router.post("/my-tests", verifyAccessJWT, wrapAsync(myTests));

router.put("/:t_id", verifyAccessJWT, isTeacher, wrapAsync(putTest));

router.delete("/:t_id", verifyAccessJWT, isTeacher, wrapAsync(deleteTest));

export default router;
