import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronDown } from "lucide-react";

export default function BookAppointment() {
    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Link to="/user/dashboard" style={{ color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 }}>Book Appointment</h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '28px' }}>Schedule your visit</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px' }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Select Doctor <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', appearance: 'none', background: '#fff' }}>
                                    <option value="">Choose a doctor</option>
                                    <option value="sarah_johnson">Dr. Sarah Johnson - Cardiology</option>
                                    <option value="michael_chen">Dr. Michael Chen - Pediatrics</option>
                                </select>
                                <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                    Preferred Date <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input type="date" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', background: '#fff' }} />
                                    {/* Usually native date picker has icon, we can rely on it or hide it, but standard input type="date" works well */}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                    Preferred Time <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', appearance: 'none', background: '#fff' }}>
                                        <option value="">Select time</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                    </select>
                                    <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Reason for Visit
                            </label>
                            <textarea rows="4" placeholder="Describe your symptoms or reason for visit..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', background: '#fff', resize: 'vertical' }}></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                            <button type="button" style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#10b981', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                                <Calendar size={20} />
                                Book Appointment
                            </button>
                            <Link to="/user/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', color: '#374151', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: '600', border: '1px solid #e5e7eb' }}>
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
