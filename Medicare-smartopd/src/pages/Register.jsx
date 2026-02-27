import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  CheckCircle2,
  HeartPulse,
  HelpCircle
} from "lucide-react";
import "../styles/register.css";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle registration logic here
    alert("Account created successfully! Please verify your OTP.");
    navigate("/verify-otp");
  };

  return (
    <div className="register-container">

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
          <h1>Join Our Healthcare Platform</h1>
          <p>
            Create your account and get access to our
            comprehensive healthcare management system.
          </p>

          <ul className="benefits-list">
            <li>
              <CheckCircle2 className="check-icon" />
              <span>Book appointments instantly</span>
            </li>
            <li>
              <CheckCircle2 className="check-icon" />
              <span>Access medical records anytime</span>
            </li>
            <li>
              <CheckCircle2 className="check-icon" />
              <span>Track your health journey</span>
            </li>
          </ul>
        </div>

        {/* Subtle decorative circles for background */}
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">

        <div className="top-logo">
          <img src={logo} alt="MediCare+" />
        </div>

        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">Register for MediCare Smart OPD</p>

          <form className="register-form" onSubmit={handleSubmit}>

            <div className="name-row">
              <div className="input-with-icon">
                <User className="input-icon" />
                <input type="text" placeholder="First Name" />
              </div>
              <div className="input-with-icon">
                <User className="input-icon" />
                <input type="text" placeholder="Last Name" />
              </div>
            </div>

            <div className="input-with-icon">
              <Mail className="input-icon" />
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="input-with-icon">
              <Phone className="input-icon" />
              <input type="tel" placeholder="+91 99999 99999" />
            </div>

            <div className="input-with-icon">
              <Calendar className="input-icon" />
              <input type="text" placeholder="dd-mm-yyyy" />
            </div>

            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input type="password" placeholder="Create a strong password" />
            </div>

            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input type="password" placeholder="Confirm your password" />
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms and Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="register-btn">
              Create Account
            </button>

          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>

        </div>

        <div className="support-footer">
          Need help? <a href="mailto:support@medicare.com">support@medicare.com</a>
        </div>

        <button className="floating-help-btn">
          <HelpCircle />
        </button>

      </div>

    </div>
  );
}

