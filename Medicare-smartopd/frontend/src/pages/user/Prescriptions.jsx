import UserLayout from "../../layouts/UserLayout";
import { Search, Eye, X, Pill, Calendar, Stethoscope, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";

export default function Prescriptions() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewingRx, setViewingRx] = useState(null);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user.id) return;
            try {
                const res = await API.get(`/prescriptions/patient/${user.id}`);
                if (res.data.success) {
                    setPrescriptions(res.data.data || []);
                }
            } catch (error) {
                console.error("Failed to load prescriptions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, [user.id]);

    const filteredPrescriptions = prescriptions.filter(rx =>
        (rx.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rx.doctorName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
    const paginatedPrescriptions = filteredPrescriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>My Prescriptions</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>View your prescription history</p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search by diagnosis or doctor..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '14px' }}
                            />
                        </div>
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                            {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading prescriptions...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '16px 24px' }}>Date</th>
                                        <th style={{ padding: '16px 24px' }}>Doctor</th>
                                        <th style={{ padding: '16px 24px' }}>Diagnosis</th>
                                        <th style={{ padding: '16px 24px' }}>Medicines</th>
                                        <th style={{ padding: '16px 24px' }}>Follow-Up</th>
                                        <th style={{ padding: '16px 24px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedPrescriptions.length > 0 ? paginatedPrescriptions.map((rx) => (
                                        <tr key={rx.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                                            <td style={{ padding: '16px 24px' }}>{formatDate(rx.Appointment?.date || rx.createdAt)}</td>
                                            <td style={{ padding: '16px 24px' }}>Dr. {rx.doctorName}</td>
                                            <td style={{ padding: '16px 24px' }}>{rx.diagnosis}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                                    {Array.isArray(rx.medicines) ? rx.medicines.length : 0} meds
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>{rx.nextFollowUp ? formatDate(rx.nextFollowUp) : "—"}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <button
                                                    onClick={() => setViewingRx(rx)}
                                                    style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}
                                                >
                                                    <Eye size={16} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                <FileText size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                                <p style={{ margin: 0 }}>No prescriptions found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            <span>Showing {paginatedPrescriptions.length} of {filteredPrescriptions.length} results</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', background: currentPage === 1 ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', color: currentPage === 1 ? '#9ca3af' : 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    Previous
                                </button>
                                <span style={{ padding: '8px 12px', fontSize: '14px' }}>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', background: currentPage === totalPages ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', color: currentPage === totalPages ? '#9ca3af' : 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* View Prescription Modal */}
            {viewingRx && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setViewingRx(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>

                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>Prescription Details</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>{formatDate(viewingRx.Appointment?.date || viewingRx.createdAt)}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px' }}>
                                <Stethoscope size={18} style={{ color: '#6366f1' }} />
                                <div>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Doctor</p>
                                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Dr. {viewingRx.doctorName}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px' }}>
                                <FileText size={18} style={{ color: '#f59e0b' }} />
                                <div>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Diagnosis</p>
                                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{viewingRx.diagnosis}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vitals */}
                        {viewingRx.vitals && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vitals</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {Object.entries(viewingRx.vitals).map(([key, val]) => (
                                        <div key={key} style={{ background: '#f0fdf4', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0', textTransform: 'uppercase' }}>{key}</p>
                                            <p style={{ fontSize: '16px', fontWeight: '700', color: '#166534', margin: 0 }}>{val}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Medicines */}
                        {Array.isArray(viewingRx.medicines) && viewingRx.medicines.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medicines</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {viewingRx.medicines.map((med, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#fefce8', borderRadius: '10px', border: '1px solid #fef08a' }}>
                                            <Pill size={16} style={{ color: '#a16207' }} />
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{med.name}</p>
                                                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{med.dosage} • {med.frequency} • {med.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Advice */}
                        {viewingRx.advice && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Advice</h3>
                                <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: 0, padding: '12px', background: '#f1f5f9', borderRadius: '10px' }}>{viewingRx.advice}</p>
                            </div>
                        )}

                        {/* Follow-up */}
                        {viewingRx.nextFollowUp && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                                <Calendar size={18} style={{ color: '#2563eb' }} />
                                <div>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Next Follow-Up</p>
                                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1d4ed8', margin: 0 }}>{formatDate(viewingRx.nextFollowUp)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
