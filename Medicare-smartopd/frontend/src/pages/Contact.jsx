import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Mail,
    Phone,
    MapPin,
    Send,
    Clock,
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
    HeartPulse,
    ArrowUpRight
} from 'lucide-react';
import '../styles/landingPage.css'; // Reusing global navbar/footer styles
import '../styles/contact.css';

const Contact = () => {
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
        <div className="contact-container">
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
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/contact" className="nav-link active">Contact</Link>
                </div>

                <div className="nav-auth">
                    <Link to="/login" className="btn btn-outline">Login</Link>
                    <Link to="/register" className="btn btn-primary">Join Now</Link>
                </div>
            </nav>

            {/* Header */}
            <header className="contact-header">
                <div className="hero-badge" style={{ margin: '0 auto 2rem' }}>Contact Us</div>
                <h1>Let's Start a <span>Conversation</span></h1>
                <p>Have questions about our platform? Our specialized clinical team is ready to assist you 24/7.</p>
            </header>

            {/* Contact Grid */}
            <section className="contact-grid">
                <div className="contact-info">
                    <div className="info-item">
                        <div className="info-icon"><Mail /></div>
                        <div className="info-content">
                            <h4>Email Support</h4>
                            <p>For technical inquiries and partner clinical support.</p>
                            <a href="mailto:support@medicare.com" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>support@medicare.com</a>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-icon"><Phone /></div>
                        <div className="info-content">
                            <h4>Direct Hotline</h4>
                            <p>Immediate assistance for hospitals and clinics.</p>
                            <a href="tel:+919876543210" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>+91 98765 43210</a>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-icon"><MapPin /></div>
                        <div className="info-content">
                            <h4>Clinical HQ</h4>
                            <p>Healthcare Innovation Hub, 12th Floor, Metro Plaza, Bengaluru.</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-box">
                    <form className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Rahul Verma" />
                        </div>
                        <div className="form-group">
                            <label>Professional Email</label>
                            <input type="email" placeholder="rahul@clinic.com" />
                        </div>
                        <div className="form-group">
                            <label>Clinic/Hospital Name</label>
                            <input type="text" placeholder="City Medical Center" />
                        </div>
                        <div className="form-group">
                            <label>Inquiry Type</label>
                            <input type="text" placeholder="e.g. Partnership" />
                        </div>
                        <div className="form-group full">
                            <label>Your Message</label>
                            <textarea rows="6" placeholder="Tell us how we can help your medical practice flourish..."></textarea>
                        </div>
                        <div className="form-group full">
                            <button className="btn btn-primary submit-btn">
                                Send Message <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ marginTop: 'auto' }}>
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

export default Contact;
