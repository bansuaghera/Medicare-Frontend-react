import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Users, PlayCircle, CheckCircle2, Clock, RefreshCw, AlertCircle } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function QueueMonitor() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
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
        const interval = setInterval(fetchData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

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

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>Live Queue Monitor</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Real-time clinic throughput overview</p>
                </div>
                <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Now
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Waiting</p><h3 style={{ fontSize: "32px", fontWeight: "800", color: '#f5a445' }}>{stats.waiting}</h3></div>
                    <div style={{ background: '#fff7ed', color: '#f5a445', padding: '12px', borderRadius: '12px', height: 'fit-content' }}><Clock size={24} /></div>
                </div>
                <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>In Progress</p><h3 style={{ fontSize: "32px", fontWeight: "800", color: '#4589f5' }}>{stats.inProgress}</h3></div>
                    <div style={{ background: '#ebf2fc', color: '#4589f5', padding: '12px', borderRadius: '12px', height: 'fit-content' }}><PlayCircle size={24} /></div>
                </div>
                <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Completed</p><h3 style={{ fontSize: "32px", fontWeight: "800", color: '#0fb48c' }}>{stats.completed}</h3></div>
                    <div style={{ background: '#e8fdf5', color: '#0fb48c', padding: '12px', borderRadius: '12px', height: 'fit-content' }}><CheckCircle2 size={24} /></div>
                </div>
                <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Total Today</p><h3 style={{ fontSize: "32px", fontWeight: "800", color: '#1e293b' }}>{stats.total}</h3></div>
                    <div style={{ background: '#f8fafc', color: '#1e293b', padding: '12px', borderRadius: '12px', height: 'fit-content' }}><Users size={24} /></div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>Live Patient Flow</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {appointments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                            <AlertCircle size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <p>No active patients in the queue right now.</p>
                        </div>
                    ) : appointments.map((item) => {
                        const style = getStatusStyle(item.status);
                        return (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', border: '1px solid #f1f5f9', borderRadius: '16px', background: item.isEmergency ? '#fef2f2' : '#fff', transition: 'transform 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ background: '#f8fafc', color: '#0fb48c', padding: '12px 16px', borderRadius: '12px', textAlign: 'center', border: '2px solid #0fb48c' }}>
                                        <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b' }}>TOKEN</div>
                                        <div style={{ fontSize: '20px', fontWeight: '900' }}>#{item.tokenNumber}</div>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {item.Patient?.name}
                                            {item.isEmergency && <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase' }}>Emergency</span>}
                                        </h4>
                                        <p style={{ fontSize: '14px', color: '#64748b' }}>Assigned to Dr. {item.Doctor?.name}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Visit Time</p>
                                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{item.time || "—"}</span>
                                    </div>
                                    <div style={{ minWidth: '120px', textAlign: 'right' }}>
                                        <span style={{
                                            fontSize: '13px',
                                            fontWeight: '800',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            textTransform: 'uppercase',
                                            background: style.bg,
                                            color: style.color,
                                            border: `1px solid ${style.color}33`
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
        </StaffLayout>
    );
}
