import React from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Examination() {
    const navigate = useNavigate();

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                    <ChevronLeft size={24} color="#333" />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Examination Notes</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Patient ID: #1</p>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Blood Pressure</label>
                            <input type="text" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fafafa', outline: 'none', fontSize: '15px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Temperature (°F)</label>
                            <input type="text" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fafafa', outline: 'none', fontSize: '15px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Pulse Rate</label>
                            <input type="text" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fafafa', outline: 'none', fontSize: '15px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Weight (kg)</label>
                            <input type="text" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fafafa', outline: 'none', fontSize: '15px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Symptoms</label>
                        <textarea style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fafafa', outline: 'none', height: '100px', resize: 'vertical', fontSize: '15px' }}></textarea>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Diagnosis</label>
                        <textarea style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fafafa', outline: 'none', height: '100px', resize: 'vertical', fontSize: '15px' }}></textarea>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Treatment Plan</label>
                        <textarea style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fafafa', outline: 'none', height: '100px', resize: 'vertical', fontSize: '15px' }}></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <button type="button" style={{ background: '#0fb48c', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '8px', fontWeight: '500', fontSize: '15px', cursor: 'pointer', display: "flex", alignItems: "center", gap: "8px" }}>
                            <Check size={18} /> Save Notes
                        </button>
                        <button type="button" style={{ background: '#fff', color: '#444', border: '1px solid #ddd', padding: '14px 28px', borderRadius: '8px', fontWeight: '500', fontSize: '15px', cursor: 'pointer' }}>
                            Create Prescription
                        </button>
                    </div>

                </form>
            </div>
        </DoctorLayout>
    );
}
