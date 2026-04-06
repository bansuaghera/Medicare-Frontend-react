import React, { useState } from "react";
import { Eye, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axiosConfig";

export default function TodayAppointments({ appointments, onStatusChange, onAppointmentsChange, enableStatusEdit = false }) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [detailsModal, setDetailsModal] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!appointments || appointments.length === 0) return null;

    const handleSelectAll = () => {
        if (selectedIds.size === appointments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(appointments.map((apt) => apt.id)));
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

    const handleDeleteAll = async () => {
        if (selectedIds.size === 0) {
            toast.error("Please select appointments to delete");
            return;
        }
        
        if (!window.confirm(`Delete ${selectedIds.size} selected appointment(s)?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const idsToDelete = Array.from(selectedIds);
            console.log("Deleting appointment IDs:", idsToDelete);
            
            await API.delete('/appointments', {
                data: { appointmentIds: idsToDelete }
            });
            
            toast.success(`${selectedIds.size} appointment(s) deleted successfully`);
            setSelectedIds(new Set());
            
            // Refresh appointments list
            if (onAppointmentsChange) {
                onAppointmentsChange();
            }
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to delete appointments");
        } finally {
            setIsDeleting(false);
        }
    };

    const renderStatusControl = (apt) => {
        const colorMap = {
            pending: { bg: "#fef9c3", color: "#a16207" },
            "in-progress": { bg: "#dbeafe", color: "#1d4ed8" },
            completed: { bg: "#dcfce7", color: "#166534" },
            cancelled: { bg: "#fee2e2", color: "#ef4444" }
        };
        const style = colorMap[apt.status] || { bg: "#f3f4f6", color: "#666" };

        // If status is cancelled or no edit permission, show as read-only
        if (!enableStatusEdit || !onStatusChange || apt.status === 'cancelled') {
            return (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ background: style.bg, color: style.color, padding: '6px 12px', borderRadius: '14px', fontWeight: 600, fontSize: 12 }}>{apt.status}</span>
                    {apt.status === 'cancelled' && <span style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>Cannot change</span>}
                </div>
            );
        }

        return (
            <select
                value={apt.status}
                onChange={(e) => onStatusChange(apt.id, e.target.value)}
                disabled={isDeleting}
                style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, background: '#fff', opacity: isDeleting ? 0.6 : 1, cursor: isDeleting ? 'not-allowed' : 'pointer' }}
            >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
        );
    };

    return (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Today's Appointments</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={handleSelectAll}
                        disabled={isDeleting}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            background: selectedIds.size === appointments.length ? "#0fb48c" : "#fff",
                            color: selectedIds.size === appointments.length ? "#fff" : "#333",
                            fontWeight: "600",
                            fontSize: "12px",
                            cursor: isDeleting ? "not-allowed" : "pointer",
                            opacity: isDeleting ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <Check size={14} />
                        {selectedIds.size === appointments.length ? "Deselect All" : "Select All"}
                    </button>
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            disabled={isDeleting}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "6px",
                                background: isDeleting ? "#ef9999" : "#ef4444",
                                color: "#fff",
                                border: "none",
                                fontWeight: "600",
                                fontSize: "12px",
                                cursor: isDeleting ? "not-allowed" : "pointer",
                                opacity: isDeleting ? 0.7 : 1,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }}
                        >
                            <Trash2 size={14} />
                            {isDeleting ? "Deleting..." : `Delete All (${selectedIds.size})`}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {appointments.map((apt, index) => (
                    <div key={apt.id || index} style={{ display: "grid", gridTemplateColumns: "40px 70px 1fr 100px 160px 50px", gap: "12px", alignItems: "center", padding: "16px", border: selectedIds.has(apt.id) ? "2px solid #0fb48c" : apt.status === 'cancelled' ? "2px solid #fee2e2" : "1px solid #f0f0f0", borderRadius: "8px", background: selectedIds.has(apt.id) ? "#f0fdf9" : apt.status === 'cancelled' ? "#fef9f9" : "#fff", opacity: apt.status === 'cancelled' ? 0.7 : 1 }}>
                        <input
                            type="checkbox"
                            checked={selectedIds.has(apt.id)}
                            onChange={() => apt.status !== 'cancelled' && handleSelectItem(apt.id)}
                            disabled={isDeleting || apt.status === 'cancelled'}
                            style={{ cursor: apt.status === 'cancelled' || isDeleting ? "not-allowed" : "pointer", width: "18px", height: "18px", opacity: isDeleting || apt.status === 'cancelled' ? 0.6 : 1 }}
                        />
                        <span style={{ fontSize: "14px", fontWeight: "600", color: apt.status === 'cancelled' ? "#999" : "#333" }}>{apt.time}</span>
                        <div>
                            <h4 style={{ fontSize: "15px", fontWeight: "500", color: apt.status === 'cancelled' ? "#999" : "#333", marginBottom: "4px" }}>{apt.patient}</h4>
                            <p style={{ fontSize: "13px", color: apt.status === 'cancelled' ? "#bbb" : "#888" }}>{apt.doctor}</p>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: apt.status === 'cancelled' ? "#bbb" : "#0fb48c" }}>{apt.token}</span>
                        <div>{renderStatusControl(apt)}</div>
                        <button
                            onClick={() => setDetailsModal(apt)}
                            disabled={isDeleting}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: isDeleting ? "not-allowed" : "pointer",
                                color: apt.status === 'cancelled' ? "#bbb" : "#0fb48c",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isDeleting ? 0.6 : 1
                            }}
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {detailsModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "32px",
                        maxWidth: "500px",
                        width: "90%",
                        maxHeight: "80vh",
                        overflowY: "auto"
                    }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>Appointment Details</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Time</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.time}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Patient</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.patient}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Doctor</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.doctor}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Token</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.token}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Status</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.status}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDetailsModal(null)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: "#0fb48c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
