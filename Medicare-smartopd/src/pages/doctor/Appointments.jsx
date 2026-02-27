import React, { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, Eye } from "lucide-react";

export default function Appointments() {
    const [searchTerm, setSearchTerm] = useState("");

    const appointments = [
        { time: "09:00 AM", patient: "John Smith", type: "Checkup", token: "A-045", status: "In Progress" },
        { time: "09:30 AM", patient: "Sarah Johnson", type: "Consultation", token: "A-046", status: "Waiting" },
        { time: "10:00 AM", patient: "Michael Chen", type: "Follow-up", token: "A-047", status: "Waiting" },
        { time: "10:30 AM", patient: "Emily Davis", type: "Checkup", token: "A-048", status: "Waiting" },
    ];

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>Today's Appointments</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>View your appointments</p>
            </div>

            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

                <div style={{ marginBottom: "24px", display: "flex", gap: "16px" }}>
                    <div style={{ position: "relative", width: "400px" }}>
                        <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "12px 12px 12px 42px", borderRadius: "8px", border: "1px solid #ddd", background: "#f9f9f9", outline: "none", boxSizing: "border-box", fontSize: "14px" }}
                        />
                    </div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", background: "#fbfbfb" }}>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>TIME</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>PATIENT</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>TYPE</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>TOKEN</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>STATUS</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt, index) => {
                            let statusColor = "#666";
                            let statusBg = "#f5f5f5";

                            if (apt.status === "In Progress") { statusColor = "#4589f5"; statusBg = "#ebf2fc"; }
                            else if (apt.status === "Waiting") { statusColor = "#f5a445"; statusBg = "#fff8ed"; }

                            return (
                                <tr key={index} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                    <td style={{ padding: "20px 16px", fontSize: "14px", fontWeight: "600", color: "#444" }}>{apt.time}</td>
                                    <td style={{ padding: "20px 16px", fontSize: "14px", fontWeight: "600", color: "#222" }}>{apt.patient}</td>
                                    <td style={{ padding: "20px 16px", fontSize: "14px", color: "#666" }}>{apt.type}</td>
                                    <td style={{ padding: "20px 16px", fontSize: "14px", fontWeight: "500", color: "#444" }}>{apt.token}</td>
                                    <td style={{ padding: "20px 16px", fontSize: "14px" }}>
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
                                    </td>
                                    <td style={{ padding: "20px 16px" }}>
                                        <button style={{ background: "#fff", border: "1px solid #eaeaea", cursor: "pointer", color: "#666", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
                    <span style={{ fontSize: "14px", color: "#666" }}>Showing {appointments.length} results</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button style={{ padding: "10px 16px", background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#444", fontWeight: "500" }}>Previous</button>
                        <button style={{ padding: "10px 16px", background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#444", fontWeight: "500" }}>Next</button>
                    </div>
                </div>

            </div>
        </DoctorLayout>
    );
}
