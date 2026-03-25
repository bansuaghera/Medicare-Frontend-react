import UserLayout from "../../layouts/UserLayout";
import { Stethoscope, Calendar, Search } from "lucide-react";
import { useState } from "react";

export default function History() {
    const historyData = [
        { title: "Routine Checkup", doctor: "Dr. Ramesh Sharma", date: "2024-02-10", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" },
        { title: "Fever", doctor: "Dr. Anjali Gupta", date: "2024-01-25", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" },
        { title: "Blood Pressure Check", doctor: "Dr. Amit Patel", date: "2023-12-10", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" },
        { title: "General Consultation", doctor: "Dr. Vikram Singh", date: "2023-11-15", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" }
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const filteredHistory = historyData.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.doctor.toLowerCase().includes(searchTerm.toLowerCase())
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
                            placeholder="Search by diagnosis or doctor..." 
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page
                            }}
                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px' }} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {paginatedHistory.length > 0 ? paginatedHistory.map((item, index) => (
                        <div key={index} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Stethoscope size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{item.title}</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{item.doctor}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px' }}>
                                        <Calendar size={14} />
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <span style={{ background: 'var(--bg-quaternary)', color: 'var(--text-tertiary)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            No history records found for "{searchTerm}"
                        </div>
                    )}
                </div>

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
