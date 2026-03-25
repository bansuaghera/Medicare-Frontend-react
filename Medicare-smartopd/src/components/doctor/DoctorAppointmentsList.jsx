import React from "react";

export default function DoctorAppointmentsList({ appointments }) {
    return (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", height: "fit-content" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Today's Appointments</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {appointments.map((apt, index) => {
                    let statusColor = "#666";
                    let statusBg = "#f5f5f5";

                    if (apt.status === "In Progress") { statusColor = "#4589f5"; statusBg = "#ebf2fc"; }
                    else if (apt.status === "Waiting") { statusColor = "#f5a445"; statusBg = "#fff8ed"; }

                    return (
                        <div key={index} style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>{apt.time}</div>
                                <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{apt.patient}</div>
                                <div style={{ fontSize: "12px", color: "#888" }}>{apt.type} • Token: {apt.token}</div>
                            </div>
                            <div>
                                <span style={{
                                    padding: "6px 12px",
                                    borderRadius: "16px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    background: statusBg,
                                    color: statusColor
                                }}>
                                    {apt.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
