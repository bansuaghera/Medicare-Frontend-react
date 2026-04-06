import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Calendar, Plus, Search, Eye, Trash2, Clock, X } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function BookAppointment() {
    const [tab, setTab] = useState("list"); // "list" | "book"
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [detailsModal, setDetailsModal] = useState(null);

    const [form, setForm] = useState({
        patientId: "",
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        isEmergency: false
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
                setForm({ patientId: "", doctorId: "", date: "", time: "", reason: "", isEmergency: false });
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
            await API.delete("/appointments", { data: { appointmentIds: Array.from(selectedIds) } });
            setAppointments(prev => prev.filter(a => !selectedIds.has(a.id)));
            setSelectedIds(new Set());
            toast.success("Appointments deleted", { id: loadToast });
        } catch (error) {
            toast.error("Failed to delete appointments", { id: loadToast });
        }
    };

    const filtered = appointments.filter(a =>
        (a.Patient?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.Doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "pending": return { background: "#fef9c3", color: "#a16207", label: "Pending" };
            case "in-progress": return { background: "#dbeafe", color: "#1d4ed8", label: "In Progress" };
            case "completed": return { background: "#dcfce7", color: "#166534", label: "Completed" };
            case "cancelled": return { background: "#fee2e2", color: "#ef4444", label: "Cancelled" };
            default: return { background: "#f3f4f6", color: "#666", label: "Unknown" };
        }
    };

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>Appointments</h1>
                    <p style={{ color: "#666", fontSize: "14px" }}>Manage and book patient appointments</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => { setForm(prev => ({ ...prev, isEmergency: true })); setTab(tab === "list" ? "book" : "list"); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ef4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
                    >
                        {tab === "list" ? <><Plus size={18} /> Add New Emergency Appointment</> : <><Calendar size={18} /> View List</>}
                    </button>
                    <button
                        onClick={() => { setForm(prev => ({ ...prev, isEmergency: false })); setTab(tab === "list" ? "book" : "list"); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "#0fb48c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
                    >
                        {tab === "list" ? <><Plus size={18} /> Book Regular</> : <><Calendar size={18} /> View List</>}
                    </button>
                </div>
            </div>

            {tab === "list" ? (
                <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div style={{ marginBottom: "20px", display: "flex", gap: "16px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ position: "relative", width: "300px" }}>
                            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                            <input
                                type="text"
                                placeholder="Search patient or doctor..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: "100%", padding: "10px 10px 10px 36px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                            />
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
                                <tr style={{ borderBottom: "2px solid #f0f0f0", background: "#fbfbfb" }}>
                                    <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px", width: "40px" }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size === filtered.length && filtered.length > 0}
                                            onChange={handleSelectAll}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </th>
                                    {["Token", "Patient", "Doctor", "Date", "Time", "Reason", "Status", "Actions"].map(h => (
                                        <th key={h} style={{ padding: "14px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px", letterSpacing: "0.5px" }}>{h.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(appt => (
                                    <tr key={appt.id} style={{ borderBottom: "1px solid #f5f5f5", background: appt.isEmergency ? "#fef2f2" : (selectedIds.has(appt.id) ? "#f0f9ff" : "#fff") }}>
                                        <td style={{ padding: "16px", width: "40px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(appt.id)}
                                                onChange={() => handleSelectItem(appt.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </td>
                                        <td style={{ padding: "16px", fontWeight: "700", color: "#0fb48c", fontSize: "16px" }}>#{appt.tokenNumber}</td>
                                        <td style={{ padding: "16px", fontWeight: "500", color: "#1e293b" }}>
                                            {appt.Patient?.name || "Unknown"}
                                            {appt.isEmergency && <span style={{ marginLeft: "8px", background: "#fef2f2", color: "#ef4444", padding: "2px 6px", borderRadius: "10px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>Emergency</span>}
                                        </td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.Doctor?.name || "Assigning..."}</td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.date}</td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.time}</td>
                                        <td style={{ padding: "16px", color: "#475569" }}>{appt.reason || "Checkup"}</td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ 
                                                    ...getStatusStyle(appt.status), 
                                                    padding: "4px 10px", 
                                                    borderRadius: "12px", 
                                                    fontSize: "11px", 
                                                    fontWeight: "700", 
                                                    textAlign: 'center',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {getStatusStyle(appt.status).label}
                                                </span>
                                                {appt.status === "in-progress" && (
                                                    <span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center' }}>Called by Dr.</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {appt.status === "pending" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(appt.id, "in-progress")}
                                                        style={{ background: "#ebf2fc", color: "#4589f5", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}
                                                    >
                                                        Call In
                                                    </button>
                                                )}
                                                {appt.status === "in-progress" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(appt.id, "completed")}
                                                        style={{ background: "#0fb48c", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setDetailsModal(appt)}
                                                    title="View Details"
                                                    style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
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

                        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px", background: "#fef2f2", padding: "14px", borderRadius: "8px", border: "1px solid #fecaca" }}>
                            <input
                                type="checkbox"
                                id="staffIsEmergency"
                                checked={form.isEmergency}
                                onChange={e => setForm(f => ({ ...f, isEmergency: e.target.checked }))}
                                style={{ width: "18px", height: "18px", accentColor: "#ef4444", cursor: "pointer" }}
                            />
                            <label htmlFor="staffIsEmergency" style={{ fontSize: "14px", fontWeight: "600", color: "#b91c1c", cursor: "pointer", margin: 0 }}>
                                Mark as Emergency (Priority)
                            </label>
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
                                <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>Doctor</label>
                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "4px 0 0 0" }}>Dr. {detailsModal.Doctor?.name || "Assigning..."}</p>
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
        </StaffLayout>
    );
}
