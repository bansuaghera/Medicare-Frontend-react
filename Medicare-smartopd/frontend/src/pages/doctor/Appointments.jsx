import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, Eye, CheckCircle, Stethoscope } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Appointments() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user.id) return;
            try {
                // Fetch today's queue for this doctor
                const res = await API.get(`/appointments/queue/${user.id}`);
                if (res.data.success) {
                    setAppointments(res.data.data);
                }
            } catch (err) {
                toast.error("Failed to load appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [user.id]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/appointments/${id}/status`, { status });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            toast.success(`Marked as ${status}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "in-progress": return { color: "#4589f5", bg: "#ebf2fc", label: "In Progress" };
            case "completed": return { color: "#0fb48c", bg: "#e8fdf5", label: "Completed" };
            case "cancelled": return { color: "#ef4444", bg: "#fee2e2", label: "Cancelled" };
            default: return { color: "#f5a445", bg: "#fff8ed", label: "Waiting" };
        }
    };

    const filtered = appointments.filter(a =>
        (a.Patient?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.reason || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>Today's Appointments</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    &nbsp;— {appointments.length} patient{appointments.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ marginBottom: "24px", display: "flex", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ position: "relative", width: "360px" }}>
                        <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                        <input
                            type="text"
                            placeholder="Search patient or reason..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "12px 12px 12px 42px", borderRadius: "8px", border: "1px solid #ddd", background: "#f9f9f9", outline: "none", boxSizing: "border-box", fontSize: "14px" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ background: "#e8fdf5", color: "#0fb48c", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                            Waiting: {appointments.filter(a => a.status === "pending").length}
                        </span>
                        <span style={{ background: "#ebf2fc", color: "#4589f5", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                            Done: {appointments.filter(a => a.status === "completed").length}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>Loading appointments...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
                        <CheckCircle size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
                        <p style={{ fontSize: "16px", fontWeight: "500" }}>No appointments today</p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f0f0f0", background: "#fbfbfb" }}>
                                {["TOKEN", "TIME", "PATIENT", "REASON", "STATUS", "ACTIONS"].map(h => (
                                    <th key={h} style={{ padding: "14px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((apt) => {
                                const s = getStatusStyle(apt.status);
                                return (
                                    <tr key={apt.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                        <td style={{ padding: "18px 16px", fontWeight: "700", color: "#0fb48c", fontSize: "16px" }}>#{apt.tokenNumber}</td>
                                        <td style={{ padding: "18px 16px", fontSize: "14px", fontWeight: "600", color: "#444" }}>{apt.time}</td>
                                        <td style={{ padding: "18px 16px", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{apt.Patient?.name || "Unknown"}</td>
                                        <td style={{ padding: "18px 16px", fontSize: "14px", color: "#666" }}>{apt.reason || "Checkup"}</td>
                                        <td style={{ padding: "18px 16px" }}>
                                            <span style={{ padding: "6px 14px", borderRadius: "16px", fontSize: "12px", fontWeight: "600", background: s.bg, color: s.color }}>
                                                {s.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "18px 16px" }}>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                {apt.status === "pending" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt.id, "in-progress")}
                                                        style={{ background: "#ebf2fc", color: "#4589f5", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                                                    >
                                                        Call In
                                                    </button>
                                                )}
                                                {apt.status === "in-progress" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt.id, "completed")}
                                                        style={{ background: "#e8fdf5", color: "#0fb48c", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/doctor/examination/${apt.id}`)}
                                                    title="Examine"
                                                    style={{ background: "#fff3e0", border: "1px solid #ffe0b2", cursor: "pointer", color: "#e65100", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "12px", fontWeight: "600" }}
                                                >
                                                    <Stethoscope size={14} /> Examine
                                                </button>
                                                <button style={{ background: "#fff", border: "1px solid #eaeaea", cursor: "pointer", color: "#666", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                    <span style={{ fontSize: "14px", color: "#666" }}>Showing {filtered.length} of {appointments.length} appointments</span>
                </div>
            </div>
        </DoctorLayout>
    );
}
