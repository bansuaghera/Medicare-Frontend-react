import React from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Printer, FileText, Search, Calendar, ChevronRight } from "lucide-react";

export default function Print() {
    const printItems = [
        { id: "A-045", type: "Token", patient: "John Smith", date: "Today, 09:00 AM" },
        { id: "RCP-1042", type: "Receipt", patient: "Sarah Johnson", date: "Today, 08:45 AM" },
        { id: "PRS-8942", type: "Prescription", patient: "Michael Chen", date: "Yesterday, 04:30 PM" },
        { id: "A-022", type: "Token", patient: "Emily Davis", date: "Yesterday, 10:15 AM" },
        { id: "REP-4591", type: "Lab Report", patient: "Robert Wilson", date: "Feb 10, 02:20 PM" },
    ];

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Print Center</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Print tokens, receipts, and reports</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>

                {/* Print Queue / History */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input
                                type="text"
                                placeholder="Search patient name or ID..."
                                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <select style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#fff', color: '#555' }}>
                            <option>All Types</option>
                            <option>Tokens</option>
                            <option>Receipts</option>
                            <option>Reports</option>
                            <option>Prescriptions</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {printItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px', color: '#666' }}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>{item.patient}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
                                            <span style={{ fontWeight: '500', color: '#0fb48c' }}>{item.id}</span>
                                            <span>•</span>
                                            <span>{item.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '13px' }}>
                                        <Calendar size={14} /> {item.date}
                                    </div>
                                    <button style={{ background: '#f0fbf8', color: '#0fb48c', border: '1px solid #b2efdb', padding: '8px 16px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Printer size={16} /> Print
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Print Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>Quick Actions</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#fff', border: '1px solid #eee', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: '#0fb48c' }}><FileText size={20} /></div>
                                    <span style={{ fontWeight: '500', color: '#333' }}>Print Last Token</span>
                                </div>
                                <ChevronRight size={18} color="#999" />
                            </button>

                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#fff', border: '1px solid #eee', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: '#4589f5' }}><FileText size={20} /></div>
                                    <span style={{ fontWeight: '500', color: '#333' }}>Print Doctor Schedule</span>
                                </div>
                                <ChevronRight size={18} color="#999" />
                            </button>

                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#fff', border: '1px solid #eee', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: '#b645f5' }}><FileText size={20} /></div>
                                    <span style={{ fontWeight: '500', color: '#333' }}>Print Daily Report</span>
                                </div>
                                <ChevronRight size={18} color="#999" />
                            </button>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>Printer Status</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                            <div style={{ background: '#e8fdf5', padding: '12px', borderRadius: '50%', color: '#0fb48c' }}>
                                <Printer size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Epson TM-T88VI</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0fb48c' }}></div>
                                    Online & Ready
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </StaffLayout>
    );
}
