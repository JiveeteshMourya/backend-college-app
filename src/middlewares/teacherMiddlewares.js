import ServerError from "../common/errors/ServerError.js";
import logger from "../common/utils/logger.js";
import wrapAsync from "../common/utils/wrapAsync.js";

export const isTeacher = wrapAsync(async (req, _, next) => {
  const user = req.user;
  const userType = req.userType;

  if (userType !== 2) {
    logger.warn(`isTeacher - User not authorized ${user._id}`);
    throw new ServerError(403, "User not authorized for this route");
  }

  if (user.isBlocked) {
    logger.warn(`isTeacher - User id blocked, access denied`);
    throw new ServerError(403, "User id blocked, access denied");
  }

  logger.info(
    `isTeacher - Teacher ${user._id} authorized for teacher resoureces`
  );
  next();
});

// isTestOwner
// isTeacherOrStudent
