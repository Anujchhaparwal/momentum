const verificationEmail = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #F3EEE5; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #FFFFFF; padding: 30px; border-radius: 10px;">

          <h1 style="color: #292820;">Welcome to Momentum!</h1>

          <p>Hello ${name},</p>

          <p>Thanks for creating your Momentum account. Please verify your email address by clicking the button below.</p>

          <a
            href="${verificationUrl}"
            style="display: inline-block; background: #292820; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px;"
          >
            Verify My Email
          </a>

          <p>This verification link expires in 15 minutes.</p>

          <p>If you didn't create this account, you can ignore this email.</p>

          <p>Regards,<br>Team Momentum</p>

        </div>
      </body>
    </html>
  `;
};

export default verificationEmail;