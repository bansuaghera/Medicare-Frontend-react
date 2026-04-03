import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Calendar, Plus, Search, Eye, Trash2, Clock } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function BookAppointment() {
    const [tab, setTab] = useState("list"); // "list" | "book"
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [form, setForm] = useState({
        patientId: "",
        doctorId: "",
        date: "",
        time: "",
        reason: ""
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [apptRes, patientsRes, doctorsRes] = await Promise.all([
                    API.get("/appointments"),
                    API.get("/users/patients"),
                    API.get("/users/doctors")
                ]);
                if (apptRes.data.success) setAppointments(apptRes.data.data);
                if (patientsRes.data.success) setPatients(patientsRes.data.data);
                if (doctorsRes.data.success) setDoctors(doctorsRes.data.data);
            } catch (err) {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!form.patientId || !form.doctorId || !form.date || !form.time) {
            toast.error("Please fill all required fields");
            return;
        }
        const loadToast = toast.loading("Booking appointment...");
        try {
            const res = await API.post("/appointments/book", form);
            if (res.data.success) {
                toast.success(`Appointment booked! Token: ${res.data.token}`, { id: loadToast });
                // Refresh list
                const apptRes = await API.get("/appointments");
                if (apptRes.data.success) setAppointments(apptRes.data.data);
                setForm({ patientId: "", doctorId: "", date: "", time: "", reason: "" });
                setTab("list");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed", { id: loadToast });
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await API.put(`/appointments/${id}/status`, { status });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            toast.success(`Status updated to ${status}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const filtered = appointments.filter(a =>
        (a.Patient?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.Doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "pending": return { background: "#fef9c3", color: "#a16207" };
            case "in-progress": return { background: "#dbeafe", color: "#1d4ed8" };
            case "completed": return { background: "#dcfce7", color: "#166534" };
            case "cancelled": return { background: "#fee2e2", color: "#ef4444" };
            default: return { background: "#f3f4f6", color: "#666" };
        }
    };

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>Appointments</h1>
                    <p style={{ color: "#666", fontSize: "14px" }}>Manage and book patient appointments</p>
                </div>
                <button
                    onClick={() => setTab(tab === "list" ? "book" : "list")}
                    style={{ display: "flex", alignItems: "center", gap: "8px", background: "#0fb48c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}
                >
                    {tab === "list" ? <><Plus size={18} /> Book New</> : <><Calendar size={18} /> View List</>}
                </button>
            </div>

            {tab === "list" ? (
                <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div style={{ marginBottom: "20px", position: "relative", width: "300px" }}>
                        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                        <input
                            type="text"
                            placeholder="Search patient or doctor..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "10px 10px 10px 36px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Loading appointments...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
                            <Calendar size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
                            <p style={{ fontSize: "16px", fontWeight: "500" }}>No appointments found</p>
                            <p style={{ fontSize: "14px", marginTop: "8px" }}>Click "Book New" to schedule one</p>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                                    {["Token", "Patient", "Doctor", "Date", "Time", "Reason", "Status", "Actions"].map(h => (
                                        <th key={h} style={{ padding: "12px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>{h.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(appt => (
                                    <tr key={appt.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                        <td style={{ padding: "16px", fontWeight: "700", color: "#0fb48c" }}>#{appt.tokenNumber}</td>
                                        <td style={{ padding: "16px", fontWeight: "500", color: "#1e293b" }}>{appt.Patient?.name || "Unknown"}</td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.Doctor?.name || "Assigning..."}</td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.date}</td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.time}</td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.reason || "Checkup"}</td>
                                        <td style={{ padding: "16px" }}>
                                            <select
                                                value={appt.status}
                                                onChange={e => handleUpdateStatus(appt.id, e.target.value)}
                                                style={{ ...getStatusStyle(appt.status), border: "none", borderRadius: "12px", padding: "4px 10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", outline: "none" }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <button style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#64748b" }}>
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div style={{ marginTop: "20px", color: "#64748b", fontSize: "14px" }}>
                        Showing {filtered.length} of {appointments.length} appointments
                    </div>
                </div>
            ) : (
                <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", maxWidth: "700px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px", color: "#1e293b" }}>Book New Appointment</h2>
                    <form onSubmit={handleBook} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Patient *</label>
                            <select
                                value={form.patientId}
                                onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}
                                required
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", backgroundColor: "#fff" }}
                            >
                                <option value="">Select patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Doctor *</label>
                            <select
                                value={form.doctorId}
                                onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))}
                                required
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", backgroundColor: "#fff" }}
                            >
                                <option value="">Select doctor</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>Dr. {d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Date *</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box", width: "100%" }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Time *</label>
                            <input
                                type="time"
                                value={form.time}
                                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                required
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box", width: "100%" }}
                            />
                        </div>

                        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Reason / Chief Complaint</label>
                            <input
                                type="text"
                                placeholder="e.g. Fever, Follow-up, Checkup..."
                                value={form.reason}
                                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px" }}
                            />
                        </div>

                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", marginTop: "8px" }}>
                            <button type="submit" style={{ background: "#0fb48c", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <Calendar size={16} /> Book Appointment
                            </button>
                            <button type="button" onClick={() => setTab("list")} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", padding: "12px 24px", borderRadius: "8px", fontWeight: "500", cursor: "pointer", fontSize: "14px" }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </StaffLayout>
    );
}
