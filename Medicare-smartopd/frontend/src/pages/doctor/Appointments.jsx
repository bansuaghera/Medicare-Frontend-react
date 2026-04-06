import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, Eye, CheckCircle, Stethoscope, Trash2, X, Plus, Calendar, AlertCircle } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Appointments() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [detailsModal, setDetailsModal] = useState(null);
    const [tab, setTab] = useState("list");
    const [patients, setPatients] = useState([]);
    
    const [form, setForm] = useState({
        patientId: "",
        doctorId: user.id,
        date: "",
        time: "",
        reason: "",
        isEmergency: true
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user.id) return;
            try {
                const [apptRes, patRes] = await Promise.all([
                    API.get(`/appointments/doctor/${user.id}`),
                    API.get("/users/patients")
                ]);
                if (apptRes.data.success) {
                    setAppointments(apptRes.data.data);
                }
                if (patRes.data.success) {
                    setPatients(patRes.data.data);
                }
            } catch (err) {
                toast.error("Failed to load appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [user.id, tab]);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!form.patientId || !form.date || !form.time) {
            toast.error("Please fill all required fields");
            return;
        }
        const loadToast = toast.loading("Booking emergency appointment...");
        try {
            const res = await API.post("/appointments/book", form);
            if (res.data.success) {
                toast.success(`Emergency Appointment booked! Token: ${res.data.token}`, { id: loadToast });
                setForm({ patientId: "", doctorId: user.id, date: "", time: "", reason: "", isEmergency: true });
                setTab("list");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed", { id: loadToast });
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/appointments/${id}/status`, { status });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            toast.success(`Marked as ${status}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleCancel = async (id) => {
        try {
            await API.put(`/appointments/${id}/status`, { status: 'cancelled' });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
            toast.success('Appointment cancelled');
        } catch {
            toast.error('Failed to cancel appointment');
        }
    };

    const handleEmergencyToggle = async (id, currentEmergency) => {
        try {
            await API.put(`/appointments/${id}/emergency`, { isEmergency: !currentEmergency });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, isEmergency: !currentEmergency } : a));
            toast.success('Emergency status updated');
        } catch {
            toast.error('Failed to update emergency status');
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filtered.map(a => a.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectItem = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) {
            toast.error("No appointments selected");
            return;
        }
        if (!window.confirm(`Delete ${selectedIds.size} appointment(s)?`)) return;

        const loadToast = toast.loading("Deleting appointments...");
        try {
            await Promise.all(Array.from(selectedIds).map(id => 
                API.delete(`/appointments/${id}`)
            ));
            setAppointments(prev => prev.filter(a => !selectedIds.has(a.id)));
            setSelectedIds(new Set());
            toast.success("Appointments deleted", { id: loadToast });
        } catch (error) {
            toast.error("Failed to delete appointments", { id: loadToast });
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
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={() => setTab(tab === "list" ? "book" : "list")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ef4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
                    >
                        {tab === "list" ? <><Plus size={18} /> Add New Emergency Appointment</> : <><Calendar size={18} /> View List</>}
                    </button>
                </div>
            </div>

            {tab === "book" ? (
                <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid #e5e7eb", maxWidth: "700px", margin: "0 auto", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
                        Add New Emergency Appointment
                    </h2>
                    <form onSubmit={handleBook} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Patient *</label>
                            <select
                                value={form.patientId}
                                onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}
                                required
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", backgroundColor: "#fff" }}
                            >
                                <option value="">Select patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Date *</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", boxSizing: "border-box", width: "100%" }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Time *</label>
                            <input
                                type="time"
                                value={form.time}
                                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                required
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", boxSizing: "border-box", width: "100%" }}
                            />
                        </div>

                        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Reason / Chief Complaint</label>
                            <input
                                type="text"
                                placeholder="e.g. Severe Abdominal Pain, Accident..."
                                value={form.reason}
                                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                            />
                        </div>

                        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px", background: "#fef2f2", padding: "14px", borderRadius: "8px", border: "1px solid #fecaca" }}>
                            <input
                                type="checkbox"
                                id="doctorIsEmergency"
                                checked={form.isEmergency}
                                onChange={e => setForm(f => ({ ...f, isEmergency: e.target.checked }))}
                                style={{ width: "18px", height: "18px", accentColor: "#ef4444", cursor: "pointer" }}
                            />
                            <label htmlFor="doctorIsEmergency" style={{ fontSize: "14px", fontWeight: "600", color: "#b91c1c", cursor: "pointer", margin: 0 }}>
                                Mark as Emergency (High Priority)
                            </label>
                        </div>

                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", marginTop: "16px" }}>
                            <button type="submit" style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                <AlertCircle size={18} /> Schedule Emergency
                            </button>
                            <button type="button" onClick={() => setTab("list")} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", padding: "14px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "15px" }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ marginBottom: "24px", display: "flex", gap: "16px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
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

                {selectedIds.size > 0 && (
                    <div style={{ background: "#f0f9ff", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e40af" }}>
                            {selectedIds.size} appointment{selectedIds.size !== 1 ? "s" : ""} selected
                        </span>
                        <button
                            onClick={handleDeleteSelected}
                            style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fef2f2", color: "#ef4444", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                        >
                            <Trash2 size={14} />
                            Delete Selected
                        </button>
                    </div>
                )}

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
                                <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px", width: "40px" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                                        onChange={handleSelectAll}
                                        style={{ cursor: "pointer" }}
                                    />
                                </th>
                                {["TOKEN", "TIME", "PATIENT", "REASON", "STATUS", "ACTIONS"].map(h => (
                                    <th key={h} style={{ padding: "14px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((apt) => {
                                const s = getStatusStyle(apt.status);
                                return (
                                    <tr key={apt.id} style={{ borderBottom: "1px solid #f5f5f5", background: apt.isEmergency ? "#fef2f2" : (selectedIds.has(apt.id) ? "#f0f9ff" : "#fff") }}>
                                        <td style={{ padding: "18px 16px", width: "40px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(apt.id)}
                                                onChange={() => handleSelectItem(apt.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </td>
                                        <td style={{ padding: "18px 16px", fontWeight: "700", color: "#0fb48c", fontSize: "16px" }}>#{apt.tokenNumber}</td>
                                        <td style={{ padding: "18px 16px", fontSize: "14px", fontWeight: "600", color: "#444" }}>{apt.time}</td>
                                        <td style={{ padding: "18px 16px", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                                            {apt.Patient?.name || "Unknown"}
                                            {apt.isEmergency && <span style={{ marginLeft: "8px", background: "#fef2f2", color: "#ef4444", padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>Emergency</span>}
                                        </td>
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
                                                {apt.status === "pending" && (
                                                    <button
                                                        onClick={() => handleEmergencyToggle(apt.id, apt.isEmergency)}
                                                        style={{ background: apt.isEmergency ? "#fee2e2" : "#f1f5f9", color: apt.isEmergency ? "#ef4444" : "#64748b", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                                                    >
                                                        {apt.isEmergency ? "Remove Emergency" : "Emergency"}
                                                    </button>
                                                )}

                                                {apt.status !== "cancelled" && apt.status !== "completed" && (
                                                    <button
                                                        onClick={() => handleCancel(apt.id)}
                                                        style={{ background: "#fef2f2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/doctor/examination/${apt.id}`)}
                                                    title="Examine"
                                                    style={{ background: "#fff3e0", border: "1px solid #ffe0b2", cursor: "pointer", color: "#e65100", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "12px", fontWeight: "600" }}
                                                >
                                                    <Stethoscope size={14} /> Examine
                                                </button>
                                                <button
                                                    onClick={() => setDetailsModal(apt)}
                                                    title="View Details"
                                                    style={{ background: "#fff", border: "1px solid #eaeaea", cursor: "pointer", color: "#666", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                >
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
            )}

            {detailsModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", maxWidth: "500px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Appointment Details</h2>
                            <button
                                onClick={() => setDetailsModal(null)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: "0", color: "#999" }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Token Number</label>
                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "4px 0 0 0" }}>#{detailsModal.tokenNumber}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Patient Name</label>
                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "4px 0 0 0" }}>{detailsModal.Patient?.name || "Unknown"}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Patient Email</label>
                                <p style={{ fontSize: "14px", color: "#475569", margin: "4px 0 0 0" }}>{detailsModal.Patient?.email || "N/A"}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Date</label>
                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "4px 0 0 0" }}>{detailsModal.date}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Time</label>
                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "4px 0 0 0" }}>{detailsModal.time}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Reason for Visit</label>
                                <p style={{ fontSize: "14px", color: "#475569", margin: "4px 0 0 0" }}>{detailsModal.reason || "Checkup"}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Status</label>
                                <p style={{ fontSize: "14px", fontWeight: "600", color: getStatusStyle(detailsModal.status).color, margin: "4px 0 0 0" }}>
                                    {getStatusStyle(detailsModal.status).label}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
}
