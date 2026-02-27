import React, { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, RotateCcw } from "lucide-react";

export default function Followups() {
    const [searchTerm, setSearchTerm] = useState("");

    const followups = [
        { id: "1", patient: "Michael Chen", originalVisit: "2024-02-10", reason: "Diabetes Management Check", status: "Due Today" },
        { id: "2", patient: "Lisa Anderson", originalVisit: "2024-02-05", reason: "Post-surgery observation", status: "Upcoming" },
    ];

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>Follow-ups</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>Track patients requiring return visits</p>
            </div>

            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

                <div style={{ marginBottom: "32px", display: "flex", gap: "16px" }}>
                    <div style={{ position: "relative", width: "400px" }}>
                        <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "12px 12px 12px 42px", borderRadius: "8px", border: "1px solid #eaeaea", background: "#f9f9f9", outline: "none", boxSizing: "border-box", fontSize: "14px", color: '#333' }}
                        />
                    </div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", background: "#fbfbfb" }}>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>PATIENT</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>ORIGINAL VISIT</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>REASON</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>STATUS</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {followups.map((item, index) => {
                            let statusColor = "#666";
                            let statusBg = "#f5f5f5";

                            if (item.status === "Due Today") { statusColor = "#f5a445"; statusBg = "#fff8ed"; }
                            else if (item.status === "Upcoming") { statusColor = "#4589f5"; statusBg = "#ebf2fc"; }

                            return (
                                <tr key={index} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                    <td style={{ padding: "20px 16px", fontSize: "14px", fontWeight: "600", color: "#222" }}>{item.patient}</td>
                                    <td style={{ padding: "20px 16px", fontSize: "14px", color: "#666" }}>{item.originalVisit}</td>
                                    <td style={{ padding: "20px 16px", fontSize: "14px", color: "#666" }}>{item.reason}</td>
                                    <td style={{ padding: "20px 16px", fontSize: "14px" }}>
                                        <span style={{
                                            padding: "6px 12px",
                                            borderRadius: "16px",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            background: statusBg,
                                            color: statusColor
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "20px 16px" }}>
                                        <button style={{ background: "#fff", border: "1px solid #eaeaea", cursor: "pointer", color: "#444", padding: "8px 16px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: '8px', fontSize: '13px', fontWeight: '500' }}>
                                            <RotateCcw size={16} /> Update
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </DoctorLayout>
    );
}
