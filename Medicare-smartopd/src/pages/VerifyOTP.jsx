import { useNavigate, Link } from "react-router-dom";
import {
    ShieldCheck,
    MoveLeft
} from "lucide-react";
import "../styles/verifyOTP.css";

export default function VerifyOTP() {
    const navigate = useNavigate();

    const handleVerify = (e) => {
        e.preventDefault();
        alert("OTP Verified Successfully!");
        navigate("/login");
    };

    return (
        <div className="verify-otp-container">

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
