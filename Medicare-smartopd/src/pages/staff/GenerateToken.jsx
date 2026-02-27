import React from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Plus } from "lucide-react";

export default function GenerateToken() {
    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Generate Token</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Issue token for walk-in patients</p>
            </div>

            <div style={{ maxWidth: '500px' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

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

                        <button type="button" style={{ background: '#0fb48c', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: "flex", alignItems: "center", justifyContent: 'center', gap: "8px", marginTop: "8px" }}>
                            <Plus size={18} /> Generate Token
                        </button>

                    </form>
                </div>

                <div style={{ background: '#e8fdf5', border: '2px solid #b2efdb', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                    <p style={{ color: '#0fb48c', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Latest Token</p>
                    <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#0fb48c', margin: 0 }}>A-049</h2>
                </div>
            </div>
        </StaffLayout>
    );
}
