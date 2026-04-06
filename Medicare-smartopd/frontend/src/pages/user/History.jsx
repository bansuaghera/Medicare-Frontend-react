import UserLayout from "../../layouts/UserLayout";
import { Stethoscope, Calendar, Search, Clock, Hash, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";

export default function History() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user.id) return;
            try {
                const res = await API.get(`/appointments/patient/${user.id}`);
                if (res.data.success) {
                    const allAppointments = res.data.data || [];
                    // Map all appointments as history records
                    const mapped = allAppointments
                        .filter(app => ['completed', 'cancelled'].includes(app.status))
                        .map(app => ({
                        id: app.id,
                        title: app.reason || "General Checkup",
                        doctor: app.Doctor?.name || "Unassigned",
                        date: app.date,
                        time: app.time,
                        token: app.tokenNumber,
                        status: app.status || "pending"
                    }));
                    setHistoryData(mapped);
                }
            } catch (error) {
                console.error("Failed to load history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user.id]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return { bg: '#dcfce7', color: '#166534', label: 'Completed' };
            case 'in-progress': return { bg: '#dbeafe', color: '#1d4ed8', label: 'In Progress' };
            case 'cancelled': return { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' };
            default: return { bg: '#fef9c3', color: '#92400e', label: 'Pending' };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    };

    const filteredHistory = historyData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Visit History</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: '0 0 16px 0' }}>Your complete medical visit history</p>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search by reason, doctor, or status..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading visit history...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {paginatedHistory.length > 0 ? paginatedHistory.map((item) => {
                            const st = getStatusStyle(item.status);
                            return (
                                <div key={item.id} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8fdf5', color: '#0fb48c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Stethoscope size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{item.title}</h3>
                                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>Dr. {item.doctor}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px' }}>
                                                    <Calendar size={14} />
                                                    <span>{formatDate(item.date)}</span>
                                                </div>
                                                {item.time && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px' }}>
                                                        <Clock size={14} />
                                                        <span>{item.time}</span>
                                                    </div>
                                                )}
                                                {item.token && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px' }}>
                                                        <Hash size={14} />
                                                        <span>Token #{item.token}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <span style={{ background: st.bg, color: st.color, padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                                        {st.label}
                                    </span>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
                                <AlertCircle size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                <p style={{ fontSize: '16px', margin: '0 0 6px 0' }}>No visit records found</p>
                                <p style={{ fontSize: '14px', margin: 0 }}>
                                    {searchTerm ? `No results for "${searchTerm}"` : "Your appointment history will appear here"}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', background: currentPage === 1 ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', color: currentPage === 1 ? '#9ca3af' : 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            Previous
                        </button>
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', background: currentPage === totalPages ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', color: currentPage === totalPages ? '#9ca3af' : 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
