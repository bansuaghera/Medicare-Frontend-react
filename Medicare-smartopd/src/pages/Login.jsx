import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  HeartPulse,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import API from "../api/axiosConfig";
import { useTheme } from "../context/ThemeContext";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const roleRoutes = {
      "admin@medicare": "/admin/dashboard",
      "doctor@medicare": "/doctor/dashboard",
      "staff@medicare": "/staff/dashboard",
      "user@medicare": "/user/dashboard"
    };

    if (roleRoutes[email] && password === "123") {
      alert(`Login Successful as ${email.split('@')[0].toUpperCase()}!`);
      navigate(roleRoutes[email]);
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      alert("Login Successful");
      console.log(res.data);

    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className={`login-container ${isDarkMode ? "dark" : "light"}`}>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme} 
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 100,
          background: isDarkMode ? '#1e293b' : '#fff',
          border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isDarkMode ? '#f8fafc' : '#111827',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        title="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* LEFT SIDE */}
      <div className="left-section">
        <div className="brand">
          <div className="brand-icon-box">
            <HeartPulse className="brand-icon-svg" />
          </div>
          <div className="brand-text">
            <h3>MediCare</h3>
            <span>Smart OPD</span>
          </div>
        </div>

        <div className="left-content">
          <h1>Streamline Your Healthcare Operations</h1>
          <p>
            Manage appointments, patients, and OPD queues efficiently
            with our intelligent healthcare platform.
          </p>

          <div className="cta-box">
            <span>Learn more about our services</span>
            <ChevronRight className="cta-icon" />
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2" style={{ bottom: '-10%', right: '-10%' }}></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">

        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Please login to your account</p>

          <form onSubmit={handleLogin} className="login-form">

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" style={{ color: '#0fb48c', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <button type="button" className="google-login-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.81 15.73 17.58V20.34H19.3C21.39 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.3 20.34L15.73 17.58C14.73 18.25 13.48 18.66 12 18.66C9.13 18.66 6.7 16.73 5.82 14.15H2.12V17.02C3.96 20.67 7.69 23 12 23Z" fill="#34A853" />
                <path d="M5.82 14.15C5.6 13.47 5.47 12.75 5.47 12C5.47 11.25 5.6 10.53 5.82 9.85V6.98H2.12C1.36 8.5 0.93 10.2 0.93 12C0.93 13.8 1.36 15.5 2.12 17.02L5.82 14.15Z" fill="#FBBC05" />
                <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.37 3.8C17.45 2.01 14.97 1 12 1C7.69 1 3.96 3.33 2.12 6.98L5.82 9.85C6.7 7.27 9.13 5.34 12 5.34Z" fill="#EA4335" />
              </svg>
              Login with Google
            </button>

            <div className="signup-link">
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </form>

        </div>

        <div className="support-footer">
          Need help?<br />
          <a href="mailto:support@medicare.com">support@medicare.com</a>
        </div>

        <div className="help-fab">
          ?
        </div>

      </div>

    </div>
  );
}