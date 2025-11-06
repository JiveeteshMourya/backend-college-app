import { Router } from "express";
import wrapAsync from "../common/utils/wrapAsync.js";
import {
  refreshTokens,
  // seedData,
  userInfo,
  userLogin,
  verifyOtp,
} from "../controllers/authControllers.js";
import { validateRequest } from "../middlewares/validationMiddlewares.js";
import {
  joiLoginSchema,
  joiVerifyOtpSchema,
} from "../common/utils/joiValidationSchemas.js";
import { otpLimiter } from "../middlewares/rateLimiterMiddlewares.js";
const router = Router();

// open routes
router.post(
  "/login/:userType",
  otpLimiter,
  validateRequest(joiLoginSchema),
  wrapAsync(userLogin)
);

router.post(
  "/verify-otp/:userType",
  validateRequest(joiVerifyOtpSchema),
  wrapAsync(verifyOtp)
);

router.post("/refresh-tokens/:userType", wrapAsync(refreshTokens));

// protected routes
router.get("/info/:userType/:userId", wrapAsync(userInfo));

// router.get("/seed-data", wrapAsync(seedData));

export default router;
