import React from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Mic } from "lucide-react";

export default function CallToken() {
    const nextInQueue = [
        { token: "A-046", patient: "Sarah Johnson", doctor: "Dr. Michael Chen" },
        { token: "A-047", patient: "Michael Chen", doctor: "Dr. Emily Davis" },
        { token: "A-048", patient: "Emily Davis", doctor: "Dr. Robert Wilson" },
    ];

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Call Token</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Call next patient</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>

                {/* Current Calling */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Current Token</p>

                    <div style={{ background: '#e8fdf5', border: '1px solid #b2efdb', borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '48px', fontWeight: '700', color: '#0fb48c', margin: 0 }}>A-045</h2>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>John Smith</h3>
                        <p style={{ fontSize: '14px', color: '#888' }}>Dr. Sarah Johnson - Room 101</p>
                    </div>

                    <button style={{ width: '100%', background: '#0fb48c', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                        <Mic size={20} /> Call Next Token
                    </button>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button style={{ flex: 1, background: '#fafafa', color: '#555', border: '1px solid #eee', padding: '14px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
                            Repeat Call
                        </button>
                        <button style={{ flex: 1, background: '#fafafa', color: '#555', border: '1px solid #eee', padding: '14px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
                            Skip Token
                        </button>
                    </div>
                </div>

                {/* Next in Queue */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>Next in Queue</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {nextInQueue.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                                <div style={{ background: '#ebf2fc', color: '#4589f5', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                                    {item.token}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '15px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>{item.patient}</h4>
                                    <p style={{ fontSize: '13px', color: '#888' }}>{item.doctor}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </StaffLayout>
    );
}
