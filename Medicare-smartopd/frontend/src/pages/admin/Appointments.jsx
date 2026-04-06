import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Filter,
    Eye,
    MoreVertical,
    Trash2,
    Square,
    AlertCircle,
    Plus,
    Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("list");
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [form, setForm] = useState({
        patientId: "",
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        isEmergency: true
    });

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "danger",
        onConfirm: () => {}
    });

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const [apptRes, patientsRes, doctorsRes] = await Promise.all([
                API.get("/appointments"),
                API.get("/users/patients"),
                API.get("/users/doctors")
            ]);
            
            if (apptRes.data.success) {
                setAppointments(apptRes.data.data.map(app => ({
                    id: app.id,
                    patient: app.Patient?.name || "Unknown",
                    doctor: app.Doctor?.name || "Assigning...",
                    date: app.date,
                    time: app.time,
                    type: app.reason || "Checkup",
                    token: app.tokenNumber,
                    status: app.status || "pending",
                    isEmergency: app.isEmergency
                })));
            }
            if (patientsRes?.data?.success) setPatients(patientsRes.data.data);
            if (doctorsRes?.data?.success) setDoctors(doctorsRes.data.data);
            
        } catch {
            toast.error("Failed to load appointments data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!form.patientId || !form.doctorId || !form.date || !form.time) {
            toast.error("Please fill all required fields");
            return;
        }
        const loadToast = toast.loading("Booking emergency appointment...");
        try {
            const res = await API.post("/appointments/book", form);
            if (res.data.success) {
                toast.success(`Emergency Appointment booked! Token: ${res.data.token}`, { id: loadToast });
                fetchAppointments();
                setForm({ patientId: "", doctorId: "", date: "", time: "", reason: "", isEmergency: true });
                setTab("list");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed", { id: loadToast });
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(appointments.map(a => a.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) return;
        
        setConfirmModal({
            isOpen: true,
            title: "Delete Selected Appointments?",
            message: `You are about to permanently remove ${selectedIds.size} appointments. This action cannot be undone.`,
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Deleting appointments...");
                try {
                    const res = await API.delete("/appointments", { data: { appointmentIds: Array.from(selectedIds) } });
                    if (res.data.success) {
                        toast.success("Appointments deleted successfully", { id: loadToast });
                        setSelectedIds(new Set());
                        fetchAppointments();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch {
                    toast.error("Deletion failed", { id: loadToast });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const handleClearAll = () => {
        setConfirmModal({
            isOpen: true,
            title: "Clear All Appointments?",
            message: "This will wipe every single appointment record from the system database. Are you absolutely sure?",
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Clearing data...");
                try {
                    const res = await API.delete("/appointments/clear-all");
                    if (res.data.success) {
                        toast.success("All appointments cleared", { id: loadToast });
                        setSelectedIds(new Set());
                        fetchAppointments();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch {
                    toast.error("Failed to clear", { id: loadToast });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await API.put(`/appointments/${id}/status`, { status: newStatus.toLowerCase() });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
            toast.success(`Appointment status updated to ${newStatus}`);
        } catch {
            toast.error('Failed to update appointment status');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "in-progress": return { background: "#ebf2fc", color: "#4589f5", label: "In Progress" };
            case "completed": return { background: "#e8fdf5", color: "#0fb48c", label: "Completed" };
            case "cancelled": return { background: "#fee2e2", color: "#ef4444", label: "Cancelled" };
            default: return { background: "#fff8ed", color: "#f5a445", label: "Pending" };
        }
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div className="page-title">
                        <h1 style={{ margin: 0 }}>Appointment Records</h1>
                        <p style={{ margin: '4px 0 0 0' }}>Manage patient appointments and status</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setTab(tab === "list" ? "book" : "list")}
                            style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ef4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
                        >
                            {tab === "list" ? <><Plus size={18} /> Add New Emergency Appointment</> : <><Calendar size={18} /> View List</>}
                        </button>
                    </div>
                </div>

                {tab === "book" ? (
                    <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid #e5e7eb", maxWidth: "700px", margin: "0 auto" }}>
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
                                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Doctor *</label>
                                <select
                                    value={form.doctorId}
                                    onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))}
                                    required
                                    style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", backgroundColor: "#fff" }}
                                >
                                    <option value="">Select doctor</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>Dr. {d.name}</option>
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
                                    id="adminIsEmergency"
                                    checked={form.isEmergency}
                                    onChange={e => setForm(f => ({ ...f, isEmergency: e.target.checked }))}
                                    style={{ width: "18px", height: "18px", accentColor: "#ef4444", cursor: "pointer" }}
                                />
                                <label htmlFor="adminIsEmergency" style={{ fontSize: "14px", fontWeight: "600", color: "#b91c1c", cursor: "pointer", margin: 0 }}>
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
                <div className="table-card" style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div className="table-toolbar" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div className="inner-search" style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '300px' }}>
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {selectedIds.size > 0 && (
                                <button 
                                    onClick={handleDeleteSelected}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    <Trash2 size={16} />
                                    Delete Selected ({selectedIds.size})
                                </button>
                            )}
                            <button 
                                onClick={handleClearAll}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                            >
                                <AlertCircle size={16} />
                                Clear All
                            </button>
                        </div>
                        <button className="page-btn" style={{ background: '#f1f5f9', border: 'none', padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                            <Filter size={16} />
                            Filter List
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <tr>
                                    <th style={{ padding: '16px', textAlign: 'left', width: '40px' }}>
                                        <input 
                                            type="checkbox" 
                                            onChange={handleSelectAll}
                                            checked={selectedIds.size === appointments.length && appointments.length > 0}
                                        />
                                    </th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Details</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Patient</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Doctor</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Schedule</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length > 0 ? appointments.map((appt) => (
                                        <tr key={appt.id} style={{ borderBottom: '1px solid #f1f5f9', background: appt.isEmergency ? '#fef2f2' : (selectedIds.has(appt.id) ? '#f0f9ff' : 'transparent') }}>
                                            <td style={{ padding: '16px', textAlign: 'left' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.has(appt.id)}
                                                    onChange={() => handleSelectOne(appt.id)}
                                                />
                                            </td>
                                        <td style={{ padding: '16px' }}>
                                            <p style={{ margin: 0, fontWeight: '700', color: '#0fb48c' }}>#{appt.token}</p>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {appt.id.slice(0, 8)}</span>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '600' }}>
                                            {appt.patient}
                                            {appt.isEmergency && <span style={{ marginLeft: "8px", background: "#fef2f2", color: "#ef4444", padding: "2px 6px", borderRadius: "10px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>Emergency</span>}
                                        </td>
                                        <td style={{ padding: '16px' }}>{appt.doctor}</td>
                                        <td style={{ padding: '16px' }}>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{appt.date}</p>
                                            <span style={{ fontSize: '11px', color: '#64748b' }}>{appt.time}</span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                                <span
                                                    className="status-badge"
                                                    style={{ 
                                                        ...getStatusStyle(appt.status), 
                                                        padding: '4px 10px',
                                                        borderRadius: '8px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase'
                                                    }}
                                                >
                                                    {getStatusStyle(appt.status).label}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                {appt.status === "pending" && (
                                                    <button
                                                        onClick={() => updateStatus(appt.id, "in-progress")}
                                                        style={{ background: "#ebf2fc", color: "#4589f5", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}
                                                    >
                                                        Call In
                                                    </button>
                                                )}
                                                {appt.status === "in-progress" && (
                                                    <button
                                                        onClick={() => updateStatus(appt.id, "completed")}
                                                        style={{ background: "#0fb48c", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                <Link to="/admin/profile" style={{ border: 'none', background: '#f1f5f9', color: '#6366f1', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                                                    <Eye size={18} />
                                                </Link>
                                                <button style={{ border: 'none', background: '#f1f5f9', color: '#64748b', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                                            {loading ? "Loading appointments data..." : "No bookings found for the current period."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination" style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Total Records: <strong>{appointments.length}</strong></span>
                    </div>

                </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />
        </AdminLayout>
    );
}
