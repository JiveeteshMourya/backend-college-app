import nodemailer from "nodemailer";
import ServerError from "../errors/ServerError.js";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const TokenValidFor = process.env.OTP_EXPIRE_DURATION_SECONDS / 60;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_FROM_EMAIL,
    pass: process.env.NODEMAILER_FROM_PASS,
  },
});

export const triggerNodeMailerEmail = async ({ type, payload }) => {
  const content = buildMailContent({ type, payload });
  const mailData = {
    from: process.env.NODEMAILER_FROM_EMAIL,
    ...content,
  };

  try {
    const res = await transporter.sendMail(mailData);
    return res;
  } catch (err) {
    logger.error(
      `triggerNodeMailerEmail - ${type} email failed: ${err.message}`
    );
    throw new ServerError(500, `Failed to send ${type} email. Try Again`, err);
  }
};

const buildMailContent = ({ type, payload }) => {
  switch (type) {
    case "OTP":
      return {
        to: [payload.toEmail],
        subject: "The College App OTP Verification",
        text: `Hey ${payload.firstName}, your OTP is ${payload.otpCode}. It expires in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2>Hello ${payload.firstName},</h2>
            <p style="font-size: 16px;">Here is your one-time passcode (OTP):</p>
            <div style="font-size: 32px; font-weight: bold; background-color: #f4f4f4; color: #4A90E2; padding: 15px 30px; border-radius: 8px; text-align: center; letter-spacing: 2px; margin: 20px 0;">
              ${payload.otpCode}
            </div>
            <p style="font-size: 16px;">This OTP will expire in <strong>${TokenValidFor} minutes</strong>.</p>
            <p style="font-size: 14px; color: #888;">If you did not request this code, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply.</p>
          </div>
        `,
      };

    default:
      throw new ServerError(500, "Unknown email type");
  }
};
