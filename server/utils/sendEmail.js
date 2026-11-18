import { Resend } from "resend";
import process from "node:process";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  const { data, error } = await resend.emails.send({
    from: "Momentum <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return data;
};

export default sendEmail;

export const verifyEmailConnection = async () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  console.log("Resend API key is configured");
};
