import React from "react";

// For Doctor panel
export default function NextPatientCard({ patientName, time, type }) {
    return (
        <div style={{ padding: '24px', background: '#0fb48c', color: '#fff', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', opacity: 0.9 }}>Next Patient</h3>
            <h1 style={{ fontSize: '32px', margin: '16px 0' }}>{patientName}</h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', opacity: 0.9 }}>
                <span>{time}</span>
                <span>•</span>
                <span>{type}</span>
            </div>
        </div>
    );
}
