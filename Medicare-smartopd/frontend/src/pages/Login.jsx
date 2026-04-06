import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, HeartPulse, ChevronRight, Sun, Moon } from "lucide-react";
import API from "../api/axiosConfig";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("Google Auth Success", codeResponse);
      toast.success("Google Login Successful!");
      navigate("/user/dashboard");
    },
    onError: (error) => toast.error("Google Auth Failed")
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const loadToast = toast.loading("Verifying credentials...");
    try {
      const res = await API.post("/users/login", {
        email,
        password
      });

      if (res.data.success) {
        toast.success("Welcome back!", { id: loadToast });
        login(res.data.user, res.data.token);
        navigate(res.data.redirectUrl || "/user/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials", { id: loadToast });
    }
  };

  return (
    <div className={`login-container ${isDarkMode ? "dark" : "light"}`}>
      
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
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

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
          <h1>Streamline Your Healthcare</h1>
          <p>
            The most advanced patient management system. Efficient, secure, and intuitive.
          </p>
        </div>
      </div>

      <div className="right-section">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Please enter your details</p>

          <form onSubmit={handleLogin} className="login-form">

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: (email && !isEmailValid) ? '1px solid #ef4444' : '' }}
                />
              </div>
              {email && !isEmailValid && (
                <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>Invalid email address format</span>
              )}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Minimum 6 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ border: (password && !isPasswordValid) ? '1px solid #ef4444' : '' }}
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b', zIndex: 10 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {password && !isPasswordValid && (
                <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>Password must be 6+ characters</span>
              )}
            </div>

            <div className="options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" style={{ color: '#0fb48c', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={!isFormValid}
              style={{
                opacity: isFormValid ? 1 : 0.6,
                cursor: isFormValid ? 'pointer' : 'not-allowed'
              }}
            >
              Login
            </button>

            <button type="button" className="google-login-btn" onClick={() => loginWithGoogle()}>
              Login with Google
            </button>

            <div className="signup-link">
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}