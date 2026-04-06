import React, { useState } from "react";
import { Eye, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axiosConfig";

export default function DoctorAppointmentsList({ appointments, onAppointmentsChange }) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [detailsModal, setDetailsModal] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!appointments || appointments.length === 0) return null;

    const handleSelectAll = () => {
        if (selectedIds.size === appointments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(appointments.map((apt) => apt.id || appointments.indexOf(apt))));
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
            const idsToDelete = Array.from(selectedIds).map(index => appointments[index].id);
            console.log("Deleting appointment IDs:", idsToDelete);
            
            await API.delete('/appointments', {
                data: { appointmentIds: idsToDelete }
            });
            
            toast.success(`${selectedIds.size} appointment(s) deleted successfully`);
            setSelectedIds(new Set());
            
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

    return (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", height: "fit-content" }}>
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
                            background: selectedIds.size === appointments.length ? "#4589f5" : "#fff",
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
                {appointments.map((apt, index) => {
                    let statusColor = "#666";
                    let statusBg = "#f5f5f5";
                    const aptId = apt.id || index;

                    if (apt.status === "Cancelled" || apt.status === "cancelled") { statusColor = "#ef4444"; statusBg = "#fee2e2"; }
                    else if (apt.status === "in-progress" || apt.status === "In Progress") { statusColor = "#4589f5"; statusBg = "#ebf2fc"; }
                    else if (apt.status === "completed" || apt.status === "Completed") { statusColor = "#0fb48c"; statusBg = "#e8fdf5"; }
                    else { statusColor = "#f5a445"; statusBg = "#fff8ed"; }

                    const isCancelled = apt.status === "Cancelled" || apt.status === "cancelled";

                    return (
                        <div
                            key={index}
                            style={{
                                border: selectedIds.has(aptId) && !isCancelled ? "2px solid #4589f5" : isCancelled ? "2px solid #fee2e2" : "1px solid #f0f0f0",
                                borderRadius: "8px",
                                padding: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: selectedIds.has(aptId) && !isCancelled ? "#ebf2fc" : isCancelled ? "#fef9f9" : "#fff",
                                opacity: isCancelled ? 0.7 : 1
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.has(aptId)}
                                onChange={() => !isCancelled && handleSelectItem(aptId)}
                                disabled={isDeleting || isCancelled}
                                style={{ cursor: isCancelled || isDeleting ? "not-allowed" : "pointer", width: "18px", height: "18px", marginRight: "12px", opacity: isDeleting ? 0.6 : 1 }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                                <div style={{ fontSize: "13px", fontWeight: "600", color: isCancelled ? "#999" : "#444" }}>{apt.time}</div>
                                <div style={{ fontSize: "15px", fontWeight: "600", color: isCancelled ? "#999" : "#222" }}>
                                    {apt.patient}
                                    {apt.isEmergency && <span style={{ marginLeft: "8px", background: "#fef2f2", color: "#ef4444", padding: "2px 8px", borderRadius: "10px", fontSize: "9px", fontWeight: "800", textTransform: "uppercase" }}>Emergency</span>}
                                </div>
                                <div style={{ fontSize: "12px", color: isCancelled ? "#bbb" : "#888" }}>{apt.type} • Token: {apt.token}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                    <span
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "16px",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            background: statusBg,
                                            color: statusColor
                                        }}
                                    >
                                        {apt.status}
                                    </span>
                                    {isCancelled && <span style={{ fontSize: "11px", color: "#ef4444", fontStyle: "italic", fontWeight: "500" }}>Cannot change</span>}
                                </div>
                                <button
                                    onClick={() => setDetailsModal(apt)}
                                    disabled={isDeleting}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: isDeleting ? "not-allowed" : "pointer",
                                        color: isCancelled ? "#bbb" : "#4589f5",
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
                        </div>
                    );
                })}
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
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Type</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.type}</p>
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
                                background: "#4589f5",
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
