import logger from "../common/utils/logger.js";
import getModelFromUserType from "../common/utils/getModelFromUserType.js";
import ServerError from "../common/errors/ServerError.js";
import { comparePassword } from "../common/utils/authHelper.js";
import { generateAccessAndRefreshTokens } from "../common/utils/jwtHelper.js";
import { authControllersText } from "../responseTexts.js";
import ServerResponse from "../common/utils/ServerResponse.js";
import OTP from "../models/otpModel.js";
import { triggerNodeMailerEmail } from "../common/utils/emailHelper.js";

export const userLogin = async (req, res) => {
  logger.http(
    `userLogin - POST ${req.originalUrl} payload=${JSON.stringify(req.body.email)}`
  );
  const { email, password } = req.body;
  const Model = getModelFromUserType(req.params.userType);

  const user = await Model.findOne({ email, isDeleted: false });
  if (!user) {
    logger.warn(`userLogin - login attempt with non-existent email: ${email}`);
    throw new ServerError(404, authControllersText.userLogin.notFound);
  }

  if (user.isBlocked) {
    logger.error(`userLogin - User Id blocked, access denied. ${user._id}`);
    throw new ServerError(409, authControllersText.userLogin.blocked);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    logger.error(`userLogin - invalid password for user ${user._id}`);
    throw new ServerError(402, authControllersText.userLogin.invalid);
  }

  const otp = await OTP.create({ userId: user._id });
  await triggerNodeMailerEmail({
    type: "OTP",
    payload: {
      toEmail: user.email,
      firstName: user.firstName,
      otpCode: otp.code,
    },
  });

  user.otp = otp._id;
  await user.save();
  logger.info(`userLogin - OTP sent successfully to user ${user._id}`);

  return res
    .status(200)
    .json(
      new ServerResponse(200, { user }, authControllersText.userLogin.success)
    );
};

export const verifyOtp = async (req, res) => {
  logger.http(
    `verifyOtp - POST ${req.originalUrl} payload=${JSON.stringify(req.body)}`
  );

  const { email, otpCode } = req.body;
  const Model = getModelFromUserType(req.params.userType);

  const user = await Model.findOne({ email, isDeleted: false });
  if (!user) {
    logger.warn(
      `verifyOtp - OTP verification attempt for non-existent email: ${email}`
    );
    throw new ServerError(404, authControllersText.verifyOtp.notFound);
  }

  if (user.isBlocked) {
    logger.error(`verifyOtp - User Id blocked, access denied. ${user._id}`);
    throw new ServerError(409, authControllersText.verifyOtp.blocked);
  }

  const isOtpValid = await OTP.findOne({ _id: user.otp });
  if (!isOtpValid) {
    logger.error(`verifyOtp - invalid OTP for user ${user._id}`);
    throw new ServerError(402, authControllersText.verifyOtp.invalid);
  }
  if (Date.now() > isOtpValid.expiresAt.getTime()) {
    logger.warn(`verifyOtp - OTP expired for user ${user._id}`);
    throw new ServerError(410, authControllersText.verifyOtp.otpExpired);
  }

  if (otpCode !== isOtpValid.code) {
    logger.warn(`verifyOtp - invalid OTP for user ${user._id}`);
    throw new ServerError(401, authControllersText.verifyOtp.invalidOtp);
  }

  logger.info(`verifyOtp - OTP verified successfully for user ${user._id}`);
  user.otp = null;
  await user.save();
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  logger.info(`verifyOtp - user ${user._id} verified and logged in`);
  return res.status(200).json(
    new ServerResponse(
      200,
      {
        user,
        accessToken,
        refreshToken,
      },
      authControllersText.verifyOtp.success
    )
  );
};
