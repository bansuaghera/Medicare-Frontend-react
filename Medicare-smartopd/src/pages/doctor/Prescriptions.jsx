import React, { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, Eye } from "lucide-react";

export default function Prescriptions() {
    const [searchTerm, setSearchTerm] = useState("");

    const prescriptions = [
        { id: "1", patient: "John Smith", date: "2024-02-12", diagnosis: "Hypertension", medicines: 3 },
        { id: "2", patient: "Sarah Johnson", date: "2024-02-11", diagnosis: "Fever", medicines: 2 },
        { id: "3", patient: "Michael Chen", date: "2024-02-10", diagnosis: "Diabetes Check", medicines: 4 },
    ];

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>My Prescriptions</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>View all prescriptions</p>
            </div>

            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

                <div style={{ marginBottom: "32px", display: "flex", gap: "16px" }}>
                    <div style={{ position: "relative", width: "400px" }}>
                        <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                        <input
                            type="text"
                            placeholder="Search prescriptions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "12px 12px 12px 42px", borderRadius: "8px", border: "1px solid #eaeaea", background: "#f9f9f9", outline: "none", boxSizing: "border-box", fontSize: "14px", color: '#333' }}
                        />
                    </div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", background: "#fbfbfb" }}>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "11px", letterSpacing: "1px", textTransform: 'uppercase' }}>ID</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "11px", letterSpacing: "1px", textTransform: 'uppercase' }}>PATIENT</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "11px", letterSpacing: "1px", textTransform: 'uppercase' }}>DATE</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "11px", letterSpacing: "1px", textTransform: 'uppercase' }}>DIAGNOSIS</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "11px", letterSpacing: "1px", textTransform: 'uppercase' }}>MEDICINES</th>
                            <th style={{ padding: "16px", color: "#666", fontWeight: "600", fontSize: "11px", letterSpacing: "1px", textTransform: 'uppercase' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((script, index) => (
                            <tr key={script.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                <td style={{ padding: "24px 16px", fontSize: "14px", fontWeight: "600", color: "#444" }}>{script.id}</td>
                                <td style={{ padding: "24px 16px", fontSize: "14px", fontWeight: "600", color: "#222" }}>{script.patient}</td>
                                <td style={{ padding: "24px 16px", fontSize: "14px", color: "#666" }}>{script.date}</td>
                                <td style={{ padding: "24px 16px", fontSize: "14px", color: "#666" }}>{script.diagnosis}</td>
                                <td style={{ padding: "24px 16px", fontSize: "14px", color: "#666" }}>{script.medicines}</td>
                                <td style={{ padding: "24px 16px" }}>
                                    <button style={{ background: "#fff", border: "1px solid #eaeaea", cursor: "pointer", color: "#444", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
                    <span style={{ fontSize: "14px", color: "#666" }}>Showing <span style={{ fontWeight: '600', color: '#333' }}>{prescriptions.length}</span> results</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button style={{ padding: "10px 16px", background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#444", fontWeight: "500" }}>Previous</button>
                        <button style={{ padding: "10px 16px", background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#444", fontWeight: "500" }}>Next</button>
                    </div>
                </div>

            </div>
        </DoctorLayout>
    );
}
