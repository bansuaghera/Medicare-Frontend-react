import React from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { User, Calendar } from "lucide-react";

export default function Patients() {
    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>Patient History</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>Complete medical history</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>

                {/* Patient Info Card */}
                <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "24px" }}>
                    <div style={{ background: "#e8f0fe", padding: "24px", borderRadius: "16px", color: "#4589f5" }}>
                        <User size={48} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#222", marginBottom: "8px" }}>John Smith</h2>
                        <p style={{ fontSize: "15px", color: "#666", marginBottom: "16px" }}>45 years • Male • O+</p>

                        <div>
                            <p style={{ fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "4px" }}>Medical History</p>
                            <p style={{ fontSize: "14px", color: "#666" }}>Hypertension, Diabetes Type 2</p>
                        </div>
                    </div>
                </div>

                {/* Visit History */}
                <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px", color: "#222" }}>Visit History</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        <div style={{ border: "1px solid #f0f0f0", borderRadius: "12px", padding: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <div style={{ background: "#e8f0fe", color: "#4589f5", padding: "8px", borderRadius: "8px" }}>
                                    <Calendar size={18} />
                                </div>
                                <span style={{ fontSize: "16px", fontWeight: "700", color: "#333" }}>2024-02-10</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginLeft: "42px" }}>
                                <div>
                                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.5px", marginBottom: "4px", textTransform: "uppercase" }}>Diagnosis</p>
                                    <p style={{ fontSize: "15px", color: "#222" }}>Routine Checkup</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.5px", marginBottom: "4px", textTransform: "uppercase" }}>Treatment</p>
                                    <p style={{ fontSize: "15px", color: "#222" }}>Blood pressure monitoring</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.5px", marginBottom: "4px", textTransform: "uppercase" }}>Prescription</p>
                                    <p style={{ fontSize: "15px", color: "#222" }}>Amlodipine 5mg</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ border: "1px solid #f0f0f0", borderRadius: "12px", padding: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <div style={{ background: "#e8f0fe", color: "#4589f5", padding: "8px", borderRadius: "8px" }}>
                                    <Calendar size={18} />
                                </div>
                                <span style={{ fontSize: "16px", fontWeight: "700", color: "#333" }}>2024-01-25</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginLeft: "42px" }}>
                                <div>
                                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.5px", marginBottom: "4px", textTransform: "uppercase" }}>Diagnosis</p>
                                    <p style={{ fontSize: "15px", color: "#222" }}>Follow-up Consultation</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </DoctorLayout>
    );
}
