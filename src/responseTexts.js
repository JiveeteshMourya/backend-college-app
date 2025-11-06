// Util Texts
export const authHelperText = {
  hashPassword: {
    invalid: "Invalid password",
    error: "Error while hashing password",
  },
  comparePassword: {
    invalid: "Invalid arguments",
    error: "Error while comparing password",
  },
};

export const jwtHelperText = {
  generateAccessToken: {
    invalid: "generateAccessToken called with invalid user object",
  },
  generateRefreshToken: {
    invalid: "generateRefreshToken called with invalid user object",
  },
  generateResetToken: {
    invalid: "generateOtpToken called with invalid user object",
  },
  generateAccessAndRefreshTokens: {
    failed: "Something went wrong while generating refresh and access token",
  },
};

export const saveImageToDbText = {
  failed: "Failed to upload image",
};

// Middlewares Texts
export const rateLimiterMiddlewaresText = {
  otpLimiter: {
    error: "Too many OTPs sent - cool down for 15 minutes.",
  },
};

export const authMiddlewaresText = {
  verifyAccessJWT: {
    unauth: "Unauthorized request",
    invalidToken: "Invalid Access Token",
    idBlocked: "User Id blocked, access denied",
  },
  verifyResetJWT: {
    unauth: "Unauthorized request",
    invalidOtp: "Invalid OTP Token",
  },
};

export const multerMiddlewareText = {
  onlyImages: "Only image files are allowed",
};

// Schema Texts
export const joiValidationSchemaText = {
  email: {
    base: "Please provide a valid email address.",
    empty: "The email field cannot be empty.",
    required: "The email field is mandatory.",
  },
  password: {
    base: "The password field must be a string.",
    min: "The password must be at least 8 characters long.",
    required: "The password field is mandatory.",
  },
  otpCode: {
    length: "OTP must be exactly 6 digits.",
    required: "The OTP code is mandatory.",
  },
  digitString: {
    base: (fieldName) => `The ${fieldName} field must be a string of digits.`,
    pattern: (fieldName) => `The ${fieldName} must contain only digits.`,
    min: (fieldName, minLen) =>
      `The ${fieldName} must be at least ${minLen} digits long.`,
    required: (fieldName) => `The ${fieldName} field is mandatory.`,
  },
  textField: {
    base: (fieldName) => `The ${fieldName} field must be a string.`,
    empty: (fieldName) => `The ${fieldName} field cannot be empty.`,
    max: (fieldName, maxLength) =>
      `The ${fieldName} cannot exceed ${maxLength} characters.`,
    required: (fieldName) => `The ${fieldName} field is mandatory.`,
  },
  optionalTextField: {
    base: (fieldName) => `The ${fieldName} field must be a string.`,
    empty: (fieldName) =>
      `If provided, the ${fieldName} field cannot be empty.`,
    max: (fieldName, maxLength) =>
      `If provided, the ${fieldName} cannot exceed ${maxLength} characters.`,
  },
  objectId: {
    hex: "The ID must be a valid hex string.",
    length: "The ID must be 24 characters long.",
  },
};

// Controllers Texts
export const authControllersText = {
  userLogin: {
    notFound: "User does not exist",
    invalid: "Invalid user credentials",
    blocked: "User Id blocked, access denied",
    success: "OTP sent to your email",
  },
  verifyOtp: {
    notFound: "User does not exist",
    blocked: "User Id blocked, access denied",
    invalid: "Invalid otp submission",
    invalidOtp: "Invalid OTP code",
    otpExpired: "OTP has expired, please request a new one",
    success: "OTP verified successfully",
  },
  refreshTokens: {
    missingToken: "Refresh token is required",
    invalidToken: "Invalid refresh token",
    success: "Tokens refreshed successfully",
  },
  userInfo: {
    notFound: "User does not exist",
    success: "User information retrieved successfully",
  },
};
