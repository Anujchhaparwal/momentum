import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

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

  return (
    <div>
      <h1>Verify Your Email</h1>

      {status === "idle" && (
        <>
          <p>Click below to verify your Momentum account.</p>
          <button onClick={handleVerification}>
            Verify My Email
          </button>
        </>
      )}

      {status === "loading" && <p>Verifying your email...</p>}

      {status === "success" && <p>{message}</p>}

      {status === "error" && <p>{message}</p>}
    </div>
  );
}

export default VerifyEmail;