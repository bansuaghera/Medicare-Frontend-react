import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Plus, Search, Eye, Trash2, Edit3, CheckCircle, Clock, AlertCircle, RefreshCw, X, Calendar, GripVertical, Users, PlayCircle, CheckCircle2 } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

// Dnd Kit Imports
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component ---
function SortableRow({ apt, isSelected, onSelect, onDetails, onEdit, onEmergency, onDelete, onStatusUpdate, getStatusStyle }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: apt.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? "#e2e8f0" : (apt.isEmergency ? '#fef2f2' : (isSelected ? '#f0f9ff' : 'transparent')),
        borderBottom: '1px solid #f1f5f9',
    };

    const s = getStatusStyle(apt.status);

    return (
        <tr ref={setNodeRef} style={style}>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div {...attributes} {...listeners} style={{ cursor: 'grab', color: '#cbd5e1' }}>
                        <GripVertical size={18} />
                    </div>
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => onSelect(apt.id)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </td>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0fb48c' }}>#{apt.tokenNumber}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{apt.time}</span>
                </div>
            </td>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{apt.Patient?.name}</span>
                        {apt.isEmergency && <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' }}>Emergency</span>}
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{apt.reason || "General Checkup"}</span>
                </div>
            </td>
            <td style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Dr. {apt.Doctor?.name}</td>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ ...s, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>
                        {s.label}
                    </span>
                    {apt.status === "in-progress" && (
                        <button 
                            onClick={() => onStatusUpdate(apt.id, "completed")}
                            style={{ border: 'none', background: '#0fb48c', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Mark Finished
                        </button>
                    )}
                    {apt.status === "pending" && (
                        <button 
                            onClick={() => onStatusUpdate(apt.id, "in-progress")}
                            style={{ border: 'none', background: '#4589f5', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Accept Patient
                        </button>
                    )}
                </div>
            </td>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={() => onDetails(apt)} style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="View"><Eye size={16} /></button>
                    <button onClick={() => onEdit(apt)} style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#4589f5', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="Edit"><Edit3 size={16} /></button>
                    <button onClick={() => onEmergency(apt.id, apt.isEmergency)} style={{ border: '1px solid #fee2e2', background: apt.isEmergency ? '#ef4444' : '#fff', color: apt.isEmergency ? '#fff' : '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="Priority"><AlertCircle size={16} /></button>
                    <button onClick={() => onDelete(apt.id)} style={{ border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                </div>
            </td>
        </tr>
    );
}

// --- Main Component ---
export default function GenerateToken() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [detailsModal, setDetailsModal] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [tab, setTab] = useState("list"); // "list" | "book"

    const [form, setForm] = useState({
        patientId: "",
        doctorId: "",
        date: new Date().toISOString().split("T")[0],
        time: "",
        reason: "",
        isEmergency: false
    });

    // Sensors for Dnd
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [apptRes, patientsRes, doctorsRes] = await Promise.all([
                API.get("/appointments"),
                API.get("/users/patients"),
                API.get("/users/doctors")
            ]);
            
            if (apptRes.data.success) {
                // When we fetch, we keep the order from backend
                setAppointments(apptRes.data.data || []);
            }
            if (patientsRes.data.success) setPatients(patientsRes.data.data);
            if (doctorsRes.data.success) setDoctors(doctorsRes.data.data);
        } catch (err) {
            toast.error("Failed to load queue data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!form.patientId || !form.doctorId || !form.time) {
            toast.error("Please fill all required fields");
            return;
        }
        const loadToast = toast.loading("Generating token...");
        try {
            const res = await API.post("/appointments/book", form);
            if (res.data.success) {
                toast.success(`Token #${res.data.token} generated!`, { id: loadToast });
                setForm({ patientId: "", doctorId: "", date: new Date().toISOString().split("T")[0], time: "", reason: "", isEmergency: false });
                setTab("list");
                fetchAll();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Generation failed", { id: loadToast });
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

    const handleUpdateToken = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Updating token...");
        try {
            await API.put(`/appointments/${editModal.id}`, editModal);
            toast.success("Token updated successfully", { id: loadToast });
            setEditModal(null);
            fetchAll();
        } catch (err) {
            toast.error("Update failed", { id: loadToast });
        }
    };

    const handleUpdateEmergency = async (id, currentVal) => {
        try {
            await API.put(`/appointments/${id}/emergency`, { isEmergency: !currentVal });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, isEmergency: !currentVal } : a));
            toast.success("Priority updated");
        } catch {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this token?")) return;
        try {
            await API.delete(`/appointments/${id}`);
            setAppointments(prev => prev.filter(a => a.id !== id));
            toast.success("Deleted");
        } catch {
            toast.error("Error deleting");
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!window.confirm(`Delete ${selectedIds.size} tokens?`)) return;
        try {
            await API.delete("/appointments", { data: { appointmentIds: Array.from(selectedIds) } });
            setAppointments(prev => prev.filter(a => !selectedIds.has(a.id)));
            setSelectedIds(new Set());
            toast.success("Deleted");
        } catch {
            toast.error("Error deleting");
        }
    };

    const onDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = appointments.findIndex(a => a.id === active.id);
            const newIndex = appointments.findIndex(a => a.id === over.id);
            
            const newOrder = arrayMove(appointments, oldIndex, newIndex);
            
            // Optimistic Update
            // Update token numbers in frontend locally to feel fast
            const optimisticUpdate = newOrder.map((a, idx) => ({
                ...a,
                tokenNumber: idx + 1
            }));
            setAppointments(optimisticUpdate);

            // Sync with backend
            try {
                await API.post('/appointments/reorder', {
                    appointmentIds: newOrder.map(a => a.id)
                });
                toast.success("Queue reordered");
            } catch (err) {
                toast.error("Failed to sync new order");
                fetchAll(); // Rollback
            }
        }
    };

    const filtered = appointments.filter(a =>
        (a.Patient?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.Doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`#${a.tokenNumber}`).includes(searchTerm)
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "in-progress": return { background: "#ebf2fc", color: "#4589f5", border: '1px solid #bfdbfe', label: "In Progress" };
            case "completed": return { background: "#e8fdf5", color: "#0fb48c", border: '1px solid #b2efdb', label: "Completed" };
            case "cancelled": return { background: "#fee2e2", color: "#ef4444", border: '1px solid #fecaca', label: "Cancelled" };
            default: return { background: "#fff8ed", color: "#f5a445", border: '1px solid #fde68a', label: "Waiting" };
        }
    };

    return (
        <StaffLayout panelTitle="Staff Panel">
            {/* Header omitted for brevity in thought, but full code below */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>Token Management</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Drag & Drop to re-prioritize live queue</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button onClick={() => setTab(tab === "list" ? "book" : "list")} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #0fb48c, #0d9488)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                        {tab === "list" ? <><Plus size={18} /> Generate Token</> : <><Calendar size={18} /> View Queue</>}
                    </button>
                </div>
            </div>

            {/* Combined Queue Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>WAITING</p><h3 style={{ fontSize: "24px", fontWeight: "800", color: '#f5a445' }}>{appointments.filter(a => a.status === 'pending').length}</h3></div>
                    <div style={{ background: '#fff7ed', color: '#f5a445', padding: '10px', borderRadius: '12px' }}><Clock size={20} /></div>
                </div>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>IN PROGRESS</p><h3 style={{ fontSize: "24px", fontWeight: "800", color: '#4589f5' }}>{appointments.filter(a => a.status === 'in-progress').length}</h3></div>
                    <div style={{ background: '#ebf2fc', color: '#4589f5', padding: '10px', borderRadius: '12px' }}><PlayCircle size={20} /></div>
                </div>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>COMPLETED</p><h3 style={{ fontSize: "24px", fontWeight: "800", color: '#0fb48c' }}>{appointments.filter(a => a.status === 'completed').length}</h3></div>
                    <div style={{ background: '#e8fdf5', color: '#0fb48c', padding: '10px', borderRadius: '12px' }}><CheckCircle2 size={20} /></div>
                </div>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>TOTAL TODAY</p><h3 style={{ fontSize: "24px", fontWeight: "800", color: '#1e293b' }}>{appointments.length}</h3></div>
                    <div style={{ background: '#f8fafc', color: '#1e293b', padding: '10px', borderRadius: '12px' }}><Users size={20} /></div>
                </div>
            </div>

            {tab === "book" ? (
                <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '32px' }}>Issue New Token</h2>
                    <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Patient *</label>
                                <select value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} required>
                                    <option value="">Choose patient</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Doctor *</label>
                                <select value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} required>
                                    <option value="">Choose doctor</option>
                                    {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Time *</label>
                                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Emergency?</label>
                                <div onClick={() => setForm(f => ({ ...f, isEmergency: !f.isEmergency }))} style={{ flex: 1, border: `1px solid ${form.isEmergency ? '#ef4444' : '#e2e8f0'}`, background: form.isEmergency ? '#fef2f2' : '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <AlertCircle size={16} color={form.isEmergency ? "#ef4444" : "#94a3b8"} />
                                    <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: '600', color: form.isEmergency ? '#ef4444' : '#64748b' }}>Emergency Priority</span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" style={{ background: 'linear-gradient(135deg, #0fb48c, #0d9488)', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Generate Active Token</button>
                    </form>
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ position: 'relative', width: '320px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input type="text" placeholder="Search tokens..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                        </div>
                        {selectedIds.size > 0 && (
                            <button onClick={handleDeleteSelected} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', padding: '10px 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Delete Selected ({selectedIds.size})</button>
                        )}
                    </div>

                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <tr>
                                    <th style={{ padding: '16px', width: '60px' }}>
                                        <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={(e) => e.target.checked ? setSelectedIds(new Set(filtered.map(a => a.id))) : setSelectedIds(new Set())} />
                                    </th>
                                    <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>TOKEN / TIME</th>
                                    <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>PATIENT</th>
                                    <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>DOCTOR</th>
                                    <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>STATUS</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <SortableContext 
                                items={filtered.map(a => a.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <tbody>
                                    {filtered.map(apt => (
                                        <SortableRow 
                                            key={apt.id} 
                                            apt={apt} 
                                            isSelected={selectedIds.has(apt.id)}
                                            onSelect={(id) => {
                                                const next = new Set(selectedIds);
                                                next.has(id) ? next.delete(id) : next.add(id);
                                                setSelectedIds(next);
                                            }}
                                            onDetails={setDetailsModal}
                                            onEdit={setEditModal}
                                            onEmergency={handleUpdateEmergency}
                                            onDelete={handleDelete}
                                            onStatusUpdate={handleUpdateStatus}
                                            getStatusStyle={getStatusStyle}
                                        />
                                    ))}
                                </tbody>
                            </SortableContext>
                        </table>
                    </DndContext>
                </div>
            )}

            {/* Edit / Details Modals Omitted for brevity, but exist in full code */}
            {editModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", maxWidth: "480px", width: "90%" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Edit Token #{editModal.tokenNumber}</h2>
                        <form onSubmit={handleUpdateToken} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Doctor</label>
                                <select value={editModal.doctorId} onChange={e => setEditModal(m => ({ ...m, doctorId: e.target.value }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                    {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Time</label>
                                <input type="time" value={editModal.time} onChange={e => setEditModal(m => ({ ...m, time: e.target.value }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600' }}>Reason</label>
                                <input type="text" value={editModal.reason} onChange={e => setEditModal(m => ({ ...m, reason: e.target.value }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, background: '#0fb48c', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700' }}>Save Changes</button>
                                <button type="button" onClick={() => setEditModal(null)} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '600' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
             {detailsModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", maxWidth: "480px", width: "90%" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Token Details</h2>
                            <button onClick={() => setDetailsModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                             <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                                <p style={{ fontSize: "14px", color: "#64748b" }}>Token Number</p>
                                <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#0fb48c", margin: 0 }}>#{detailsModal.tokenNumber}</h1>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Patient</label><p style={{ fontWeight: "700" }}>{detailsModal.Patient?.name}</p></div>
                                <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Doctor</label><p style={{ fontWeight: "700" }}>Dr. {detailsModal.Doctor?.name}</p></div>
                                <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Schedule</label><p style={{ fontWeight: "600" }}>{detailsModal.time}</p></div>
                                <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Status</label><p style={{ fontWeight: "600", color: getStatusStyle(detailsModal.status).color }}>{getStatusStyle(detailsModal.status).label}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
