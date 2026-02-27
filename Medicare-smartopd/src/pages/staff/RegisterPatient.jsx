import React from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPatient() {
    const navigate = useNavigate();

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Register New Patient</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Add patient information</p>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <form style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>First Name *</label>
                        <input type="text" placeholder="Enter first name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Last Name *</label>
                        <input type="text" placeholder="Enter last name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Date of Birth *</label>
                        <div style={{ position: 'relative' }}>
                            <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Gender *</label>
                        <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#fff' }}>
                            <option>Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Blood Group</label>
                        <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#fff' }}>
                            <option>Select</option>
                            <option>A+</option>
                            <option>B+</option>
                            <option>O+</option>
                            <option>AB+</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Phone Number *</label>
                        <input type="tel" placeholder="+1 234-567-8900" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Email</label>
                        <input type="email" placeholder="patient@example.com" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '16px' }}>
                        <button type="button" style={{ background: '#0fb48c', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px" }}>+</span> Register Patient
                        </button>
                        <button type="button" style={{ background: '#fff', color: '#333', border: '1px solid #ddd', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                    </div>

                </form>
            </div>
        </StaffLayout>
    );
}
