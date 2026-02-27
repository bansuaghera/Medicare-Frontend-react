import AdminLayout from "../../layouts/AdminLayout";
import {
    ChevronLeft,
    Plus,
    User,
    Clock,
    Calendar,
    MapPin,
    FileText
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/patients.css";

export default function AddOPDSchedule() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Schedule created successfully!");
        navigate("/admin/schedule");
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <Link to="/admin/schedule" className="back-link">
                    <ChevronLeft size={20} />
                </Link>

                <div className="page-header">
                    <div className="page-title">
                        <h1>Add OPD Schedule</h1>
                        <p>Create a new doctor schedule</p>
                    </div>
                </div>

                <div className="form-card" style={{ maxWidth: '850px' }}>
                    <form onSubmit={handleSubmit}>

                        {/* Doctor Selection */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ background: '#e7f7f3', color: '#0fb48c', padding: '10px', borderRadius: '10px' }}>
                                <User size={20} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 650 }}>Doctor Information</h3>
                        </div>

                        <div className="form-group" style={{ marginBottom: '30px' }}>
                            <label>Select Doctor *</label>
                            <select required>
                                <option value="">Choose a doctor</option>
                                <option value="1">Dr. Sarah Johnson</option>
                                <option value="2">Dr. Michael Chen</option>
                            </select>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '30px 0' }} />

                        {/* Timing */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ background: '#f0f4ff', color: '#4f46e5', padding: '10px', borderRadius: '10px' }}>
                                <Clock size={20} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 650 }}>Schedule Timing</h3>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Start Time *</label>
                                <input type="time" required />
                            </div>
                            <div className="form-group">
                                <label>End Time *</label>
                                <input type="time" required />
                            </div>
                            <div className="form-group">
                                <label>Consultation Duration (minutes) *</label>
                                <select required>
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Total Slots *</label>
                                <input type="number" placeholder="Enter total slots" required />
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '30px 0' }} />

                        {/* Days */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ background: '#fff7ed', color: '#ea580c', padding: '10px', borderRadius: '10px' }}>
                                <Calendar size={20} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 650 }}>Recurring Schedule</h3>
                        </div>

                        <div className="form-group">
                            <label>Select Days *</label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <button key={day} type="button" style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        background: ['Mon', 'Wed', 'Fri'].includes(day) ? '#0fb48c' : 'white',
                                        color: ['Mon', 'Wed', 'Fri'].includes(day) ? 'white' : '#64748b',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '30px 0' }} />

                        {/* Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '10px', borderRadius: '10px' }}>
                                <MapPin size={20} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 650 }}>Location Details</h3>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Room/Cabin Number *</label>
                                <select required>
                                    <option value="">Select room</option>
                                    <option value="101">Room 101</option>
                                    <option value="102">Room 102</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Floor</label>
                                <select>
                                    <option value="">Select floor</option>
                                    <option value="1">1st Floor</option>
                                    <option value="2">2nd Floor</option>
                                </select>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '30px 0' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ background: '#f8fafc', color: '#1e293b', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <FileText size={20} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 650 }}>Additional Information</h3>
                        </div>

                        <div className="form-group full-width">
                            <label>Schedule Notes</label>
                            <textarea rows="4" style={{ background: '#f8fafc' }}></textarea>
                        </div>

                        <div className="form-actions" style={{ marginTop: '40px' }}>
                            <button type="submit" className="save-btn" style={{ padding: '14px 40px' }}>
                                <Plus size={18} />
                                <span>Add OPD</span>
                            </button>
                            <button type="button" className="cancel-btn" style={{ border: 'none', background: '#0fb48c', color: 'white', borderRadius: '10px', padding: '14px 40px' }} onClick={() => navigate("/admin/schedule")}>
                                Cancle OPD
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
