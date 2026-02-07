import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, validateEmailOrPhone } from '../utils/api';
import './Login.css';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone.trim()) {
      setError('Email or phone number is required');
      return;
    }

    if (!validateEmailOrPhone(emailOrPhone)) {
      setError('Please enter a valid email or 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(emailOrPhone);

      const otp = response.data.otp;

      toast.success(`OTP Generated (Demo): ${otp}`);

      navigate('/verify-otp', {
        state: {
          userId: response.data.userId,
          emailOrPhone,
          demoOtp: otp
        }
      });

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
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

      <div className="login-right">
        <div className="login-form-container">
          <h2>Login to your Product Account</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="emailOrPhone">Email or Phone number</label>
              <input
                type="text"
                id="emailOrPhone"
                className={`input ${error ? 'error' : ''}`}
                placeholder="Enter email or phone number"
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  setError('');
                }}
                disabled={loading}
              />
              {error && <div className="error-text">{error}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading || !emailOrPhone.trim()}
            >
              {loading ? <div className="loading"></div> : 'Login'}
            </button>
          </form>

          <div className="signup-link">
            <span>Don't have a Product Account? </span>
            <a href="#signup">SignUp Here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
