import UserLayout from "../../layouts/UserLayout";
import { Search, Eye, X, Pill, Calendar, Stethoscope, FileText, Download, Trash2, CheckSquare, Square, RefreshCw, MapPin, ClipboardList, Activity, Heart, Thermometer, Scale } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Prescriptions() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingRx, setViewingRx] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchPrescriptions = async (silent = false) => {
        if (!user.id) return;
        if (!silent) setLoading(true);
        try {
            const res = await API.get(`/prescriptions/patient/${user.id}`);
            if (res.data.success) setPrescriptions(res.data.data || []);
        } catch (error) { toast.error("Error syncing vault."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPrescriptions(); }, [user.id]);

    const filtered = prescriptions.filter(rx =>
        (rx.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rx.doctorName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadPDF = (rx) => {
        try {
            const doc = new jsPDF();
            const dateStr = new Date(rx.Appointment?.date || rx.createdAt).toLocaleDateString();
            const patientName = user.name || "Patient";

            // Professional Clinical Header
            doc.setFillColor(15, 180, 140);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("MEDICARE CLINICAL PROTOCOL", 15, 25);
            
            // Record Metadata
            doc.setTextColor(51, 51, 51);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Patient Identity: ${patientName}`, 15, 55);
            doc.text(`Attending Consultant: Dr. ${rx.doctorName}`, 15, 62);
            doc.text(`Consultation Date: ${dateStr}`, 145, 55);
            doc.text(`Vault ID: RX-${rx.id.toString().slice(-6).toUpperCase()}`, 145, 62);

            // Vitals Table
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("1. CLINICAL OBSERVATIONS", 15, 80);
            const vData = rx.vitals ? Object.entries(rx.vitals).map(([k, v]) => [k.toUpperCase(), v]) : [["-", "-"]];
            autoTable(doc, { 
                startY: 85, 
                head: [['HEALTH METRIC', 'VALUE']], 
                body: vData, 
                theme: 'striped', 
                headStyles: { fillColor: [15, 180, 140] } 
            });

            // Diagnostic Summary
            let currentY = (doc).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.text("2. TREATMENT PLAN", 15, currentY);
            
            // Medication Protocol
            const mBody = Array.isArray(rx.medicines) ? rx.medicines.map(m => [m.name, m.timing || "After Food", m.frequency, m.duration]) : [];
            autoTable(doc, { 
                startY: currentY + 5, 
                head: [['MEDICINE', 'TIMING (AFTER/BEFORE)', 'FREQUENCY', 'DURATION']], 
                body: mBody, 
                theme: 'grid', 
                headStyles: { fillColor: [15, 180, 140] } 
            });

            doc.save(`MediCare_Rec_${patientName.replace(/\s+/g, '_')}_${dateStr.replace(/\//g, '-')}.pdf`);
            toast.success("Health record downloaded successfully");
        } catch (err) {
            console.error("PDF Export Failure:", err);
            toast.error("Failed to generate report.");
        }
    };

    const handleSelectToggle = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(r => r.id));

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently wipe ${selectedIds.length} prescription records?`)) return;
        try {
            await API.delete("/prescriptions", { data: { ids: selectedIds } });
            toast.success("Records wiped.");
            setPrescriptions(prescriptions.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        } catch (error) { toast.error("Cloud deletion failed."); }
    };

    const getVitalIcon = (key) => {
        const icons = { bloodPressure: <Activity size={18} color="#f04438" />, temperature: <Thermometer size={18} color="#f79009" />, pulseRate: <Heart size={18} color="#f04438" />, weight: <Scale size={18} color="#2e90fa" /> };
        return icons[key] || <Activity size={18} />;
    };

    return (
        <UserLayout panelTitle="Digital Vault">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', marginBottom: '8px' }}>Health Vault</h1>
                        <p style={{ color: '#667085', fontSize: '16px' }}>Secure historical repository of your profiles.</p>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                            <div style={{ position: 'relative', width: '380px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }} />
                                <input type="text" placeholder="Search by diagnosis or doctor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '16px', border: '1px solid #d0d5dd', background: '#f9fafb' }} />
                            </div>
                            <button onClick={() => fetchPrescriptions(true)} style={{ background: '#fff', border: '1px solid #eaecf0', padding: '12px', borderRadius: '16px', cursor: 'pointer' }}><RefreshCw size={18} className={loading ? 'animate-spin' : ''}/></button>
                        </div>
                        {selectedIds.length > 0 && (
                            <button onClick={handleDeleteSelected} style={{ background: '#fee4e2', color: '#f04438', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer' }}>
                                <Trash2 size={20}/> Wipe Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eaecf0', fontSize: '12px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>
                                        <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={22} color="#0fb48c" /> : <Square size={22} color="#eaecf0" />}</button>
                                    </th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Session Date</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Consultant</th>
                                    <th style={{ padding: '10px 24px', textAlign: 'left' }}>Diagnosis</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '80px', textAlign: 'center' }}>Connecting to data hub...</td></tr>
                                ) : (filtered.map(rx => (
                                    <tr key={rx.id} style={{ borderBottom: '1px solid #f2f4f7', background: selectedIds.includes(rx.id) ? '#f5faff' : 'none' }}>
                                        <td style={{ padding: '24px' }}><button onClick={() => handleSelectToggle(rx.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{selectedIds.includes(rx.id) ? <CheckSquare size={22} color="#0fb48c" /> : <Square size={22} color="#eaecf0" />}</button></td>
                                        <td style={{ padding: '24px', fontWeight: '900' }}>{new Date(rx.Appointment?.date || rx.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '24px', fontWeight: '700' }}>Dr. {rx.doctorName}</td>
                                        <td style={{ padding: '24px' }}>{rx.diagnosis}</td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => downloadPDF(rx)} style={{ padding: '10px', borderRadius: '12px', background: '#ecfdf3', border: 'none', color: '#027a48', cursor: 'pointer' }}><Download size={18}/></button>
                                                <button onClick={() => setViewingRx(rx)} style={{ padding: '10px', borderRadius: '12px', background: '#f5faff', border: '1px solid #d1e9ff', color: '#175cd3', cursor: 'pointer' }}><Eye size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {viewingRx && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(16, 24, 40, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '40px', padding: '48px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#101828', margin: 0 }}>Health Record Summary</h2>
                            <button onClick={() => setViewingRx(null)} style={{ background: '#f2f4f7', border: 'none', borderRadius: '16px', padding: '12px', cursor: 'pointer' }}><X size={24}/></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                {viewingRx.vitals && Object.entries(viewingRx.vitals).map(([k, v]) => (
                                    <div key={k} style={{ background: '#f9fafb', padding: '16px', borderRadius: '20px', textAlign: 'center', border: '1px solid #eaecf0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{getVitalIcon(k)}</div>
                                        <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: '800', color: '#667085' }}>{k.toUpperCase()}</p>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#101828' }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#f0fdf9', padding: '24px', borderRadius: '24px', border: '1px solid #d0ece3' }}>
                                <label style={{ fontSize: '11px', fontWeight: '950', color: '#0fb48c', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Clinical Diagnosis</label>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '950', color: '#064e3b' }}>{viewingRx.diagnosis}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '950', color: '#667085', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>Medication Protocol</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {Array.isArray(viewingRx.medicines) && viewingRx.medicines.map((m, i) => (
                                        <div key={i} style={{ padding: '24px', borderRadius: '24px', background: '#f8fbfc', border: '1px solid #f2f4f7', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pill size={24}/></div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: '950', fontSize: '16px', color: '#111827' }}>{m.name}</p>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#667085', fontWeight: '700' }}>{m.timing || "Anytime"} • {m.frequency} • {m.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </UserLayout>
    );
}
