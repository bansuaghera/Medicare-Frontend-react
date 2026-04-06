import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, Eye, Clock, AlertCircle, RefreshCw, X, GripVertical, Users, PlayCircle, CheckCircle2 } from "lucide-react";
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
function SortableRow({ apt, onDetails, onEmergency, getStatusStyle }) {
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
        background: isDragging ? "#e2e8f0" : (apt.isEmergency ? '#fef2f2' : 'transparent'),
        borderBottom: '1px solid #f1f5f9',
    };

    const s = getStatusStyle(apt.status);

    return (
        <tr ref={setNodeRef} style={style}>
            <td style={{ padding: '16px' }}>
                <div {...attributes} {...listeners} style={{ cursor: 'grab', color: '#cbd5e1' }}>
                    <GripVertical size={18} />
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
                <span style={{ ...s, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                    {s.label}
                </span>
            </td>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={() => onDetails(apt)} style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="View"><Eye size={16} /></button>
                    <button onClick={() => onEmergency(apt.id, apt.isEmergency)} style={{ border: '1px solid #fee2e2', background: apt.isEmergency ? '#ef4444' : '#fff', color: apt.isEmergency ? '#fff' : '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="Priority"><AlertCircle size={16} /></button>
                </div>
            </td>
        </tr>
    );
}

export default function TokenQueue() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [detailsModal, setDetailsModal] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const fetchAll = async () => {
        try {
            setLoading(true);
            const res = await API.get("/appointments");
            if (res.data.success) setAppointments(res.data.data || []);
        } catch (err) { toast.error("Failed to load queue"); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchAll();
        const inter = setInterval(fetchAll, 30000);
        return () => clearInterval(inter);
    }, []);

    const onDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = appointments.findIndex(a => a.id === active.id);
            const newIndex = appointments.findIndex(a => a.id === over.id);
            const newOrder = arrayMove(appointments, oldIndex, newIndex);
            setAppointments(newOrder.map((a, idx) => ({...a, tokenNumber: idx + 1})));
            try {
                await API.post('/appointments/reorder', { appointmentIds: newOrder.map(a => a.id) });
                toast.success("Queue reordered");
            } catch { toast.error("Failed to sync order"); fetchAll(); }
        }
    };

    const handleUpdateEmergency = async (id, val) => {
        try {
            await API.put(`/appointments/${id}/emergency`, { isEmergency: !val });
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, isEmergency: !val } : a));
            toast.success("Priority updated");
        } catch { toast.error("Failed to update emergency status"); }
    };

    const filtered = appointments.filter(a =>
        (a.Patient?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.Doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`#${a.tokenNumber}`).includes(searchTerm)
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "in-progress": return { background: "#ebf2fc", color: "#4589f5", label: "In Progress" };
            case "completed": return { background: "#e8fdf5", color: "#0fb48c", label: "Completed" };
            default: return { background: "#fff8ed", color: "#f5a445", label: "Waiting" };
        }
    };

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>Live Token Queue</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Monitor and prioritize room entries</p>
                </div>
                <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Queue
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700' }}>TOTAL WAITING</p><h2 style={{ fontSize: '28px', fontWeight: '900', margin: '4px 0 0 0' }}>{appointments.filter(a => a.status === 'pending').length}</h2></div>
                    <div style={{ background: '#fff7ed', color: '#ea580c', padding: '12px', borderRadius: '12px' }}><Clock size={24} /></div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700' }}>IN PROGRESS</p><h2 style={{ fontSize: '28px', fontWeight: '900', margin: '4px 0 0 0' }}>{appointments.filter(a => a.status === 'in-progress').length}</h2></div>
                    <div style={{ background: '#ebf2fc', color: '#4589f5', padding: '12px', borderRadius: '12px' }}><PlayCircle size={24} /></div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '700' }}>COMPLETED</p><h2 style={{ fontSize: '28px', fontWeight: '900', margin: '4px 0 0 0' }}>{appointments.filter(a => a.status === 'completed').length}</h2></div>
                    <div style={{ background: '#e8fdf5', color: '#0fb48c', padding: '12px', borderRadius: '12px' }}><CheckCircle2 size={24} /></div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ position: 'relative', width: '320px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" placeholder="Search live queue..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                    </div>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '16px', width: '50px' }}></th>
                                <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>TOKEN</th>
                                <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>PATIENT</th>
                                <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>DOCTOR</th>
                                <th style={{ padding: '16px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>STATUS</th>
                                <th style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <SortableContext items={filtered.map(a => a.id)} strategy={verticalListSortingStrategy}>
                            <tbody>
                                {filtered.map(apt => (
                                    <SortableRow key={apt.id} apt={apt} onDetails={setDetailsModal} onEmergency={handleUpdateEmergency} getStatusStyle={getStatusStyle} />
                                ))}
                            </tbody>
                        </SortableContext>
                    </table>
                </DndContext>
            </div>

            {detailsModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", maxWidth: "480px", width: "95%" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Token Info</h2>
                            <button onClick={() => setDetailsModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: '20px' }}>
                            <p style={{ fontSize: "14px", color: "#64748b" }}>Token Number</p>
                            <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#0fb48c", margin: 0 }}>#{detailsModal.tokenNumber}</h1>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Patient</label><p style={{ fontWeight: "700" }}>{detailsModal.Patient?.name}</p></div>
                            <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Doctor</label><p style={{ fontWeight: "700" }}>Dr. {detailsModal.Doctor?.name}</p></div>
                            <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Time</label><p style={{ fontWeight: "600" }}>{detailsModal.time}</p></div>
                            <div><label style={{ fontSize: "12px", color: "#94a3b8" }}>Status</label><p style={{ fontWeight: "600", color: getStatusStyle(detailsModal.status).color }}>{getStatusStyle(detailsModal.status).label}</p></div>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
}
