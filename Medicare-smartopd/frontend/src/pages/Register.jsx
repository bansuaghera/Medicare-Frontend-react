import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  CheckCircle2,
  HeartPulse,
  HelpCircle,
  Sun,
  Moon,
  Eye,
  EyeOff
} from "lucide-react";
import API from "../api/axiosConfig";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import "../styles/register.css";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValid, setPasswordValid] = useState({
    hasCapital: false,
    hasNumber: false,
    hasSpecial: false,
    hasSmall: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    setPasswordValid({
      hasCapital: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_]/.test(value),
      hasSmall: /[a-z]/.test(value)
    });
  };

  // Validation logic
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = /^\+?[0-9]{10,12}$/.test(formData.phone);
  const isNamesValid = formData.firstName.length >= 2 && formData.lastName.length >= 2;
  const isPasswordStrengthValid = passwordValid.hasCapital && passwordValid.hasNumber && passwordValid.hasSpecial && passwordValid.hasSmall;
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.password !== "";
  const isFormValid = isEmailValid && isPhoneValid && isNamesValid && isPasswordStrengthValid && isPasswordMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const loadToast = toast.loading("Creating your account...");
    try {
      const res = await API.post("/users/register", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: "user",
        phone: formData.phone,
        age: 25 // Placeholder for real age logic
      });

      if (res.data.success) {
        toast.success("Account created successfully!", { id: loadToast });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed", { id: loadToast });
    }
  };

  return (
    <div className={`register-container ${isDarkMode ? "dark" : "light"}`}>
      
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
          <div className="brand-icon-box"><HeartPulse className="brand-icon-svg" /></div>
          <div className="brand-text"><h3>MediCare</h3><span>Smart OPD</span></div>
        </div>
        <div className="left-content">
          <h1>Join MediCare</h1>
          <p>Register today and gain access to high-quality healthcare services and easy appointment management.</p>
        </div>
      </div>

      <div className="right-section">
        <div className="top-logo"><img src={logo} alt="Logo" /></div>
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">Sign up to join our network</p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="name-row">
              <div className="input-group">
                <div className="input-with-icon">
                  <User className="input-icon" />
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                </div>
              </div>
              <div className="input-group">
                <div className="input-with-icon">
                  <User className="input-icon" />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-with-icon">
                <Mail className="input-icon" />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              </div>
              {formData.email && !isEmailValid && <span className="error-text">Invalid email format</span>}
            </div>

            <div className="input-group">
              <div className="input-with-icon">
                <Phone className="input-icon" />
                <input type="tel" name="phone" placeholder="Phone (10-digits)" value={formData.phone} onChange={handleChange} required />
              </div>
              {formData.phone && !isPhoneValid && <span className="error-text">Min 10 digits required</span>}
            </div>

            <div className="input-group">
              <div className="input-with-icon">
                <Calendar className="input-icon" />
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Strong Password" 
                  value={formData.password} 
                  onChange={handlePasswordChange} 
                  required 
                />
                <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b', zIndex: 10 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              
              <div style={{
                fontSize: '11px',
                marginTop: '10px',
                marginBottom: '15px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px 8px'
              }}>
                <span style={{ color: passwordValid.hasCapital ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <CheckCircle2 size={12} style={{ opacity: passwordValid.hasCapital ? 1 : 0.3 }} /> Capital
                </span>
                <span style={{ color: passwordValid.hasSmall ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <CheckCircle2 size={12} style={{ opacity: passwordValid.hasSmall ? 1 : 0.3 }} /> Small Letter
                </span>
                <span style={{ color: passwordValid.hasNumber ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <CheckCircle2 size={12} style={{ opacity: passwordValid.hasNumber ? 1 : 0.3 }} /> Number
                </span>
                <span style={{ color: passwordValid.hasSpecial ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <CheckCircle2 size={12} style={{ opacity: passwordValid.hasSpecial ? 1 : 0.3 }} /> Special Case
                </span>
              </div>
            </div>

            <div className="input-group">
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                />
                <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b', zIndex: 10 }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {formData.confirmPassword && (
                <span style={{ fontSize: '11px', color: isPasswordMatch ? '#10b981' : '#ef4444', marginTop: '10px' }}>
                  {isPasswordMatch ? '✓ Passwords Match' : '✗ Passwords Do Not Match'}
                </span>
              )}
            </div>

            <button type="submit" className="register-btn" disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.6, cursor: isFormValid ? 'pointer' : 'not-allowed' }}>
              Create Account
            </button>
          </form>

          <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
