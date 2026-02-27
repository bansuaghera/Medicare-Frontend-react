import React from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
    const navigate = useNavigate();

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Book Appointment</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Schedule a new appointment</p>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <form style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Patient *</label>
                        <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#fff' }}>
                            <option>Select patient</option>
                            <option>John Smith</option>
                            <option>Sarah Johnson</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Doctor *</label>
                        <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#fff' }}>
                            <option>Select doctor</option>
                            <option>Dr. Sarah Johnson</option>
                            <option>Dr. Michael Chen</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Date *</label>
                        <div style={{ position: 'relative' }}>
                            <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Time *</label>
                        <div style={{ position: 'relative' }}>
                            <input type="time" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Appointment Type *</label>
                        <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#fff' }}>
                            <option>Select type</option>
                            <option>Routine Checkup</option>
                            <option>Consultation</option>
                            <option>Follow-up</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '16px' }}>
                        <button type="button" style={{ background: '#0fb48c', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: "flex", alignItems: "center", gap: "8px" }}>
                            <Calendar size={18} /> Book Appointment
                        </button>
                        <button type="button" style={{ background: '#fff', color: '#333', border: '1px solid #ddd', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                    </div>

                </form>
            </div>
        </StaffLayout>
    );
}
