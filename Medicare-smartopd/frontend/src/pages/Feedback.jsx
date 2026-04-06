import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
    Send, 
    Star, 
    MessageSquare, 
    CheckCircle, 
    Clock, 
    Calendar,
    Trash2,
    CheckSquare,
    Square,
    AlertCircle,
    XCircle
} from "lucide-react";
import toast from "react-hot-toast";

import UserLayout from "../layouts/UserLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import StaffLayout from "../layouts/StaffLayout";
import { 
    createFeedback, 
    getUserFeedbacks,
    deleteUserMultipleFeedbacks,
    deleteAllUserFeedbacks
} from "../api/feedbackAPI";
import ConfirmModal from "../components/modals/ConfirmModal";

export default function Feedback() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const panel = location.pathname.split("/")[1];

    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        rating: 5
    });
    const [submitting, setSubmitting] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "danger",
        onConfirm: () => {}
    });

    const Layout = panel === "doctor" ? DoctorLayout : (panel === "staff" ? StaffLayout : UserLayout);

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const res = await getUserFeedbacks(user.id);
            if (res.success) {
                setHistory(res.data);
            }
        } catch (error) {
            console.error("Failed to load history");
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user.id]);

    const handleSelectOne = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) return;
        
        setConfirmModal({
            isOpen: true,
            title: "Delete Selected Feedback?",
            message: `You are about to permanently remove ${selectedIds.size} feedback entries from your history.`,
            type: "danger",
            onConfirm: async () => {
                try {
                    await deleteUserMultipleFeedbacks(user.id, Array.from(selectedIds));
                    toast.success("Selected entries deleted successfully");
                    setSelectedIds(new Set());
                    fetchHistory();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    toast.error("Failed to delete entries");
                }
            }
        });
    };

    const handleClearHistory = () => {
        if (history.length === 0) return;

        setConfirmModal({
            isOpen: true,
            title: "Clear All History?",
            message: "This will permanently delete every feedback entry you've ever submitted. This action cannot be reversed.",
            type: "danger",
            onConfirm: async () => {
                try {
                    await deleteAllUserFeedbacks(user.id);
                    toast.success("History cleared completely");
                    setSelectedIds(new Set());
                    fetchHistory();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    toast.error("Failed to clear history");
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setSubmitting(true);
        try {
            await createFeedback({
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                ...formData
            });
            toast.success("Feedback submitted successfully!");
            setFormData({ subject: "", message: "", rating: 5 });
            fetchHistory();
        } catch (error) {
            toast.error("Failed to submit feedback. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'pending': return { bg: '#f3f4f6', text: '#6b7280' };
            case 'reviewed': return { bg: '#fef3c7', text: '#d97706' };
            case 'resolved': return { bg: '#d1fae5', text: '#059669' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    return (
        <Layout panelTitle={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel`}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Feedback & Support</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Help us improve Medicare SmartOPD by sharing your experience.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '40px', alignItems: 'start' }}>
                    
                    {/* Left: Feedback Form */}
                    <div>
                        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px var(--border-color)', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MessageSquare size={20} color="#0fb48c" />
                                Send New Feedback
                            </h3>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Subject</label>
                                <input 
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="Briefly describe your topic"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '14px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Experience Rating</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setFormData({...formData, rating: num})}
                                            style={{ 
                                                padding: '8px 12px', 
                                                borderRadius: '8px', 
                                                border: '1px solid', 
                                                borderColor: formData.rating >= num ? '#f59e0b' : 'var(--border-color)',
                                                background: formData.rating >= num ? '#fef3c7' : 'var(--bg-primary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Star size={18} fill={formData.rating >= num ? "#f59e0b" : "none"} color={formData.rating >= num ? "#f59e0b" : "var(--text-secondary)"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Detail Message</label>
                                <textarea 
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="Write your detailed experience here..."
                                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '14px', resize: 'none' }}
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                style={{ 
                                    width: '100%', 
                                    padding: '14px', 
                                    background: '#0fb48c', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '12px', 
                                    fontWeight: '700', 
                                    fontSize: '15px', 
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    opacity: submitting ? 0.7 : 1,
                                    transition: 'all 0.3s'
                                }}
                            >
                                {submitting ? 'Sending...' : <><Send size={18} /> Send Feedback</>}
                            </button>
                        </form>
                    </div>

                    {/* Right: Feedback History */}
                    <div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '28px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                                    <Calendar size={20} color="#0fb48c" />
                                    Feedback History
                                </h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {selectedIds.size > 0 && (
                                        <button 
                                            type="button"
                                            onClick={handleDeleteSelected}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#fff', background: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            <Trash2 size={14} />
                                            Delete Selected ({selectedIds.size})
                                        </button>
                                    )}
                                    {history.length > 0 && (
                                        <button 
                                            type="button"
                                            onClick={handleClearHistory}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#ef4444', background: '#fee2e2', border: '1px solid #fee2e2', padding: '6px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                                        >
                                            <XCircle size={14} />
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
                                {loadingHistory ? (
                                    <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading history records...</p>
                                ) : history.length > 0 ? history.map((item) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => handleSelectOne(item.id)}
                                        style={{ 
                                            padding: '20px', 
                                            background: 'var(--bg-primary)', 
                                            borderRadius: '20px', 
                                            border: selectedIds.has(item.id) ? '2px solid #0fb48c' : '1px solid var(--border-color)',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <div style={{ marginTop: '2px' }}>
                                                    {selectedIds.has(item.id) ? (
                                                        <CheckSquare size={18} color="#0fb48c" />
                                                    ) : (
                                                        <Square size={18} color="var(--border-color)" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h5 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{item.subject}</h5>
                                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                                        {[1,2,3,4,5].map(s => (
                                                            <Star key={s} size={13} fill={item.rating >= s ? '#f59e0b' : 'none'} color={item.rating >= s ? '#f59e0b' : '#ddd'} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{ 
                                                fontSize: '11px', 
                                                fontWeight: '800', 
                                                textTransform: 'uppercase', 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                background: getStatusStyle(item.status).bg, 
                                                color: getStatusStyle(item.status).text 
                                            }}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 16px 28px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.message}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '28px' }}>
                                            <Clock size={12} />
                                            {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-color)', borderRadius: '24px' }}>
                                        <MessageSquare size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                        <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)' }}>No feedback history found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom Modern Confirm Modal */}
            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />
        </Layout>
    );
}
