import nodemailer from "nodemailer";
import { env } from "../config/environment.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "smtp.gmail.com",
  port: env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `Trello <${env.SMTP_USER}>`,
    to,
    subject: "Your OTP code",
    html: `
        <h3>Hello!</h3>
        <p>Your OTP code is:</p>
        <h2 style="color:#2e6c80;">${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
      `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(error);
  }
};

export const sendEmail = { sendOtpEmail };
