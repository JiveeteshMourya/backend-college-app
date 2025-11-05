import { Router } from "express";
import wrapAsync from "../common/utils/wrapAsync";
import { userLogin, verifyOtp } from "../controllers/authControllers";
import { validateRequest } from "../middlewares/validationMiddlewares";
import {
  joiLoginSchema,
  joiVerifyOtpSchema,
} from "../common/utils/joiValidationSchemas";
import { otpLimiter } from "../middlewares/rateLimiterMiddlewares";
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

export default router;
