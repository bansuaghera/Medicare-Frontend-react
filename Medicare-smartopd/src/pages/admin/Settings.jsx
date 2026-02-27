import AdminLayout from "../../layouts/AdminLayout";
import {
    Building2,
    Clock,
    Save,
    Check
} from "lucide-react";
import "../../styles/patients.css";

export default function Settings() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">
                <div className="page-header">
                    <div className="page-title">
                        <h1>Clinic Settings</h1>
                        <p>Manage clinic configuration</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Clinic Information */}
                    <div className="form-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#0fb48c' }}>
                            <Building2 size={20} />
                            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Clinic Information</h3>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Clinic Name</label>
                                <input type="text" defaultValue="MediCare Smart OPD" />
                            </div>
                            <div className="form-group">
                                <label>Registration Number</label>
                                <input type="text" defaultValue="CLINIC-2024-001" />
                            </div>
                            <div className="form-group full-width">
                                <label>Address</label>
                                <input type="text" defaultValue="123 Medical Center, Healthcare City, HC 12345" />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" defaultValue="+91 00000 00000" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" defaultValue="contact@medicare.com" />
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="form-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#0fb48c' }}>
                            <Clock size={20} />
                            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Operating Hours</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {days.map(day => (
                                <div key={day} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', alignItems: 'center', gap: '24px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{day}</span>
                                    <input type="text" defaultValue={day === "Sunday" ? "Closed" : "09:00 AM"}
                                        style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                                    {day !== "Sunday" && (
                                        <input type="text" defaultValue="06:00 PM"
                                            style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button className="add-btn" style={{ padding: '12px 30px' }}>
                            <Check size={18} style={{ marginRight: '8px' }} />
                            Save Settings
                        </button>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
