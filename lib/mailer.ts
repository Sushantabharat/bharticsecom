// lib/mailer.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,        // your Gmail address
    pass: process.env.EMAIL_PASS,        // your App Password
  },
});

export const sendOTP = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"VibeTrails" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<p>Here's your bhartics account password reset OTP: <b>${otp}</b>. Please do not share the OTP </p>`,
  };

  await transporter.sendMail(mailOptions);
};
