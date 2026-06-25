import nodemailer from "nodemailer";

// ✅ Simple App Password auth — no OAuth2, no expiring tokens
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // 16-character app password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000, // 10 seconds max for SMTP greeting
  socketTimeout: 15000,
});

export async function sendEmail({ to, subject, html, text }) {
  try {
    const mailOption = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      text,
    };

    const details = await transporter.sendMail(mailOption);
    console.log("Email sent successfully:", details.messageId);
    return details;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
}
