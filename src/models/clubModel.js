import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    userType: { type: Number, default: 3 }, // shared type with dept for internal role
    clubName: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    facultyAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    president: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "OTP", default: null },
    refreshToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Club = mongoose.model("Club", clubSchema);
export default Club;
