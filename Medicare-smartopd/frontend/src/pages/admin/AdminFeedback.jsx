import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
    MessageSquare, 
    Trash2, 
    CheckCircle, 
    Clock, 
    Star, 
    AlertCircle, 
    Search, 
    Filter,
    Check,
    X,
    UserCircle2,
    Calendar
} from "lucide-react";
import toast from "react-hot-toast";

import { 
    getAllFeedbacks, 
    updateFeedbackStatus, 
    deleteFeedback, 
    deleteMultipleFeedbacks, 
    deleteAllFeedbacks 
} from "../../api/feedbackAPI";

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const res = await getAllFeedbacks();
            if (res.success) {
                setFeedbacks(res.data);
            }
        } catch (error) {
            toast.error("Failed to load feedbacks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleSelectAll = () => {
        if (selectedIds.size === filteredFeedbacks.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredFeedbacks.map(f => f.id)));
        }
    };

    const handleSelectOne = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!window.confirm(`Delete ${selectedIds.size} selected feedbacks?`)) return;

        try {
            await deleteMultipleFeedbacks(Array.from(selectedIds));
            toast.success("Feedbacks deleted successfully");
            setSelectedIds(new Set());
            fetchFeedbacks();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("ARE YOU SURE? This will delete ALL feedback records!")) return;

        try {
            await deleteAllFeedbacks();
            toast.success("All feedbacks cleared");
            fetchFeedbacks();
        } catch (error) {
            toast.error("Failed to clear feedbacks");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateFeedbackStatus(id, status);
            toast.success(`Marked as ${status}`);
            fetchFeedbacks();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDeleteOne = async (id) => {
        if (!window.confirm("Delete this feedback?")) return;
        try {
            await deleteFeedback(id);
            toast.success("Feedback removed");
            fetchFeedbacks();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesStatus = filterStatus === "all" || f.status === filterStatus;
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             f.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return { bg: '#fee2e2', text: '#ef4444' };
            case 'reviewed': return { bg: '#fef3c7', text: '#d97706' };
            case 'resolved': return { bg: '#d1fae5', text: '#059669' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'doctor': return '#a855f7';
            case 'staff': return '#4589f5';
            case 'user': return '#0fb48c';
            default: return '#111827';
        }
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="feedback-admin-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Patient & Staff Feedback</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage suggestions and support requests from all users.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {selectedIds.size > 0 && (
                            <button 
                                onClick={handleDeleteSelected}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                <Trash2 size={18} />
                                Delete Selected ({selectedIds.size})
                            </button>
                        )}
                        <button 
                            onClick={handleDeleteAll}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#fff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            <Trash2 size={18} />
                            Clear All Logs
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', background: 'var(--bg-secondary)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by name, subject, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '14px' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Filter size={18} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
                        {["all", "pending", "reviewed", "resolved"].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{ 
                                    padding: '8px 16px', 
                                    borderRadius: '10px', 
                                    border: '1px solid',
                                    borderColor: filterStatus === status ? '#0fb48c' : 'var(--border-color)',
                                    background: filterStatus === status ? '#0fb48c' : 'var(--bg-primary)',
                                    color: filterStatus === status ? '#fff' : 'var(--text-secondary)',
                                    textTransform: 'capitalize',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feedback Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px 8px' }}>
                        <input 
                            type="checkbox" 
                            checked={selectedIds.size === filteredFeedbacks.length && filteredFeedbacks.length > 0} 
                            onChange={handleSelectAll}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Select All</span>
                        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-secondary)' }}>Showing {filteredFeedbacks.length} items</span>
                    </div>

                    {loading ? (
                        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <MessageSquare size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
                            <p>Loading feedbacks...</p>
                        </div>
                    ) : filteredFeedbacks.length > 0 ? filteredFeedbacks.map((f) => (
                        <div 
                            key={f.id} 
                            style={{ 
                                background: selectedIds.has(f.id) ? 'var(--pill-blue-bg)' : 'var(--bg-secondary)', 
                                padding: '24px', 
                                borderRadius: '24px', 
                                border: selectedIds.has(f.id) ? '2px solid var(--pill-blue-text)' : '1px solid var(--border-color)',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.has(f.id)} 
                                    onChange={() => handleSelectOne(f.id)}
                                    style={{ width: '18px', height: '18px', marginTop: '12px' }}
                                />
                                
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getRoleColor(f.role) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <UserCircle2 color={getRoleColor(f.role)} />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '700' }}>{f.name}</h4>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '12px', color: '#fff', background: getRoleColor(f.role), padding: '1px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>{f.role}</span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>• {f.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ background: getStatusColor(f.status).bg, color: getStatusColor(f.status).text, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'inline-block' }}>
                                                {f.status}
                                            </div>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                                <Calendar size={13} />
                                                {new Date(f.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{f.subject}</h5>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} size={14} fill={f.rating >= star ? '#f59e0b' : 'none'} color={f.rating >= star ? '#f59e0b' : '#ddd'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>"{f.message}"</p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {f.status !== 'reviewed' && (
                                                <button onClick={() => handleUpdateStatus(f.id, 'reviewed')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                                                    <Clock size={16} /> Mark as Reviewed
                                                </button>
                                            )}
                                            {f.status !== 'resolved' && (
                                                <button onClick={() => handleUpdateStatus(f.id, 'resolved')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#d1fae5', color: '#065f46', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                                                    <Check size={16} /> Mark as Resolved
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={() => handleDeleteOne(f.id)} style={{ padding: '8px', color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '100px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--bg-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <AlertCircle size={30} color="var(--text-secondary)" />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No Feedbacks Found</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Either no feedback has been submitted yet or it doesn't match your filters.</p>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
