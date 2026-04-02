import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Calendar,
    Users,
    Shield,
    ArrowRight,
    Clock,
    ClipboardList,
    Smartphone,
    CheckCircle2,
    HeartPulse,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight,
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/landingPage.css';
import heroImg from '../assets/hero.png';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <Link to="/" className="nav-brand">
                    <div className="brand-logo">
                        <Activity size={24} />
                    </div>
                    <h2 className="brand-name">Medi<span>Care</span></h2>
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link active">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>

                <div className="nav-auth">
                    {/* Theme Toggle Button for Landing Page */}
                    <button 
                        onClick={toggleTheme} 
                        className="theme-toggle-btn"
                        title="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link to="/login" className="btn btn-outline">Login</Link>
                    <Link to="/register" className="btn btn-primary">Join Now</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <HeartPulse size={16} />
                        Next-Gen Patient Management
                    </div>
                    <h1>Transforming <span>Healthcare</span> through Innovation</h1>
                    <p>
                        Experience a seamless, efficient, and patient-centric OPD management system.
                        Designed for modern clinics and hospitals to streamline appointments,
                        prescriptions, and advanced patient care.
                    </p>
                    <div className="hero-btns">
                        <Link to="/login" className="btn btn-primary">
                            Get Started <ArrowUpRight size={18} />
                        </Link>
                        <Link to="/about" className="btn btn-outline">Learn More</Link>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="image-container">
                        <img src={heroImg} alt="Healthcare Professional" className="main-img" />
                        <div className="floating-stats stat-1">
                            <div className="stat-icon blue-icon">
                                <Calendar size={20} />
                            </div>
                            <div className="stat-info">
                                <h5>Easy Booking</h5>
                                <p>250+ Today</p>
                            </div>
                        </div>
                        <div className="floating-stats stat-2">
                            <div className="stat-icon green-icon">
                                <Users size={20} />
                            </div>
                            <div className="stat-info">
                                <h5>Success Rate</h5>
                                <p>98.5% Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar">
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
                    <p>Digital Records</p>
                </div>
                <div className="stat-item">
                    <h3>24/7</h3>
                    <p>Global Support</p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features">
                <div className="section-head">
                    <span className="tag">Features</span>
                    <h2>All-in-one Clinical Solution</h2>
                    <p>Everything you need to manage your medical practice efficiently in one powerful, secure, and intuitive platform.</p>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon-box">
                            <Calendar size={28} />
                        </div>
                        <h4>Smart Scheduling</h4>
                        <p>Manage appointments with an intuitive calendar, automated reminders, and real-time availability sync.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">
                            <ClipboardList size={28} />
                        </div>
                        <h4>Advanced Records</h4>
                        <p>Access secure and centralized patient history, lab reports, and vitals from anywhere, anytime.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">
                            <Shield size={28} />
                        </div>
                        <h4>Enterprise Security</h4>
                        <p>Military-grade data encryption and HIPAA compliance ensuring patient confidentiality at all levels.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">
                            <Smartphone size={28} />
                        </div>
                        <h4>Patient Portal</h4>
                        <p>A dedicated mobile interface for patients to book appointments, view reports, and manage health.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">
                            <Clock size={28} />
                        </div>
                        <h4>Queue Analytics</h4>
                        <p>Optimize OPD flow with real-time tracking and automated queue management for waiting patients.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box">
                            <CheckCircle2 size={28} />
                        </div>
                        <h4>e-Prescriptions</h4>
                        <p>Generate precise digital prescriptions instantly, reducing human error and improving patient outcomes.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-top">
                    <div className="f-brand">
                        <h2 className="brand-name">Medi<span>Care</span></h2>
                        <p>Empowering healthcare providers with state-of-the-art technology to deliver exceptional care.</p>
                        <div className="social-links">
                            <a href="#" className="social-btn"><Instagram size={20} /></a>
                            <a href="#" className="social-btn"><Twitter size={20} /></a>
                            <a href="#" className="social-btn"><Linkedin size={20} /></a>
                            <a href="#" className="social-btn"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div className="f-links">
                        <h5>Company</h5>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="f-newsletter">
                        <h5>Stay Updated</h5>
                        <p>Get the latest analytics and healthcare news delivered to your inbox weekly.</p>
                        <div className="input-group">
                            <input type="email" placeholder="Email address" />
                            <button className="btn btn-primary">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MediCare Smart OPD. Created with Excellence.</p>
                    <div className="footer-legal">
                        <a href="#" style={{ color: 'inherit', marginRight: '20px' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'inherit' }}>Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
