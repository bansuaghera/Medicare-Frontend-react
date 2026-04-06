import React, { useState } from "react";
import { UserCircle2, Eye, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axiosConfig";

export default function UserUpcomingAppointments({ appointments, onAppointmentsChange }) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [detailsModal, setDetailsModal] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!appointments || appointments.length === 0) return null;

    const handleSelectAll = () => {
        if (selectedIds.size === appointments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(appointments.map((_, index) => index)));
        }
    };

    const handleSelectItem = (index) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
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
            const appointmentIdsToDelete = Array.from(selectedIds).map(index => appointments[index].id);
            console.log("Deleting appointment IDs:", appointmentIdsToDelete);
            
            await API.delete('/appointments', {
                data: { appointmentIds: appointmentIdsToDelete }
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
        <div style={{ background: 'var(--bg-secondary, #fff)', borderRadius: '20px', border: '1px solid var(--border-color, #e5e7eb)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary, #111827)', margin: 0 }}>Upcoming Appointments</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={handleSelectAll}
                        disabled={isDeleting}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-color)",
                            background: selectedIds.size === appointments.length ? "var(--pill-purple-text)" : "var(--bg-secondary)",
                            color: selectedIds.size === appointments.length ? "#fff" : "var(--text-primary)",
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
                                borderRadius: "8px",
                                background: isDeleting ? "#fca5a5" : "#ef4444",
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
                            {isDeleting ? "Deleting..." : `Cancel Selected (${selectedIds.size})`}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {appointments.map((apt, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px',
                            background: selectedIds.has(index) ? 'var(--pill-purple-bg)' : 'var(--bg-primary)',
                            borderRadius: '16px',
                            border: selectedIds.has(index) ? '2px solid var(--pill-purple-text)' : '1px solid var(--border-color)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={selectedIds.has(index)}
                            onChange={() => handleSelectItem(index)}
                            disabled={isDeleting}
                            style={{
                                cursor: isDeleting ? "not-allowed" : "pointer",
                                width: "18px",
                                height: "18px",
                                marginRight: "12px",
                                opacity: isDeleting ? 0.6 : 1,
                                accentColor: '#0fb48c'
                            }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--pill-success-bg)', color: 'var(--pill-success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UserCircle2 size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>{apt.doctor}</h4>
                                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{apt.specialty}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{apt.date}</p>
                                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{apt.time}</p>
                            </div>
                            <button
                                onClick={() => setDetailsModal(apt)}
                                disabled={isDeleting}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: isDeleting ? "not-allowed" : "pointer",
                                    color: "#a855f7",
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
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Doctor</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.doctor}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Specialty</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.specialty}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Date</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.date}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", display: "block", marginBottom: "4px" }}>Time</label>
                                <p style={{ fontSize: "14px", color: "#333" }}>{detailsModal.time}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDetailsModal(null)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: "#a855f7",
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
