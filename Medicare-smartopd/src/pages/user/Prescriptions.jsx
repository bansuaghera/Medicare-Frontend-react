import UserLayout from "../../layouts/UserLayout";
import { Search, Eye, Download } from "lucide-react";
import { useState } from "react";

export default function Prescriptions() {
    const prescriptions = [
        { date: "2024-02-12", doctor: "Dr. Sarah Johnson", diagnosis: "Hypertension", medicines: "3" },
        { date: "2024-02-11", doctor: "Dr. Michael Chen", diagnosis: "Fever", medicines: "2" },
        { date: "2024-02-10", doctor: "Dr. Emily Davis", diagnosis: "Diabetes Check", medicines: "4" }
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const filteredPrescriptions = prescriptions.filter(rx => 
        rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) || 
        rx.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
    const paginatedPrescriptions = filteredPrescriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                                placeholder="Search prescriptions..." 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset page on search
                                }}
                                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '14px' }} 
                            />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 24px' }}>Date</th>
                                    <th style={{ padding: '16px 24px' }}>Doctor</th>
                                    <th style={{ padding: '16px 24px' }}>Diagnosis</th>
                                    <th style={{ padding: '16px 24px' }}>Medicines</th>
                                    <th style={{ padding: '16px 24px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPrescriptions.length > 0 ? paginatedPrescriptions.map((rx, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                                        <td style={{ padding: '16px 24px' }}>{rx.date}</td>
                                        <td style={{ padding: '16px 24px' }}>{rx.doctor}</td>
                                        <td style={{ padding: '16px 24px' }}>{rx.diagnosis}</td>
                                        <td style={{ padding: '16px 24px' }}>{rx.medicines}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <button onClick={() => alert('Viewing prescription details...')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => alert('Downloading prescription PDF...')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No prescriptions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

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
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages || totalPages === 0}
                                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', background: (currentPage === totalPages || totalPages === 0) ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', color: (currentPage === totalPages || totalPages === 0) ? '#9ca3af' : 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
