import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Lock,
    ShieldCheck,
    MoveLeft,
    Sun,
    Moon,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axiosConfig";
import toast from "react-hot-toast";
import "../styles/forgotPassword.css"; // Reusing styles

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useTheme();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Retrieve data passed from VerifyOTP
    const email = location.state?.email;
    const otp = location.state?.otp;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) return;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        const loadToast = toast.loading("Updating password...");
        try {
            const res = await API.post("/users/reset-password", { 
                email, 
                otp, 
                password 
            });
            if (res.data.success) {
                toast.success("Password Reset Successfully!", { id: loadToast });
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed", { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    if (!email || !otp) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
                <h3>Invalid Session</h3>
                <p>Please go back to the forgot password page.</p>
                <Link to="/forgot-password" style={{ color: '#0fb48c' }}>Go Back</Link>
            </div>
        );
    }

    return (
        <div className={`forgot-password-container ${isDarkMode ? "dark" : "light"}`}>

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
                    <h1>Set New Password</h1>
                    <p>
                        Secure your account with a strong password. Use a combination of letters, numbers, and symbols for better protection.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="right-section">
                <div className="forgot-card">

                    <div className="mail-icon-box" style={{ background: '#e0f2fe' }}>
                        <ShieldCheck className="mail-icon" style={{ color: '#0ea5e9' }} />
                    </div>

                    <h2>Create Password</h2>
                    <p className="subtitle">
                        Please enter and confirm your new password below.
                    </p>

                    <form className="forgot-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter new password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    style={{ paddingRight: '44px' }}
                                />
                                <div 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Confirm your password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <button type="submit" className="reset-btn" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                            <span>{loading ? "Updating..." : "Reset Password"}</span>
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
