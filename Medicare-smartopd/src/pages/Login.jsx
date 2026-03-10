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

    // Admin Check
    if (email === "medicare@admin" && password === "123") {
      alert("Admin Login Successful!");
      navigate("/admin/dashboard");
      return;
    }

    // Staff Check
    if (email === "staff@medicare" && password === "123") {
      alert("Staff Login Successful!");
      navigate("/staff/dashboard");
      return;
    }

    // Doctor Check
    if (email === "doctor@medicare" && password === "123") {
      alert("Doctor Login Successful!");
      navigate("/doctor/dashboard");
      return;
    }

    // User Check
    if (email === "user@medicare" && password === "123") {
      alert("User Login Successful!");
      navigate("/user/dashboard");
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
        <div className="decoration-circle circle-2"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">

        <div className="top-logo">
          <h2 style={{ color: '#0fb48c', fontWeight: 800 }}>MediCare+</h2>
        </div>

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

          </form>

          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>

        </div>

        <div className="support-footer">
          Need help? <a href="mailto:support@medicare.com">support@medicare.com</a>
        </div>

      </div>

    </div>
  );
}
