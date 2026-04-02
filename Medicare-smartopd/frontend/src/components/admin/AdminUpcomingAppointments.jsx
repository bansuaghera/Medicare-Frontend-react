import React from "react";
import { Link } from "react-router-dom";

export default function AdminUpcomingAppointments({ appointments }) {
    if (!appointments || appointments.length === 0) return null;

    return (
        <div className="chart-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Upcoming Appointments</h3>
                <Link to="/admin/appointments" style={{ fontSize: '13px', color: '#0fb48c', textDecoration: 'none', fontWeight: 600 }}>See All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {appointments.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748b' }}>
                            {item?.name ? item.name.split(' ').map(n => n[0]).join('') : '??'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: '15px' }}>{item?.name || 'Unknown Patient'}</p>
                            <p style={{ fontSize: '13px', color: '#64748b' }}>{item?.doc || 'No Doctor'} • {item?.type || 'Checkup'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 700, color: '#0fb48c', fontSize: '14px' }}>{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
