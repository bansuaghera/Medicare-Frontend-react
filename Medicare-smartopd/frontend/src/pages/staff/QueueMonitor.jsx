import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Users, PlayCircle, CheckCircle2, Clock, RefreshCw, AlertCircle, Trash2, CheckSquare, Square, Search, User, UserCheck } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function QueueMonitor() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await API.get("/appointments");
            if (res.data.success) {
                setAppointments(res.data.data || []);
            }
        } catch (err) {
            toast.error("Failed to sync live queue");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(true), 30000); 
        return () => clearInterval(interval);
    }, []);

    const handleSelectToggle = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(a => a.id));

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently remove ${selectedIds.length} tokens from the live queue? This will cancel their appointments.`)) return;
        try {
            await API.delete("/appointments", { data: { appointmentIds: selectedIds } });
            toast.success("Queue cleaned successfully.");
            setAppointments(appointments.filter(a => !selectedIds.includes(a.id)));
            setSelectedIds([]);
        } catch (error) { toast.error("Queue cleanup failed."); }
    };

    const stats = {
        waiting: appointments.filter(a => a.status === 'pending').length,
        inProgress: appointments.filter(a => a.status === 'in-progress').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        total: appointments.length
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "in-progress": return { bg: "#ebf2fc", color: "#4589f5", label: "In Progress" };
            case "completed": return { bg: "#e8fdf5", color: "#0fb48c", label: "Completed" };
            case "cancelled": return { bg: "#fee2e2", color: "#ef4444", label: "Cancelled" };
            default: return { bg: "#fff8ed", color: "#f5a445", label: "Waiting" };
        }
    };

    const filtered = appointments.filter(a =>
        (a.Patient?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`#${a.tokenNumber}`).includes(searchTerm)
    );

    return (
        <StaffLayout panelTitle="Staff Operations Center">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', marginBottom: '4px' }}>Live Queue Stream</h1>
                        <p style={{ color: '#667085', fontSize: '16px' }}>Real-time clinic throughput and patient flow analytics.</p>
                    </div>
                </div>

                {/* STATS CONTROL TOWER */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
                    {[
                        { label: 'WAITING', val: stats.waiting, icon: <Clock size={24} />, color: '#f5a445', bg: '#fff7ed' },
                        { label: 'CONSULTING', val: stats.inProgress, icon: <PlayCircle size={24} />, color: '#4589f5', bg: '#ebf2fc' },
                        { label: 'FINISHED', val: stats.completed, icon: <CheckCircle2 size={24} />, color: '#0fb48c', bg: '#e8fdf5' },
                        { label: 'TOTAL LOAD', val: stats.total, icon: <Users size={24} />, color: '#1e293b', bg: '#f8fafc' }
                    ].map((s, i) => (
                        <div key={i} style={{ background: "#fff", padding: "28px", borderRadius: "24px", border: '1px solid #eaecf0', display: 'flex', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
                            <div><p style={{ color: "#667085", fontSize: "14px", fontWeight: "800", marginBottom: "8px" }}>{s.label}</p><h3 style={{ fontSize: "36px", fontWeight: "950", color: s.color, margin: 0 }}>{s.val}</h3></div>
                            <div style={{ background: s.bg, color: s.color, padding: '14px', borderRadius: '16px', height: 'fit-content' }}>{s.icon}</div>
                        </div>
                    ))}
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid #eaecf0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                            <div style={{ position: 'relative', width: '380px' }}>
                                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input type="text" placeholder="Search by Token or Name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 52px', borderRadius: '18px', border: '1px solid #d0d5dd', background: '#f9fafb', outline: 'none' }} />
                            </div>
                            <button onClick={fetchData} style={{ background: '#fff', border: '1px solid #eaecf0', padding: '14px', borderRadius: '18px', cursor: 'pointer' }}><RefreshCw size={22} className={loading ? 'animate-spin' : ''} /></button>
                        </div>
                        {selectedIds.length > 0 && (
                            <button onClick={handleDeleteSelected} style={{ background: '#fee4e2', color: '#f04438', border: 'none', padding: '14px 28px', borderRadius: '18px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Trash2 size={20}/> Wipe Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '0 8px' }}>
                         <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
                            {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={24} color="#0fb48c" /> : <Square size={24} color="#eaecf0" />}
                            <span style={{ fontSize: '13px', fontWeight: '900', color: '#475467' }}>SELECT ALL LIVE ENTRIES</span>
                         </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '60px' }}>Synchronizing token data...</p>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
                                <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                <p style={{ fontSize: '16px', fontWeight: '700' }}>No active patients matching your search.</p>
                            </div>
                        ) : filtered.map((item) => {
                            const style = getStatusStyle(item.status);
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <div key={item.id} style={{ 
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px', 
                                    border: isSelected ? '1px solid #b2ccff' : '1px solid #f1f5f9', 
                                    borderRadius: '24px', 
                                    background: isSelected ? '#f5faff' : (item.isEmergency ? '#fef2f2' : '#fff'), 
                                    transition: '0.2s', boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' 
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <button onClick={() => handleSelectToggle(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                            {isSelected ? <CheckSquare size={28} color="#0fb48c" /> : <Square size={28} color="#eaecf0" />}
                                        </button>
                                        <div style={{ background: '#f8fafc', color: '#0fb48c', padding: '16px 24px', borderRadius: '18px', textAlign: 'center', border: '2px solid #0fb48c' }}>
                                            <div style={{ fontSize: '10px', fontWeight: '900', color: '#64748b' }}>TOKEN</div>
                                            <div style={{ fontSize: '24px', fontWeight: '950' }}>#{item.tokenNumber}</div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '20px', fontWeight: '900', color: '#101828', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {item.Patient?.name}
                                                {item.isEmergency && <span style={{ background: '#f04438', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>High Priority</span>}
                                            </h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667085', fontSize: '14px', fontWeight: '600' }}>
                                                <User size={14}/> <span>Dr. {item.Doctor?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Visit Time</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: '900', color: '#101828' }}><Clock size={16} color="#0fb48c"/> {item.time || "—"}</div>
                                        </div>
                                        <div style={{ minWidth: '140px', textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '13px', fontWeight: '950', padding: '10px 20px', borderRadius: '24px', 
                                                textTransform: 'uppercase', background: style.bg, color: style.color, border: `1px solid ${style.color}33`, letterSpacing: '0.5px'
                                            }}>
                                                {style.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginTop: '40px', padding: '40px', background: '#f9fafb', borderRadius: '32px', border: '1px solid #eaecf0', display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <UserCheck size={40} color="#0fb48c" />
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>Active Queue Stewardship</h4>
                        <p style={{ margin: 0, fontSize: '15px', color: '#475467', fontWeight: '600', lineHeight: 1.6 }}>
                            Bulk management allows for rapid clinical adjustments. Use the "Select All" toggle to clear historical entries or re-prioritize the room entries during peak volumes.
                        </p>
                    </div>
                </div>
            </div>
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </StaffLayout>
    );
}
