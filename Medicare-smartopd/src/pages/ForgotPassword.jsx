import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Send,
    MoveLeft
} from "lucide-react";
import "../styles/forgotPassword.css";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Reset link sent to your email!");
        navigate("/verify-otp");
    };

    return (
        <div className="forgot-password-container">

            {/* LEFT SIDE */}
            <div className="left-section">
                <div className="left-content">
                    <h1>Don't Worry!</h1>
                    <p>
                        Forgot your password? No problem! We'll send you a reset link to get you back into your
                        account quickly and securely.
                    </p>

                    <ul className="steps-list">
                        <li>1. Enter your email</li>
                        <li>2. Check your inbox</li>
                        <li>3. Create new password</li>
                    </ul>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="right-section">
                <div className="forgot-card">

                    <div className="mail-icon-box">
                        <Mail className="mail-icon" />
                    </div>

                    <h2>Forgot Password?</h2>
                    <p className="subtitle">
                        Enter your email address and we'll send instructions to reset your password.
                    </p>

                    <form className="forgot-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="Enter your email" required />
                        </div>

                        <button type="submit" className="reset-btn">
                            <Send size={18} />
                            <span>Send Reset Link</span>
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
