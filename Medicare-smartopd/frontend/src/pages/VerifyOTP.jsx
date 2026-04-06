import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
    ShieldCheck,
    MoveLeft,
    Sun,
    Moon,
    Loader2
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axiosConfig";
import toast from "react-hot-toast";
import "../styles/verifyOTP.css";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useTheme();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Retrieve email from state passed from ForgotPassword
    const email = location.state?.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp || !email) {
            toast.error("Email session missing or OTP empty");
            return;
        }

        setLoading(true);
        const loadToast = toast.loading("Verifying OTP...");
        try {
            const res = await API.post("/users/verify-otp", { email, otp });
            if (res.data.success) {
                toast.success("OTP Verified Successfully!", { id: loadToast });
                // Pass email and otp to ResetPassword
                navigate("/reset-password", { state: { email, otp } });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP", { id: loadToast });
        } finally {
            setLoading(false);
        }
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
                        We've sent a 6-digit verification code to <b>{email || "your email"}</b>. Please enter it below to continue.
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
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="verify-btn" disabled={loading}>
                            {loading && <Loader2 className="animate-spin" size={18} style={{ marginRight: "8px" }} />}
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>

                    <Link to="/forgot-password" style={{ display: "block", marginTop: "16px", color: "#64748b", textDecoration: "none", fontSize: "14px" }}>
                        Didn't get the code? Resend
                    </Link>

                    <Link to="/login" className="back-to-login">
                        <MoveLeft size={18} />
                        <span>Back to Login</span>
                    </Link>

                </div>
            </div>

        </div>
    );
}
