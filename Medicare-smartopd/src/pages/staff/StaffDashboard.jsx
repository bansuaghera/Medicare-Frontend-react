import React from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { UserPlus, Calendar, CreditCard, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function StaffDashboard() {
    return (
        <StaffLayout panelTitle="Staff Panel">
            <div className="dashboard-header-section" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Staff Dashboard</h1>
                <p style={{ color: "#666" }}>Welcome back! Here's today's overview</p>
            </div>

            <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "2rem" }}>

                <div className="stat-card" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>Today's Appointments</p>
                        <h3 style={{ fontSize: "28px", fontWeight: "700" }}>38</h3>
                    </div>
                    <div style={{ background: "#e8fdf5", padding: "12px", borderRadius: "10px", color: "#0fb48c" }}>
                        <Calendar size={24} />
                    </div>
                </div>

                <div className="stat-card" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>Active Tokens</p>
                        <h3 style={{ fontSize: "28px", fontWeight: "700" }}>12</h3>
                    </div>
                    <div style={{ background: "#ebf2fc", padding: "12px", borderRadius: "10px", color: "#4589f5" }}>
                        <CreditCard size={24} />
                    </div>
                </div>

                <div className="stat-card" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>New Patients</p>
                        <h3 style={{ fontSize: "28px", fontWeight: "700" }}>5</h3>
                    </div>
                    <div style={{ background: "#faf1fd", padding: "12px", borderRadius: "10px", color: "#b645f5" }}>
                        <UserPlus size={24} />
                    </div>
                </div>

                <div className="stat-card" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>Scheduled Tomorrow</p>
                        <h3 style={{ fontSize: "28px", fontWeight: "700" }}>42</h3>
                    </div>
                    <div style={{ background: "#fff8ed", padding: "12px", borderRadius: "10px", color: "#f5a445" }}>
                        <Clock size={24} />
                    </div>
                </div>

            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>

                {/* Quick Actions */}
                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Quick Actions</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link to="/staff/register-patient" style={{ textDecoration: 'none' }}>
                            <button style={{ width: "100%", padding: "16px", background: "#0fb48c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                                <UserPlus size={18} /> Register Patient
                            </button>
                        </Link>

                        <Link to="/staff/appointments" style={{ textDecoration: 'none' }}>
                            <button style={{ width: "100%", padding: "16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                                <Calendar size={18} /> Book Appointment
                            </button>
                        </Link>

                        <Link to="/staff/tokens" style={{ textDecoration: 'none' }}>
                            <button style={{ width: "100%", padding: "16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                                <FileText size={18} /> Generate Token
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Today's Appointments */}
                <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Today's Appointments</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[
                            { time: "09:00 AM", patient: "John Smith", doctor: "Dr. Sarah Johnson", token: "A-045" },
                            { time: "09:30 AM", patient: "Sarah Johnson", doctor: "Dr. Michael Chen", token: "A-046" },
                            { time: "10:00 AM", patient: "Michael Chen", doctor: "Dr. Emily Davis", token: "A-047" },
                            { time: "10:30 AM", patient: "Emily Davis", doctor: "Dr. Robert Wilson", token: "A-048" },
                            { time: "11:00 AM", patient: "Robert Wilson", doctor: "Dr. Lisa Anderson", token: "A-049" },
                            { time: "11:30 AM", patient: "Lisa Anderson", doctor: "Dr. Mark Thompson", token: "A-050" }
                        ].map((apt, index) => (
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

            </div>
        </StaffLayout>
    );
}
