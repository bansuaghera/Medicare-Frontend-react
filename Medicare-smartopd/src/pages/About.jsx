import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Heart,
    Shield,
    Users,
    CheckCircle2,
    Target,
    Award,
    TrendingUp,
    HeartPulse,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight,
    Instagram,
    Twitter,
    Linkedin,
    Facebook
} from 'lucide-react';
import '../styles/landingPage.css'; // Reusing global navbar/footer styles
import '../styles/about.css';

const About = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="about-container">
            {/* Navbar */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <Link to="/" className="nav-brand">
                    <div className="brand-logo">
                        <Activity size={24} />
                    </div>
                    <h2 className="brand-name">Medi<span>Care</span></h2>
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link active">About</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>

                <div className="nav-auth">
                    <Link to="/login" className="btn btn-outline">Login</Link>
                    <Link to="/register" className="btn btn-primary">Join Now</Link>
                </div>
            </nav>

            {/* Header */}
            <header className="about-header">
                <div className="hero-badge" style={{ margin: '0 auto 2rem' }}>About MediCare</div>
                <h1>Empowering Healthcare through <span>Innovation</span></h1>
                <p>
                    We are on a global mission to revolutionize outpatient department management
                    by integrating state-of-the-art technology with deeply human care.
                    Our platform bridges the critical gap between providers and patients.
                </p>
            </header>

            {/* Mission/Vision */}
            <section className="mission-vision">
                <div className="mission-grid">
                    <div className="mission-card">
                        <div className="icon-box primary-icon">
                            <Target size={36} />
                        </div>
                        <h3>Our Mission</h3>
                        <p>To provide clinics and hospitals with the tools they need to deliver exceptional care through seamless appointment scheduling, digital records, and intelligent workflow management.</p>
                    </div>
                    <div className="mission-card">
                        <div className="icon-box blue-icon">
                            <TrendingUp size={36} />
                        </div>
                        <h3>Our Vision</h3>
                        <p>A world where healthcare is truly accessible, efficient, and transparent for everyone. We envision a future where technology eliminates waiting times and prevents documentation errors.</p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="values-sec">
                <div className="section-head">
                    <span className="tag">Our values</span>
                    <h2>Driven by Clinical Excellence</h2>
                    <p>Built by healthcare experts and technology enthusiasts to solve real-world clinical challenges.</p>
                </div>

                <div className="values-grid">
                    <div className="val-item">
                        <div className="val-icon"><Shield size={24} /></div>
                        <h5>Data Integrity</h5>
                        <p>We prioritize patient confidentiality with advanced encryption and clinical data security.</p>
                    </div>
                    <div className="val-item">
                        <div className="val-icon"><Activity size={24} /></div>
                        <h5>Real-time Care</h5>
                        <p>Instant access to vital reports and history for immediate medical decision-making.</p>
                    </div>
                    <div className="val-item">
                        <div className="val-icon"><Users size={24} /></div>
                        <h5>Human First</h5>
                        <p>Every feature is designed to simplify the journey of patients through the health system.</p>
                    </div>
                    <div className="val-item"><div className="val-icon"><Award size={24} /></div>
                        <h5>Excellence</h5>
                        <p>Committed to continuous improvement, ensuring our platform stays ahead of industry standards.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-sec">
                <div className="cta-box">
                    <h2>Ready to Transform Your Practice?</h2>
                    <p>Join over 500+ healthcare providers who trust MediCare for their daily operations and patient care.</p>
                    <div className="hero-btns" style={{ justifyContent: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ backgroundColor: 'var(--primary)' }}>Get Started Now</Link>
                        <Link to="/login" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Watch Live Demo</Link>
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
                        <h5>Platform</h5>
                        <ul>
                            <li><a href="#">Pricing Models</a></li>
                            <li><a href="#">Global Reach</a></li>
                            <li><a href="#">Security Audit</a></li>
                            <li><a href="#">Case Studies</a></li>
                        </ul>
                    </div>

                    <div className="f-links">
                        <h5>Company</h5>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><a href="#">Our Vision</a></li>
                            <li><a href="#">Partnerships</a></li>
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

export default About;
