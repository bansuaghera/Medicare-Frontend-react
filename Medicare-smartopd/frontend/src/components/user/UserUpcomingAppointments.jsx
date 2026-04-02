import React from "react";
import { UserCircle2 } from "lucide-react";

export default function UserUpcomingAppointments({ appointments }) {
    if (!appointments || appointments.length === 0) return null;

    return (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>Upcoming Appointments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {appointments.map((apt, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: apt.iconBg || '#f3e8ff', color: apt.iconColor || '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UserCircle2 size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>{apt.doctor}</h4>
                                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{apt.specialty}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{apt.date}</p>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{apt.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
