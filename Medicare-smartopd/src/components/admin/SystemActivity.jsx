import React from "react";

export default function SystemActivity({ activities }) {
    return (
        <div className="chart-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>System Activity</h3>
            </div>
            <div className="activity-list" style={{ marginLeft: '12px', borderLeft: '2px solid #f1f5f9', paddingLeft: '24px', position: 'relative' }}>
                {activities.map((act, i) => (
                    <div key={i} style={{ marginBottom: '24px', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: '-31px',
                            top: '4px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'white',
                            border: `3px solid ${act.color}`
                        }}></div>
                        <p style={{ fontWeight: 600, fontSize: '14px' }}>{act.text}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>{act.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
