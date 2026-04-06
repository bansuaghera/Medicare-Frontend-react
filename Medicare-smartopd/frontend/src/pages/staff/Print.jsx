import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Printer, FileText, Search, Calendar, ChevronRight, Download, Clock, User, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Print() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeType, setActiveType] = useState("All Types");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPrintData = async () => {
        try {
            setLoading(true);
            const [apptRes, rxRes] = await Promise.all([
                API.get("/appointments"),
                API.get("/prescriptions")
            ]);

            const allAppts = (apptRes.data?.data || []).map(a => ({
                id: `TKN-${a.tokenNumber}`,
                realId: a.id,
                type: "Token",
                patient: a.Patient?.name || "Unknown Patient",
                date: a.date,
                time: a.time,
                doctor: a.Doctor?.name || "TBD",
                status: a.status
            }));

            const allRx = (rxRes.data?.data || []).map(r => ({
                id: `PRN-${r.id.toString().slice(-6).toUpperCase()}`,
                realId: r.id,
                type: "Prescription",
                patient: r.PatientRecord?.name || "Patient",
                date: new Date(r.createdAt).toLocaleDateString(),
                time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                doctor: r.DoctorRecord?.name || "Medical Officer",
                status: "Finalized",
                raw: r
            }));

            setItems([...allAppts, ...allRx].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            toast.error("Failed to load clinical print queue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrintData();
    }, []);

    const handlePrintToken = (item) => {
        const doc = new jsPDF({ unit: 'mm', format: [80, 100] });
        doc.setFontSize(18);
        doc.setTextColor(15, 180, 140);
        doc.text("MEDICARE OPD", 40, 15, { align: 'center' });
        
        doc.setLineWidth(0.5);
        doc.line(10, 20, 70, 20);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("PATIENT TOKEN", 40, 30, { align: 'center' });
        
        doc.setFontSize(32);
        doc.setTextColor(0, 0, 0);
        doc.text(`#${item.id.replace('TKN-', '')}`, 40, 50, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Patient: ${item.patient}`, 10, 65);
        doc.text(`Doctor: Dr. ${item.doctor}`, 10, 72);
        doc.text(`Date: ${item.date} | ${item.time}`, 10, 79);
        
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Please wait for your turn in the waiting area.", 40, 92, { align: 'center' });
        
        doc.save(`${item.id}_${item.patient}.pdf`);
        toast.success("Token generated for download.");
    };

    const handlePrintPrescription = (item) => {
        const rx = item.raw;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(24);
        doc.setTextColor(15, 180, 140);
        doc.text("MEDICARE SMART OPD", 105, 20, { align: "center" });
        
        // Doctor info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Dr. ${item.doctor}`, 20, 40);
        doc.setFontSize(10);
        doc.text("Clinical Consultant", 20, 45);
        
        doc.setLineWidth(0.5);
        doc.line(20, 50, 190, 50);
        
        // Patient Details
        doc.text(`Name: ${item.patient}`, 20, 60);
        doc.text(`Date: ${item.date}`, 160, 60);
        
        // Vitals
        if (rx.vitals) {
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.text("Vitals:", 20, 75);
            doc.setFontSize(10);
            doc.text(`BP: ${rx.vitals.bp || 'N/A'} | Pulse: ${rx.vitals.pulse || 'N/A'} | Temp: ${rx.vitals.temp || 'N/A'}`, 20, 82);
        }
        
        // Medicines
        const tableData = (rx.medicines || []).map((m, i) => [
            i + 1,
            m.name,
            m.dosage,
            m.duration,
            m.timing || m.foodTiming || "After Food"
        ]);
        
        autoTable(doc, {
            startY: 95,
            head: [['#', 'Medicine', 'Dosage', 'Duration', 'Food Timing']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [15, 180, 140] }
        });
        
        // Footer
        doc.save(`${item.id}_Recipe.pdf`);
        toast.success("Prescription generated.");
    };

    const filtered = items.filter(i => 
        (activeType === "All Types" || i.type === activeType) &&
        (i.patient.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <StaffLayout panelTitle="Clinical Print Center">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '950', color: '#101828', marginBottom: '4px' }}>Document Output Hub</h1>
                    <p style={{ color: '#667085', fontSize: '16px' }}>Generate and download physical tokens, medical prescriptions, and billing receipts.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }}>
                    
                    {/* PRIMARY OUTPUT QUEUE */}
                    <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text" placeholder="Search by patient name or Ref ID..." value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '18px', border: '1px solid #d0d5dd', background: '#f9fafb', outline: 'none' }}
                                />
                            </div>
                            <select 
                                value={activeType} onChange={(e) => setActiveType(e.target.value)}
                                style={{ padding: '14px 20px', borderRadius: '18px', border: '1px solid #d0d5dd', outline: 'none', backgroundColor: '#fff', color: '#475467', fontWeight: '700' }}>
                                <option>All Types</option>
                                <option>Token</option>
                                <option>Prescription</option>
                                <option>Receipt</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {loading ? (
                                <p style={{ textAlign: 'center', padding: '60px', color: '#667085' }}>Synchronizing output queue...</p>
                            ) : filtered.length > 0 ? filtered.map((item, index) => (
                                <div key={index} style={{ 
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', 
                                    border: '1px solid #f2f4f7', borderRadius: '24px', background: '#fff', transition: '0.2s',
                                    hover: { background: '#f9fafb' }
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ background: '#f5faff', padding: '14px', borderRadius: '16px', color: '#175cd3' }}>
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#101828', margin: 0 }}>{item.patient}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: '900', color: '#0fb48c', background: '#ecfdf5', padding: '2px 10px', borderRadius: '10px' }}>{item.id}</span>
                                                <span style={{ width: '4px', height: '4px', background: '#d0d5dd', borderRadius: '50%' }}></span>
                                                <span style={{ fontSize: '13px', color: '#667085', fontWeight: '700' }}>{item.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', marginBottom: '2px' }}>Timestamp</div>
                                            <div style={{ fontSize: '14px', fontWeight: '750', color: '#101828' }}>{item.date}, {item.time}</div>
                                        </div>
                                        <button 
                                            onClick={() => item.type === "Token" ? handlePrintToken(item) : handlePrintPrescription(item)}
                                            style={{ background: '#f0fdf9', color: '#0fb48c', border: '1px solid #d1fadf', padding: '14px 24px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 4px rgba(15,180,140,0.1)' }}>
                                            <Download size={18} /> DOWNLOAD
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
                                    <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                    <p style={{ fontSize: '16px', fontWeight: '800' }}>No printable documents matched your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SIDEBAR ASSETS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #eaecf0', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#101828', marginBottom: '24px' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { label: 'Print Last Token', icon: <Clock size={20}/>, color: '#0fb48c', bg: '#f0fdf9' },
                                    { label: 'OPD Schedule Roster', icon: <Calendar size={20}/>, color: '#1d4ed8', bg: '#eff6ff' },
                                    { label: 'Daily Session Report', icon: <FileText size={20}/>, color: '#7c3aed', bg: '#f5f3ff' }
                                ].map((act, i) => (
                                    <button key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#fff', border: '1px solid #f2f4f7', padding: '20px', borderRadius: '20px', cursor: 'pointer', transition: '0.2s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ background: act.bg, color: act.color, padding: '12px', borderRadius: '14px' }}>{act.icon}</div>
                                            <span style={{ fontWeight: '850', color: '#1e293b', fontSize: '15px' }}>{act.label}</span>
                                        </div>
                                        <ChevronRight size={20} color="#94a3b8" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#101828', borderRadius: '32px', padding: '32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}><Printer size={120} /></div>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>Thermal Engine <Printer size={20} color="#0fb48c" /></h3>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ padding: '12px', background: '#0fb48c', borderRadius: '50%', boxShadow: '0 0 20px rgba(15,180,140,0.4)' }}><CheckCircle2 size={24} /></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>Cloud Connector</p>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Epson Thermal Enabled</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
