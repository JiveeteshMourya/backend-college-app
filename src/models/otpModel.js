import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "OTP must be a 6-digit code"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Generate OTP before saving
otpSchema.pre("validate", function (next) {
  // Generate only if not already set
  if (!this.code) {
    const length = 6;
    this.code = Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, "0");
  }

  if (!this.expiresAt) {
    const expireSeconds =
      parseInt(process.env.OTP_EXPIRE_DURATION_SECONDS) || 300; // default 5 mins
    this.expiresAt = new Date(Date.now() + expireSeconds * 1000);
  }

  next();
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
