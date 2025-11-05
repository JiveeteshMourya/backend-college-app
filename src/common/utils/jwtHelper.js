import jwt from "jsonwebtoken";
import ServerError from "../errors/ServerError.js";
import logger from "./logger.js";
import { jwtHelperText } from "../../responseTexts.js";

const generateAccessToken = (user) => {
  if (!user || !user._id) {
    throw new ServerError(400, jwtHelperText.generateAccessToken.invalid, [
      { field: "_id", issue: "required" },
    ]);
  }
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      userType: user.userType,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = (user) => {
  if (!user || !user._id) {
    throw new ServerError(400, jwtHelperText.generateRefreshToken.invalid, [
      { field: "_id", issue: "required" },
    ]);
  }
  return jwt.sign(
    {
      _id: user._id,
      userType: user.userType,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error(`generateAccessAndRefreshTokens - error: ${error.message}`);
    throw new ServerError(
      500,
      jwtHelperText.generateAccessAndRefreshTokens.failed
    );
  }
};
