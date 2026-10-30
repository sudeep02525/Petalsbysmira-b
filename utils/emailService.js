import "../config/loadEnv.js";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== "YOUR_RESEND_API_KEY_HERE" ? new Resend(resendApiKey) : null;
const EMAIL_FROM = process.env.EMAIL_FROM || "Petals by Smira <concierge@petalsbysmira.in>";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const shell = ({ preheader = "", heading, body, cta, note }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Petals by Smira</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ec;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ec;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
<tr><td style="background:#0a0a0a;padding:28px 32px;text-align:center;">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:4px;color:#d4af37;">PETALS BY SMIRA</div>
<div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#8a7d63;margin-top:6px;">PRIVATE LUXURY CONCIERGE</div>
</td></tr>
<tr><td style="padding:36px 32px 8px;">
<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;font-weight:normal;color:#111;">${heading}</h1>
<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#444;">${body}</div>
</td></tr>
${cta ? `<tr><td align="center" style="padding:28px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="background:#0a0a0a;border-radius:4px;">
<a href="${cta.url}" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#d4af37;text-decoration:none;letter-spacing:1px;">${cta.label}</a>
</td></tr></table>
<div style="font-family:Arial,sans-serif;font-size:11px;color:#888;margin-top:14px;word-break:break-all;">${cta.url}</div>
</td></tr>` : ""}
${note ? `<tr><td style="padding:0 32px 28px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#777;">${note}</td></tr>` : ""}
<tr><td style="padding:20px 32px;border-top:1px solid #eee;font-family:Arial,sans-serif;font-size:11px;color:#999;text-align:center;line-height:1.6;">
Petals by Smira · <a href="mailto:petalsbysmira@gmail.com" style="color:#b08d3f;text-decoration:none;">petalsbysmira@gmail.com</a><br>
This is an automated message, please do not reply.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

const logMock = (label, to, extra) => {
  console.warn(`[email] RESEND_API_KEY missing — ${label} not sent`);
  console.log(`Mock ${label} to ${to}: ${extra}`);
  return { id: "mock_email_id" };
};

export const sendOtpEmail = async (toEmail, otp) => {
  if (!resend) return logMock("OTP email", toEmail, otp);
  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: toEmail,
    subject: "Your Petals by Smira admin OTP",
    html: shell({
      preheader: `Your one-time code is ${otp}`,
      heading: "Password Reset Code",
      body: `<p style="margin:0 0 12px;">Hello Admin,</p>
             <p style="margin:0 0 18px;">Use this one-time code to reset your Petals by Smira admin password.</p>
             <div style="text-align:center;margin:8px 0 18px;">
               <span style="display:inline-block;background:#f4f1ec;border:1px solid #e3dccf;padding:14px 28px;font-size:26px;font-weight:bold;letter-spacing:8px;color:#111;border-radius:6px;">${esc(otp)}</span>
             </div>`,
      note: "This code is valid for <strong>10 minutes</strong>. Do not share it with anyone. If you didn't request it, ignore this email.",
    }),
    text: `Hello Admin,\n\nYour password reset code is ${otp}. It is valid for 10 minutes.\n\n— Petals by Smira`,
  });
  if (result.error) {
    throw new Error(result.error.message || "Failed to deliver OTP email via Resend");
  }
  return result;
};

export const sendPrivateAccessEmail = async (toEmail, customerName, accessUrl) => {
  if (!resend) return logMock("private access email", toEmail, accessUrl);
  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: toEmail,
    subject: "Your Private Access — Petals by Smira",
    html: shell({
      preheader: "Your private access is now active for 24 hours.",
      heading: "Private Access Granted",
      body: `<p style="margin:0 0 12px;">Hello ${esc(customerName)},</p>
             <p style="margin:0;">Your request has been approved. You can now view exclusive pricing across our private collection.</p>`,
      cta: { url: accessUrl, label: "VIEW PRIVATE PRICES" },
      note: "This link is valid for exactly <strong>24 hours</strong> and is intended for you alone. Please do not forward it.",
    }),
    text: `Hello ${customerName},\n\nYour private access is approved and valid for 24 hours.\n\n${accessUrl}\n\n— Petals by Smira`,
  });
  if (result.error) {
    throw new Error(result.error.message || "Failed to deliver private access email via Resend");
  }
  return result;
};
