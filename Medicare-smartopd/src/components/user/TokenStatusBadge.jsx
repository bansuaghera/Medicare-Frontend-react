import React from "react";

// For User panel
export default function TokenStatusBadge({ currentToken, myToken, avgWaitTime }) {
    return (
        <div style={{ padding: '20px', border: '2px solid #0fb48c', borderRadius: '12px', textAlign: 'center' }}>
            <p>Your Token</p>
            <h2 style={{ fontSize: '40px', color: '#0fb48c' }}>{myToken}</h2>
            <p style={{ color: '#666' }}>Currently Serving: <strong>{currentToken}</strong></p>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>Est. Wait: {avgWaitTime}</p>
        </div>
    );
}
