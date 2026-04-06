import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Search, RotateCcw, Calendar, User, ClipboardList, Clock, ArrowRight } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Followups() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [followups, setFollowups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFollowups = async () => {
        if (!user.id) return;
        setLoading(true);
        try {
            const res = await API.get(`/prescriptions/doctor/${user.id}`);
            if (res.data.success) {
                // Filter prescriptions that have a follow-up date and are roughly in the future or today
                const today = new Date().toISOString().split("T")[0];
                const list = (res.data.data || [])
                    .filter(rx => rx.nextFollowUp)
                    .map(rx => ({
                        id: rx.id,
                        patientId: rx.patientId,
                        patientName: rx.PatientRecord?.name || "Patient",
                        originalVisit: new Date(rx.createdAt).toLocaleDateString(),
                        followupDate: rx.nextFollowUp,
                        reason: rx.diagnosis || "Medical Review",
                        status: rx.nextFollowUp === today ? "Due Today" : (rx.nextFollowUp > today ? "Upcoming" : "Overdue")
                    }))
                    .sort((a, b) => new Date(a.followupDate) - new Date(b.followupDate));
                setFollowups(list);
            }
        } catch (error) { toast.error("Sync failed."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchFollowups(); }, [user.id]);

    const filtered = followups.filter(f =>
        f.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Due Today': return { bg: '#fffbeb', color: '#b45309', label: 'DUE TODAY' };
            case 'Upcoming': return { bg: '#f0f9ff', color: '#026aa2', label: 'UPCOMING' };
            case 'Overdue': return { bg: '#fef2f2', color: '#b91c1c', label: 'OVERDUE' };
            default: return { bg: '#f9fafb', color: '#667085', label: status.toUpperCase() };
        }
    };

    return (
        <DoctorLayout panelTitle="Clinical Lifecycle">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', marginBottom: '4px' }}>Patient Follow-ups</h1>
                        <p style={{ color: '#667085', fontSize: '15px' }}>Track and manage patients scheduled for return visits.</p>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ position: 'relative', width: '400px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }} />
                            <input
                                type="text" placeholder="Search by patient name..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px 12px 48px', borderRadius: '16px', border: '1px solid #d0d5dd', background: '#f9fafb', outline: 'none' }}
                            />
                        </div>
                        <button onClick={fetchFollowups} style={{ background: '#fff', border: '1px solid #eaecf0', padding: '12px 20px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RotateCcw size={18} /> Refresh Follow-ups
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eaecf0', fontSize: '12px', fontWeight: '800', color: '#667085', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Patient Profile</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Next Visit</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Clinical Reason</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center' }}>Connecting to cloud registry...</td></tr>
                                ) : filtered.length > 0 ? filtered.map((item, idx) => {
                                    const st = getStatusStyle(item.status);
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f9fafb' }}>
                                            <td style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5faff', color: '#175cd3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20}/></div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: '800', fontSize: '15px' }}>{item.patientName}</p>
                                                        <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>Last Visit: {item.originalVisit}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px', fontWeight: '700', color: '#101828' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Calendar size={16} color="#0fb48c" />
                                                    {new Date(item.followupDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px', fontSize: '14px', color: '#475467' }}>{item.reason}</td>
                                            <td style={{ padding: '24px' }}>
                                                <span style={{ background: st.bg, color: st.color, padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.5px' }}>{st.label}</span>
                                            </td>
                                            <td style={{ padding: '24px', textAlign: 'right' }}>
                                                <button onClick={() => navigate('/doctor/examination')} style={{ background: '#fff', border: '1px solid #d0d5dd', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                    Start Session <ArrowRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="5" style={{ padding: '80px', textAlign: 'center', color: '#667085', fontSize: '15px' }}>No pending follow-ups found in your registry.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '32px', background: '#f9fafb', borderRadius: '24px', padding: '32px', border: '1px solid #eaecf0', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <ClipboardList size={32} color="#0fb48c" />
                    <div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#475467', lineHeight: 1.6 }}>
                            <strong>Follow-up Management:</strong> This registry is automatically populated when you set a "Next Follow-up Date" during patient examination. Use this to track critical post-care reviews and ensure continuity of treatment.
                        </p>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
