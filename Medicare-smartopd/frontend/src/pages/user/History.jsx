import UserLayout from "../../layouts/UserLayout";
import { Stethoscope, Calendar, Search, Clock, Hash, AlertCircle, Trash2, CheckSquare, Square, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function History() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const itemsPerPage = 8;

    const fetchHistory = async (silent = false) => {
        if (!user.id) return;
        if (!silent) setLoading(true);
        try {
            const res = await API.get(`/appointments/patient/${user.id}`);
            if (res.data.success) {
                const mapped = (res.data.data || [])
                    .filter(app => ['completed', 'cancelled'].includes(app.status))
                    .map(app => ({
                        id: app.id,
                        title: app.reason || "Clinical Review",
                        doctor: app.Doctor?.name || "Clinic Staff",
                        date: app.date,
                        time: app.time,
                        token: app.tokenNumber,
                        status: app.status
                    }));
                setHistoryData(mapped);
            }
        } catch (error) {
            toast.error("Failed to sync History.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user.id]);

    const handleSelectToggle = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(selectedIds.length === filteredHistory.length ? [] : filteredHistory.map(r => r.id));

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Wipe ${selectedIds.length} historical records? This is permanent.`)) return;
        try {
            await API.delete("/appointments", { data: { ids: selectedIds } });
            toast.success("History vault cleaned.");
            setHistoryData(historyData.filter(h => !selectedIds.includes(h.id)));
            setSelectedIds([]);
        } catch (error) { toast.error("Historical deletion failed."); }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return { bg: '#ecfdf5', color: '#047857', label: 'COMPLETED' };
            case 'cancelled': return { bg: '#fef2f2', color: '#b91c1c', label: 'CANCELLED' };
            default: return { bg: '#f9fafb', color: '#667085', label: status.toUpperCase() };
        }
    };

    const filteredHistory = historyData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    return (
        <UserLayout panelTitle="Clinical Life Cycle">
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', margin: '0 0 8px 0' }}>Visit Archives</h1>
                    <p style={{ color: '#667085', fontSize: '16px' }}>Your medical journey record through MediCare.</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                            <div style={{ position: 'relative', width: '380px' }}>
                                <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }} />
                                <input type="text" placeholder="Filter medical history..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '16px', border: '1px solid #d0d5dd', background: '#f9fafb', outline: 'none' }} />
                            </div>
                            <button onClick={() => fetchHistory(true)} style={{ background: '#fff', border: '1px solid #eaecf0', padding: '14px', borderRadius: '16px', cursor: 'pointer' }}><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
                        </div>
                        {selectedIds.length > 0 && <button onClick={handleDeleteSelected} style={{ background: '#fee4e2', color: '#f04438', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer' }}>Wipe Selected ({selectedIds.length})</button>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 8px' }}>
                         <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
                            {selectedIds.length === filteredHistory.length && filteredHistory.length > 0 ? <CheckSquare size={22} color="#0fb48c" /> : <Square size={22} color="#eaecf0" />}
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#475467' }}>SELECT ALL ARCHIVES</span>
                         </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '40px' }}>Accessing medical shards...</p>
                        ) : paginatedHistory.length > 0 ? paginatedHistory.map((item) => (
                            <div key={item.id} style={{ background: selectedIds.includes(item.id) ? '#f5faff' : '#f9fafb', border: selectedIds.includes(item.id) ? '1px solid #b2ccff' : '1px solid #eaecf0', padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px', transition: '0.2s' }}>
                                <button onClick={() => handleSelectToggle(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    {selectedIds.includes(item.id) ? <CheckSquare size={24} color="#0fb48c" /> : <Square size={24} color="#eaecf0" />}
                                </button>
                                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#ecfdf3', color: '#0fb48c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Stethoscope size={24}/></div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#101828' }}>{item.title}</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#667085' }}>Dr. {item.doctor}</p>
                                    <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#667085', fontWeight: '700' }}><Calendar size={14} />{item.date}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#667085', fontWeight: '700' }}><Clock size={14} />{item.time}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#667085', fontWeight: '700' }}><Hash size={14} />Token #{item.token}</div>
                                    </div>
                                </div>
                                <span style={{ background: getStatusStyle(item.status).bg, color: getStatusStyle(item.status).color, padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900' }}>{getStatusStyle(item.status).label}</span>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '80px', color: '#667085' }}>No visit archives found.</div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </UserLayout>
    );
}
