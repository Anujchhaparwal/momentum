import nodemailer from "nodemailer";
import process from "node:process";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Momentum" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;

export const verifyEmailConnection = async () => {
  await transporter.verify();
  console.log("Email server is ready to send messages");
};