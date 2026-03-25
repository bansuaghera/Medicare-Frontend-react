import React from "react";
import { CalendarDays, Clock } from "lucide-react";

export default function ScheduleList({ schedules }) {
    if (!schedules || schedules.length === 0) return <p style={{ color: '#666' }}>No schedules available.</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {schedules.map(sch => (
                <div key={sch.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e2e8f0',
                    background: 'white'
                }}>
                    <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '12px', borderRadius: '12px' }}>
                        <CalendarDays size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{sch.doctor}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={12} /> {sch.time} • {sch.room}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700 }}>{sch.slots}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Available Slots</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
