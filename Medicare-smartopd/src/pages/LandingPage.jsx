import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Calendar,
    Clipboard,
    Users,
    Shield,
    ArrowRight,
    Clock,
    ClipboardList,
    Heart,
    Smartphone
} from 'lucide-react';
import '../styles/landingPage.css';
import heroImg from '../assets/hero.png';
import logoImg from '../assets/logo.png';

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="navbar">
                <Link to="/" className="nav-brand">
                    <div className="brand-logo">
                        <Activity size={24} />
                    </div>
                    <h2 className="brand-name">Medi<span>Care</span></h2>
                </Link>

                <div className="nav-links">
                    <a href="#about" className="nav-link">About</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </div>

                <div className="nav-auth">
                    <Link to="/login" className="btn btn-outline">Login</Link>
                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="badge">Next-Gen Patient Management</div>
                    <h1>Transforming <span>Healthcare</span> Through Innovation</h1>
                    <p>
                        Experience a seamless, efficient, and patient-centric OPD management system.
                        Designed for modern clinics and hospitals to streamline appointments,
                        prescriptions, and patient care.
                    </p>
                    <div className="hero-btns">
                        <Link to="/login" className="btn btn-primary">
                            Get Started <ArrowRight size={18} />
                        </Link>
                        <Link to="/register" className="btn btn-outline">Learn More</Link>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="image-wrapper">
                        <img src={heroImg} alt="Healthcare Professional" className="main-img" />
                        <div className="floating-card card-1">
                            <div className="card-icon icon-blue">
                                <Calendar size={20} />
                            </div>
                            <div className="card-info">
                                <h4>Easy Booking</h4>
                                <p>250+ Appointments today</p>
                            </div>
                        </div>
                        <div className="floating-card card-2">
                            <div className="card-icon icon-green">
                                <Users size={20} />
                            </div>
                            <div className="card-info">
                                <h4>Happy Patients</h4>
                                <p>98% Satisfaction rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stat-item">
                    <h3>20k+</h3>
                    <p>Active Users</p>
                </div>
                <div className="stat-item">
                    <h3>500+</h3>
                    <p>Hospitals</p>
                </div>
                <div className="stat-item">
                    <h3>1M+</h3>
                    <p>Prescriptions</p>
                </div>
                <div className="stat-item">
                    <h3>24/7</h3>
                    <p>Expert Support</p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features">
                <div className="section-header">
                    <h2>Comprehensive Solutions for Your Clinic</h2>
                    <p>Everything you need to manage your medical practice efficiently in one powerful platform.</p>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Calendar size={28} />
                        </div>
                        <h3>Smart Scheduling</h3>
                        <p>Manage appointments with an intuitive calendar, automated reminders, and real-time availability updates.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <ClipboardList size={28} />
                        </div>
                        <h3>Digital Prescriptions</h3>
                        <p>Create and manage electronic prescriptions instantly, reducing errors and improving patient safety.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Activity size={28} />
                        </div>
                        <h3>Patient Records</h3>
                        <p>Access secure and centralized patient history, lab reports, and vitals from anywhere, anytime.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Smartphone size={28} />
                        </div>
                        <h3>Patient Portal</h3>
                        <p>A dedicated mobile-responsive interface for patients to book appointments and view prescriptions.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Shield size={28} />
                        </div>
                        <h3>Secure Data</h3>
                        <p>Enterprise-grade security with encrypted data storage ensuring patient confidentiality and HIPAA compliance.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Clock size={28} />
                        </div>
                        <h3>Queue Management</h3>
                        <p>Optimize OPD flow with real-time token tracking and automated queue updates for waiting patients.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2 className="brand-name">Medi<span>Care</span></h2>
                        <p>Empowering healthcare providers with modern technology to deliver exceptional patient care.</p>
                    </div>

                    <div className="footer-links">
                        <h4>Platform</h4>
                        <ul>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Security</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Medicare Smart OPD. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
