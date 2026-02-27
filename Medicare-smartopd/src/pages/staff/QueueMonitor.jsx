import React from "react";
import StaffLayout from "../../layouts/StaffLayout";

export default function QueueMonitor() {
    const queueItems = [
        { token: "A-045", patient: "John Smith", doctor: "Dr. Sarah Johnson", waitTime: "5 min", status: "In Progress" },
        { token: "A-046", patient: "Sarah Johnson", doctor: "Dr. Michael Chen", waitTime: "15 min", status: "Waiting" },
        { token: "A-047", patient: "Michael Chen", doctor: "Dr. Emily Davis", waitTime: "22 min", status: "Waiting" },
        { token: "A-048", patient: "Emily Davis", doctor: "Dr. Robert Wilson", waitTime: "30 min", status: "Waiting" },
    ];

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Queue Monitor</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Live queue status</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>

                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>Waiting</p>
                    <h3 style={{ fontSize: "32px", fontWeight: "700", color: '#333' }}>12</h3>
                </div>

                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>In Progress</p>
                    <h3 style={{ fontSize: "32px", fontWeight: "700", color: '#333' }}>4</h3>
                </div>

                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>Completed</p>
                    <h3 style={{ fontSize: "32px", fontWeight: "700", color: '#333' }}>31</h3>
                </div>

                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>Total</p>
                    <h3 style={{ fontSize: "32px", fontWeight: "700", color: '#333' }}>47</h3>
                </div>

            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>Live Queue</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {queueItems.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ background: '#e8fdf5', color: '#0fb48c', padding: '10px 16px', borderRadius: '8px', fontSize: '18px', fontWeight: '700' }}>
                                    {item.token}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>{item.patient}</h4>
                                    <p style={{ fontSize: '13px', color: '#888' }}>{item.doctor}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Wait Time</p>
                                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>{item.waitTime}</span>
                                </div>
                                <div style={{ width: '100px', textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: item.status === 'In Progress' ? '#4589f5' : '#f5a445'
                                    }}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </StaffLayout>
    );
}
