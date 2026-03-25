import React from "react";

export default function AdminQuickStats() {
    return (
        <div className="chart-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0fb48c' }}></div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Consultation</p>
                        <p style={{ fontWeight: 700 }}>75% Capacity</p>
                    </div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Lab Tests</p>
                        <p style={{ fontWeight: 700 }}>12 Pending</p>
                    </div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }}></div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Pharmacy</p>
                        <p style={{ fontWeight: 700 }}>Critical Stock (5)</p>
                    </div>
                </div>
            </div>
            <button className="add-btn" style={{ width: '100%', marginTop: 'auto', padding: '14px' }}>
                View Full Report
            </button>
        </div>
    );
}
