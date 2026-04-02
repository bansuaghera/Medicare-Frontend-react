import React from "react";

export default function TodayAppointments({ appointments }) {
    if (!appointments || appointments.length === 0) return null;

    return (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Today's Appointments</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {appointments.map((apt, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", border: "1px solid #f0f0f0", borderRadius: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#333", width: "70px" }}>{apt.time}</span>
                            <div>
                                <h4 style={{ fontSize: "15px", fontWeight: "500", color: "#333", marginBottom: "4px" }}>{apt.patient}</h4>
                                <p style={{ fontSize: "13px", color: "#888" }}>{apt.doctor}</p>
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#0fb48c" }}>{apt.token}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
