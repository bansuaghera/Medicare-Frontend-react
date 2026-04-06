import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, Eye, Trash2, Download, RefreshCw, CheckSquare, Square, FileText, Calendar, User, ClipboardList, MapPin, X, Pill, Activity, Heart, Thermometer, Scale, Clock } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Prescriptions() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [viewingRx, setViewingRx] = useState(null);

    const fetchPrescriptions = async () => {
        if (!user.id) return;
        setLoading(true);
        try {
            const res = await API.get(`/prescriptions/doctor/${user.id}`);
            if (res.data.success) setPrescriptions(res.data.data || []);
        } catch (error) { toast.error("Cloud-sync error."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPrescriptions(); }, [user.id]);

    const filtered = prescriptions.filter(rx =>
        (rx.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rx.PatientRecord?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadPDF = (rx) => {
        try {
            const doc = new jsPDF();
            const patientName = rx.PatientRecord?.name || "Unknown Patient";
            const date = new Date(rx.Appointment?.date || rx.createdAt).toLocaleDateString();

            // Header Section
            doc.setFillColor(15, 180, 140);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("MEDICARE SMARTOPD CLINICAL REPORT", 15, 25);
            
            // Meta Info
            doc.setTextColor(51, 51, 51);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Consultant: Dr. ${user.name}`, 15, 55);
            doc.text(`Patient Identity: ${patientName}`, 15, 62);
            doc.text(`Registry Branch: ${rx.clinicLocation || "Main"}`, 140, 55);
            doc.text(`Record Date: ${date}`, 140, 62);

            // Vitals Table
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("1. CLINICAL VITALS", 15, 80);
            const vData = rx.vitals ? Object.entries(rx.vitals).map(([k, v]) => [k.toUpperCase(), v]) : [["-", "-"]];
            autoTable(doc, { 
                startY: 85, 
                head: [['HEALTH METRIC', 'VALUE']], 
                body: vData, 
                theme: 'striped', 
                headStyles: { fillColor: [15, 180, 140] } 
            });

            // Observations
            let curY = (doc).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.text("2. CLINICAL FINDINGS", 15, curY);
            doc.setFontSize(10);
            doc.setTextColor(140, 140, 140); 
            doc.text("SYMPTOMS:", 15, curY + 8);
            doc.setTextColor(51, 51, 51); 
            doc.setFont("helvetica", "normal"); 
            doc.text(rx.symptoms || "N/A", 15, curY + 14, { maxWidth: 180 });

            doc.setFont("helvetica", "bold"); 
            doc.setTextColor(15, 180, 140); 
            doc.text(`PRIMARY DIAGNOSIS: ${rx.diagnosis}`, 15, curY + 28);

            // Medications
            curY += 40; 
            if (curY > 250) { doc.addPage(); curY = 20; }
            doc.setTextColor(51, 51, 51); 
            doc.setFontSize(14); 
            doc.text("3. MEDICATION CHART", 15, curY);
            
            const mBody = Array.isArray(rx.medicines) ? rx.medicines.map(m => [m.name, m.timing || "General", m.frequency, m.duration]) : [];
            autoTable(doc, { 
                startY: curY + 5, 
                head: [['MEDICINE', 'TIMING', 'SCHED', 'PERIOD']], 
                body: mBody, 
                theme: 'grid', 
                headStyles: { fillColor: [15, 180, 140] } 
            });

            doc.save(`MediCare_Archive_${patientName.replace(/\s+/g, '_')}.pdf`);
            toast.success("PDF Downloaded successfully");
        } catch (err) {
            console.error("PDF Error:", err);
            toast.error("Failed to generate PDF. Check console for details.");
        }
    };

    const handleSelectToggle = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(r => r.id));

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently wipe ${selectedIds.length} records?`)) return;
        try {
            await API.delete("/prescriptions", { data: { ids: selectedIds } });
            toast.success("Sync cleanup successful.");
            setPrescriptions(prescriptions.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        } catch (error) { toast.error("Cloud deletion failed."); }
    };

    const getVitalIcon = (key) => {
        const icons = { bloodPressure: <Activity size={18} color="#f04438" />, temperature: <Thermometer size={18} color="#f79009" />, pulseRate: <Heart size={18} color="#f04438" />, weight: <Scale size={18} color="#2e90fa" /> };
        return icons[key] || <Activity size={18} />;
    };

    return (
        <DoctorLayout panelTitle="Digital Registry">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', marginBottom: '4px' }}>Prescription Registry</h1>
                        <p style={{ color: '#667085', fontSize: '15px' }}>Historical vault of consultation protocols.</p>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ position: 'relative', width: '380px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }} />
                                <input type="text" placeholder="Diagnosis or Patient search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '16px', border: '1px solid #d0d5dd', background: '#f9fafb', outline: 'none' }} />
                            </div>
                            <button onClick={fetchPrescriptions} style={{ padding: '12px', borderRadius: '16px', border: '1px solid #eaecf0', background: '#fff', cursor: 'pointer' }}><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
                        </div>
                        {selectedIds.length > 0 && <button onClick={handleDeleteSelected} style={{ background: '#fee4e2', color: '#f04438', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer' }}>Delete Selected ({selectedIds.length})</button>}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eaecf0', fontSize: '12px', fontWeight: '800', color: '#667085', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 24px' }}>
                                        <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={20} color="#0fb48c" /> : <Square size={20} color="#eaecf0" />}</button>
                                    </th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Session Date</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Patient Name</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Primary Diagnosis</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center' }}>Connecting to data hub...</td></tr>
                                ) : filtered.map(rx => (
                                    <tr key={rx.id} style={{ borderBottom: '1px solid #f2f4f7' }}>
                                        <td style={{ padding: '24px' }}><button onClick={() => handleSelectToggle(rx.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{selectedIds.includes(rx.id) ? <CheckSquare size={20} color="#0fb48c" /> : <Square size={20} color="#eaecf0" />}</button></td>
                                        <td style={{ padding: '24px', fontWeight: '800' }}>{new Date(rx.Appointment?.date || rx.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '24px', fontWeight: '700' }}>{rx.PatientRecord?.name}</td>
                                        <td style={{ padding: '24px' }}>{rx.diagnosis}</td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => downloadPDF(rx)} style={{ padding: '8px', borderRadius: '10px', background: '#ecfdf3', border: 'none', color: '#027a48', cursor: 'pointer' }}><Download size={18}/></button>
                                                <button onClick={() => setViewingRx(rx)} style={{ padding: '8px', borderRadius: '10px', background: '#f5faff', border: '1px solid #d1e9ff', color: '#175cd3', cursor: 'pointer' }}><Eye size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {viewingRx && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(16, 24, 40, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '40px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0fb48c1a', color: '#0fb48c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText /></div>
                                <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>Consultation Insights</h2>
                             </div>
                             <button onClick={() => setViewingRx(null)} style={{ background: '#f2f4f7', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer' }}><X size={20}/></button>
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
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#0fb48c', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Primary Diagnosis</label>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#064e3b' }}>{viewingRx.diagnosis}</p>
                            </div>

                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#667085', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Medication Protocol</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {Array.isArray(viewingRx.medicines) && viewingRx.medicines.map((m, i) => (
                                        <div key={i} style={{ padding: '16px', borderRadius: '16px', background: '#fdfcfe', border: '1px solid #f2f4f7', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pill size={16}/></div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '800', fontSize: '14px' }}>{m.name}</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{m.timing || "General"} — {m.frequency} — {m.duration}</p>
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
        </DoctorLayout>
    );
}
