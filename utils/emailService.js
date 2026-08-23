import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== "YOUR_RESEND_API_KEY_HERE" ? new Resend(resendApiKey) : null;

export const sendOtpEmail = async (toEmail, otp) => {
  try {
    if (!resend) {
      console.warn("⚠️ RESEND_API_KEY is not configured. Falling back to console log for OTP.");
      console.log(`\n=================================\nMock Email to: ${toEmail}\nSubject: Admin Password Reset OTP\nOTP: ${otp}\n=================================\n`);
      return { id: "mock_email_id" };
    }

    const data = await resend.emails.send({
      from: "Petals by Smira <onboarding@resend.dev>", // Replace with a verified domain later
      to: toEmail,
      subject: "Admin Password Reset OTP - Petals by Smira",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">Hello Admin,</p>
          <p style="color: #555; font-size: 16px;">You recently requested to reset your password for the Petals by Smira Admin Panel.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f4f4f4; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #000; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="color: #555; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

export const sendUserPasswordResetEmail = async (toEmail, resetUrl) => {
  try {
    if (!resend) {
      console.warn("⚠️ RESEND_API_KEY is not configured. Falling back to console log for user reset link.");
      console.log(`\n=================================\nMock Email to: ${toEmail}\nSubject: Reset Your Password - Petals by Smira\nReset Link: ${resetUrl}\n=================================\n`);
      return { id: "mock_email_id" };
    }

    const data = await resend.emails.send({
      from: "Petals by Smira <onboarding@resend.dev>", // Replace with a verified domain later
      to: toEmail,
      subject: "Reset Your Password - Petals by Smira",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 16px;">We received a request to reset your password for your Petals by Smira account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #000; padding: 15px 30px; font-size: 16px; font-weight: bold; color: #d4af37; text-decoration: none; border-radius: 8px;">
              Reset Password
            </a>
          </div>
          <p style="color: #555; font-size: 14px;">This link is valid for <strong>15 minutes</strong>.</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error("Error sending user reset email:", error);
    throw error;
  }
};
