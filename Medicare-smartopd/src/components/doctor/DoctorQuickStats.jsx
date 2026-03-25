import React from "react";

export default function DoctorQuickStats({ total, avgTime, prescriptions, progress }) {
    return (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>Quick Stats</h3>

            <div style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Total Patients</p>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222" }}>{total}</h2>
            </div>

            <div style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Avg Consultation Time</p>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222" }}>{avgTime}</h2>
            </div>

            <div style={{ marginBottom: "32px" }}>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Prescriptions Issued</p>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222" }}>{prescriptions}</h2>
            </div>

            <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
                    <span style={{ color: "#555" }}>Today's Progress</span>
                    <span style={{ color: "#0fb48c" }}>{progress}%</span>
                </div>
                <div style={{ height: "6px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "#0fb48c" }}></div>
                </div>
            </div>
        </div>
    );
}
