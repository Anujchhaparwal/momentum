import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import "./VerifyEmail.css";


function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleVerification = async () => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    try {
      setStatus("loading");

      const response = await fetch(
        `http://localhost:5000/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email verification failed.");
      }

      setStatus("success");
      setMessage(data.message);
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };
  const handleResendVerification = async () => {
    if (!email.trim()) {
      setResendMessage("Please enter your email address.");
      setResendSuccess(false);
      return;
    }

    try {
      setResendLoading(true);
      setResendMessage("");

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend verification email.");
      }

      setResendMessage(data.message);
      setResendSuccess(true);
    } catch (error) {
      setResendMessage(error.message);
      setResendSuccess(false);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-logo">Momentum</div>

        <h1>Verify Your Email</h1>

        {status === "idle" && (
          <>
            <p>You're one step away from getting started with Momentum.</p>

            <button
              className="verify-button"
              onClick={handleVerification}
              disabled={status === "loading"}
            >
              Verify My Email
            </button>
          </>
        )}

        {status === "loading" && (
          <p className="verify-message">Verifying your email...</p>
        )}

        {status === "success" && (
          <p className="verify-message verify-success">{message}</p>
        )}

        {status === "error" && (
          <p className="verify-message verify-error">{message}</p>
        )}

        {status === "error" && (
          <div className="resend-section">
            <p>Need a new verification link?</p>

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="verify-button"
              onClick={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </button>

            {resendMessage && (
              <p className={`verify-message ${resendSuccess ? "verify-success" : "verify-error"}`}>
                {resendMessage}
              </p>
            )}
          </div>
        )}

        {status !== "success" && (
          <p className="verify-message">
            Your verification link expires after 15 minutes.
          </p>
        )}
      </div>
    </div>
  );


}

export default VerifyEmail;