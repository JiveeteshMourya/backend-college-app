import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    userType: { type: Number, default: 1 }, // 1 = parent
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },
    password: { type: String, required: true },
    contactNumber: { type: String, trim: true },
    gender: { type: String, enum: ["M", "F", "O"], default: null },
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },

    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    occupation: { type: String, trim: true },
    address: { type: String, trim: true },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "OTP", default: null },
    refreshToken: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Parent = mongoose.model("Parent", parentSchema);
export default Parent;
