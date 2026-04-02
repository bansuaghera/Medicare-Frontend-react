import { useNavigate, Link } from "react-router-dom";
import {
    ShieldCheck,
    MoveLeft,
    Sun,
    Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/verifyOTP.css";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleVerify = (e) => {
        e.preventDefault();
        alert("OTP Verified Successfully!");
        navigate("/login");
    };

    return (
        <div className={`verify-otp-container ${isDarkMode ? "dark" : "light"}`}>

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
                <div className="left-content">
                    <h1>Verify Your OTP</h1>
                    <p>
                        We've sent a 6-digit verification code to your email. Please enter it below to continue.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="right-section">
                <div className="otp-card">

                    <div className="shield-icon-box">
                        <ShieldCheck className="shield-icon" />
                    </div>

                    <h2>Enter OTP</h2>
                    <p className="subtitle">
                        Check your email for the verification code
                    </p>

                    <form className="otp-form" onSubmit={handleVerify}>
                        <div className="otp-input-group">
                            <input
                                type="text"
                                className="otp-input"
                                placeholder="------"
                                maxLength="6"
                                required
                            />
                        </div>

                        <button type="submit" className="verify-btn">
                            Verify OTP
                        </button>
                    </form>

                    <Link to="/login" className="back-to-login">
                        <MoveLeft size={18} />
                        <span>Back to Login</span>
                    </Link>

                </div>
            </div>

        </div>
    );
}
