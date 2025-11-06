import ServerError from "../common/errors/ServerError.js";
import logger from "../common/utils/logger.js";
import wrapAsync from "../common/utils/wrapAsync.js";

export const isStudent = wrapAsync(async (req, _, next) => {
  const user = req.user;
  const userType = req.userType;

  if (userType !== 0) {
    logger.warn(`isStudent - User not authorized ${user._id}`);
    throw new ServerError(403, "User not authorized for this route");
  }

  if (user.isBlocked) {
    logger.warn(`isStudent - User id blocked, access denied`);
    throw new ServerError(403, "User id blocked, access denied");
  }

  logger.info(
    `isStudent - Student ${user._id} authorized for student resoureces`
  );
  next();
});
