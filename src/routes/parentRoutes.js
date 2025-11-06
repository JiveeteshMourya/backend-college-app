import { Router } from "express";
import { verifyAccessJWT } from "../middlewares/authMiddlewares.js";
import { isParent } from "../middlewares/parentMiddlewares.js";
import wrapAsync from "../common/utils/wrapAsync.js";
import {
  getTestResults,
  getUpcomingTests,
} from "../controllers/parentControllers.js";
const router = Router();

// protected routes
router.get(
  "/test-results",
  verifyAccessJWT,
  isParent,
  wrapAsync(getTestResults)
);

router.get(
  "/upcoming-tests",
  verifyAccessJWT,
  isParent,
  wrapAsync(getUpcomingTests)
);

export default router;
