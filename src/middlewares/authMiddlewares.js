import jwt from "jsonwebtoken";
import ServerError from "../common/errors/ServerError.js";
import wrapAsync from "../common/utils/wrapAsync.js";
import logger from "../common/utils/logger.js";
import { authMiddlewaresText } from "../responseTexts.js";
import getModelFromUserType from "../common/utils/getModelFromUserType.js";

export const verifyAccessJWT = wrapAsync(async (req, _, next) => {
  logger.http("verifyAccessJWT called");

  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken;

  if (!token) {
    logger.warn("verifyAccessJWT - No token provided");
    throw new ServerError(401, authMiddlewaresText.verifyAccessJWT.unauth);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    logger.error(`verifyAccessJWT - Invalid or expired token: ${err.message}`);
    throw new ServerError(
      401,
      authMiddlewaresText.verifyAccessJWT.invalidToken
    );
  }

  const Model = getModelFromUserType(decodedToken.userType);

  const user = await Model.findById(decodedToken._id);
  if (!user) {
    logger.error(
      `verifyAccessJWT - No user found for id ${decodedToken._id} in type ${decodedToken.userType}`
    );
    throw new ServerError(
      401,
      authMiddlewaresText.verifyAccessJWT.invalidToken
    );
  }

  if (user.isBlocked) {
    logger.error(`verifyAccessJWT - Blocked user ${user._id}`);
    throw new ServerError(403, authMiddlewaresText.verifyAccessJWT.idBlocked);
  }

  if (user.isUserVerified === false) {
    logger.error(`verifyAccessJWT - Unverified user ${user._id}`);
    throw new ServerError(401, authMiddlewaresText.verifyAccessJWT.notVerified);
  }

  req.user = user;
  req.userType = decodedToken.userType; // numeric type only

  logger.info(
    `verifyAccessJWT - Authenticated user ${user._id} of type ${decodedToken.userType}`
  );
  next();
});
