import React from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Calendar, UserCircle, CheckCircle, Clock } from "lucide-react";

export default function DoctorDashboard() {
    const appointments = [
        { time: "09:00 AM", patient: "John Smith", type: "Checkup", token: "A-045", status: "In Progress" },
        { time: "09:30 AM", patient: "Sarah Johnson", type: "Consultation", token: "A-046", status: "Waiting" },
        { time: "10:00 AM", patient: "Michael Chen", type: "Follow-up", token: "A-047", status: "Waiting" },
        { time: "10:30 AM", patient: "Emily Davis", type: "Checkup", token: "A-048", status: "Waiting" },
        { time: "11:00 AM", patient: "Robert Wilson", type: "Consultation", token: "A-049", status: "Scheduled" },
        { time: "11:30 AM", patient: "Lisa Anderson", type: "Follow-up", token: "A-050", status: "Scheduled" },
    ];

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Doctor Dashboard</h1>
                <p style={{ color: "#666" }}>Welcome back, Dr. Sarah Johnson</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "2rem" }}>

                <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h3 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>12</h3>
                        <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.2" }}>Today's<br />Appointments</p>
                    </div>
                    <div style={{ background: "#e8fdf5", padding: "12px", borderRadius: "10px", color: "#0fb48c" }}>
                        <Calendar size={20} />
                    </div>
                </div>

                <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h3 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>8</h3>
                        <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.2" }}>Waiting Patients</p>
                    </div>
                    <div style={{ background: "#ebf2fc", padding: "12px", borderRadius: "10px", color: "#4589f5" }}>
                        <UserCircle size={20} />
                    </div>
                </div>

                <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h3 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>4</h3>
                        <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.2" }}>Completed</p>
                    </div>
                    <div style={{ background: "#f2e8fd", padding: "12px", borderRadius: "10px", color: "#b645f5" }}>
                        <CheckCircle size={20} />
                    </div>
                </div>

                <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h3 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>15</h3>
                        <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.2" }}>Tomorrow</p>
                    </div>
                    <div style={{ background: "#fff8ed", padding: "12px", borderRadius: "10px", color: "#f5a445" }}>
                        <Clock size={20} />
                    </div>
                </div>

            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>

                {/* Today's Appointments */}
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

                {/* Quick Stats Sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>Quick Stats</h3>

                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Total Patients</p>
                            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222" }}>156</h2>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Avg Consultation Time</p>
                            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222" }}>18 min</h2>
                        </div>

                        <div style={{ marginBottom: "32px" }}>
                            <p style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Prescriptions Issued</p>
                            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#222" }}>142</h2>
                        </div>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
                                <span style={{ color: "#555" }}>Today's Progress</span>
                                <span style={{ color: "#0fb48c" }}>33%</span>
                            </div>
                            <div style={{ height: "6px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                                <div style={{ width: "33%", height: "100%", background: "#0fb48c" }}></div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </DoctorLayout>
    );
}
