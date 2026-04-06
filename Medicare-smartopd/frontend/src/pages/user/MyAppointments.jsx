import { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Search, Trash2, CheckSquare, Square, RefreshCw, XCircle } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function MyAppointments() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchAppointments = async (silent = false) => {
        if (!user.id) return;
        if (!silent) setLoading(true);
        try {
            const res = await API.get(`/appointments/patient/${user.id}`);
            if (res.data.success) {
                const myApts = res.data.data.map(app => ({
                    id: app.id,
                    token: app.tokenNumber,
                    doctor: app.Doctor?.name || "Unassigned",
                    specialty: app.Doctor?.Doctor?.specialization || "General Medicine",
                    date: app.date,
                    time: app.time,
                    reason: app.reason || "Monthly Checkup",
                    status: app.status || "pending",
                    actionable: app.status && app.status !== "cancelled" && app.status !== "completed"
                }));
                // Show active/pending ones mainly or all based on logic
                setAppointments(myApts);
            }
        } catch (error) {
            toast.error("Cloud synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user.id]);

    const handleCancel = async (id) => {
        if (!window.confirm("Abort this medical appointment?")) return;
        const loadToast = toast.loading("Processing cancellation...");
        try {
            await API.put(`/appointments/${id}/status`, { status: 'cancelled' });
            toast.success("Successfully cancelled", { id: loadToast });
            fetchAppointments(true);
        } catch (error) {
            toast.error("Failed to cancel", { id: loadToast });
        }
    };

    const handleSelectToggle = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredAppointments.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredAppointments.map(a => a.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently remove ${selectedIds.length} appointment records? This cannot be undone.`)) return;
        
        try {
            await API.delete("/appointments", { data: { ids: selectedIds } });
            toast.success("Records wiped from vault.");
            setAppointments(appointments.filter(a => !selectedIds.includes(a.id)));
            setSelectedIds([]);
        } catch (error) {
            toast.error("Registry cleanup failed.");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'in-progress': return { bg: '#dbeafe', color: '#1d4ed8', label: 'IN PROGRESS' };
            case 'completed': return { bg: '#ecfdf5', color: '#047857', label: 'COMPLETED' };
            case 'cancelled': return { bg: '#fef2f2', color: '#b91c1c', label: 'CANCELLED' };
            default: return { bg: '#fffbeb', color: '#b45309', label: 'PENDING' };
        }
    };

    const filteredAppointments = appointments.filter(apt => 
        apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UserLayout panelTitle="Digital Health Deck">
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', margin: '0 0 8px 0' }}>Consultation Queue</h1>
                        <p style={{ color: '#667085', fontSize: '16px' }}>Manage your active and upcoming OPD tokens.</p>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                            <div style={{ position: 'relative', width: '400px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }} />
                                <input 
                                    type="text" placeholder="Search by doctor or status..." value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '16px', border: '1px solid #d0d5dd', background: '#f9fafb' }} 
                                />
                            </div>
                            <button onClick={() => fetchAppointments(true)} style={{ background: '#fff', border: '1px solid #eaecf0', padding: '14px', borderRadius: '16px', cursor: 'pointer' }}><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
                        </div>
                        
                        {selectedIds.length > 0 && (
                            <button onClick={handleDeleteSelected} style={{ background: '#fee4e2', color: '#f04438', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Trash2 size={20} /> Wipe Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 8px' }}>
                         <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
                            {selectedIds.length === filteredAppointments.length && filteredAppointments.length > 0 ? <CheckSquare size={22} color="#0fb48c" /> : <Square size={22} color="#eaecf0" />}
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#475467' }}>SELECT ALL RECORDS</span>
                         </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '60px', color: '#667085' }}>Accessing cloud registry...</p>
                        ) : filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                            <div key={apt.id} style={{ 
                                background: selectedIds.includes(apt.id) ? '#f5faff' : '#fff', 
                                borderRadius: '24px', 
                                border: selectedIds.includes(apt.id) ? '1px solid #b2ccff' : '1px solid #eaecf0', 
                                padding: '24px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '20px', 
                                transition: 'all 0.2s'
                            }}>
                                <button onClick={() => handleSelectToggle(apt.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    {selectedIds.includes(apt.id) ? <CheckSquare size={24} color="#0fb48c" /> : <Square size={24} color="#eaecf0" />}
                                </button>

                                <div style={{ background: '#f8fafc', color: '#0fb48c', padding: '12px 20px', borderRadius: '16px', border: '2px solid #0fb48c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '80px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', color: '#64748b' }}>TOKEN</span>
                                    <span style={{ fontSize: '26px', fontWeight: '900' }}>#{apt.token}</span>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#101828', margin: 0 }}>Dr. {apt.doctor}</h3>
                                            <p style={{ fontSize: '14px', color: '#667085', margin: '4px 0 0 0' }}>{apt.specialty} • {apt.reason}</p>
                                        </div>
                                        <span style={{ background: getStatusStyle(apt.status).bg, color: getStatusStyle(apt.status).color, padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900' }}>
                                            {getStatusStyle(apt.status).label}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '32px', marginTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475467' }}>
                                            <Calendar size={18} style={{ color: '#0fb48c' }} />
                                            <span style={{ fontSize: '14px', fontWeight: '800' }}>{apt.date}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475467' }}>
                                            <Clock size={18} style={{ color: '#0fb48c' }} />
                                            <span style={{ fontSize: '14px', fontWeight: '800' }}>{apt.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {apt.actionable && (
                                        <button onClick={() => handleCancel(apt.id)} style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', color: '#b91c1c', border: 'none', cursor: 'pointer' }} title="Cancel Appointment">
                                            <XCircle size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '80px', color: '#667085', border: '2px dashed #eaecf0', borderRadius: '24px' }}>
                                <Calendar size={48} style={{ margin: '0 auto 20px', opacity: 0.2 }} />
                                <p style={{ fontSize: '16px', fontWeight: '700' }}>No appointment entries found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </UserLayout>
    );
}
