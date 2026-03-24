import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { Calendar, User, CheckCircle, Clock, Plus, Search, UserCircle2 } from "lucide-react";
import "../../styles/adminDashboard.css";

export default function UserDashboard() {
    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome Back, User!</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Here's your health dashboard</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div className="stat-card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>Upcoming Appointments</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>2</h2>
                        </div>
                        <div style={{ background: 'var(--pill-success-bg)', color: 'var(--pill-success-text)', padding: '12px', borderRadius: '12px' }}>
                            <Calendar size={24} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>Total Visits</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>12</h2>
                        </div>
                        <div style={{ background: 'var(--pill-info-bg)', color: 'var(--pill-info-text)', padding: '12px', borderRadius: '12px' }}>
                            <User size={24} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>Prescriptions</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>8</h2>
                        </div>
                        <div style={{ background: 'var(--pill-purple-bg)', color: 'var(--pill-purple-text)', padding: '12px', borderRadius: '12px' }}>
                            <CheckCircle size={24} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>Last Visit</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Feb 10</h2>
                        </div>
                        <div style={{ background: 'var(--pill-orange-bg)', color: 'var(--pill-orange-text)', padding: '12px', borderRadius: '12px' }}>
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                    {/* Quick Actions */}
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Link to="/user/book-appointment" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--pill-success-text)', color: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                                <Plus size={20} />
                                Book Appointment
                            </Link>
                            <Link to="/user/doctors" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', border: '1px solid var(--border-input)', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                                <Search size={20} />
                                Find Doctor
                            </Link>
                            <Link to="/user/token-status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', border: '1px solid var(--border-input)', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                                <Clock size={20} />
                                Token Status
                            </Link>
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>Upcoming Appointments</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--pill-purple-bg)', color: 'var(--pill-purple-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>Dr. Ramesh Sharma</h4>
                                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Cardiology</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>2024-02-15</p>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>10:00 AM</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--pill-info-bg)', color: 'var(--pill-info-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>Dr. Anjali Gupta</h4>
                                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Pediatrics</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>2024-02-20</p>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>02:00 PM</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
