

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";
import "./OTPVerification.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [demoOtp, setDemoOtp] = useState(""); // ✅ added

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const { userId, emailOrPhone, demoOtp: receivedDemoOtp } = location.state || {};

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // ✅ show demo OTP if received
    if (receivedDemoOtp) {
      setDemoOtp(receivedDemoOtp);
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [userId, navigate, receivedDemoOtp]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.verifyOTP(userId, otpString);
      toast.success("Login successful!");
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      setError(message);
      toast.error(message);

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await authAPI.resendOTP(userId);

      // ✅ backend returns otp in demo mode
      if (response.data.otp) {
        setDemoOtp(response.data.otp);
        toast.success(`OTP Resent (Demo): ${response.data.otp}`);
      } else {
        toast.success("OTP resent successfully!");
      }

      setTimer(60);
      setCanResend(false);

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-left">
        <div className="brand-section">
          <h1 className="logo">Productr</h1>
          <div className="illustration-card">
            <div className="runner-illustration">
              <div className="runner-icon">🏃‍♂️</div>
            </div>
            <h2>Uplift your product to market</h2>
          </div>
        </div>
      </div>

      <div className="otp-right">
        <div className="otp-form-container">
          <h2>Enter Verification Code</h2>
          <p className="otp-subtitle">
            We've sent a 6-digit code to {emailOrPhone}
          </p>

          {/* ✅ DEMO OTP SHOW */}
          {demoOtp && (
            <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
              Demo OTP: {demoOtp}
            </p>
          )}

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className={`otp-input ${error ? "error" : ""}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                />
              ))}
            </div>

            {error && <div className="error-text">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary otp-btn"
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? <div className="loading"></div> : "Verify OTP"}
            </button>
          </form>

          <div className="resend-section">
            {!canResend ? (
              <p className="timer-text">
                Resend OTP in {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, "0")}
              </p>
            ) : (
              <button
                className="resend-btn"
                onClick={handleResendOTP}
                disabled={resendLoading}
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
