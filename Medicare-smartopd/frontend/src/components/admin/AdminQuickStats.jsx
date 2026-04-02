import React from "react";
import { Link } from "react-router-dom";

export default function AdminQuickStats({ stats = {} }) {
    return (
        <div className="chart-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0fb48c' }}></div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>System Load</p>
                        <p style={{ fontWeight: 700 }}>{stats.totalUsers || 0} Total Profiles</p>
                    </div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Operations</p>
                        <p style={{ fontWeight: 700 }}>{stats.totalStaff || 0} Staff Members</p>
                    </div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }}></div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Clinical</p>
                        <p style={{ fontWeight: 700 }}>{stats.onlineDoctors || 0} Doctors Online</p>
                    </div>
                </div>
            </div>
            <Link to="/admin/reports" className="add-btn" style={{ width: '100%', marginTop: 'auto', padding: '14px', textAlign: 'center', textDecoration: 'none' }}>
                View Full Report
            </Link>
        </div>
    );
}
