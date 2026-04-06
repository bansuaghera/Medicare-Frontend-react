import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    Search,
    Eye,
    Edit3,
    Trash2,
    Briefcase,
    AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "danger",
        onConfirm: () => {}
    });

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await API.get("/users/staff");
            if (res.data.success) {
                setStaffList(res.data.data.map(s => ({
                    id: s.id,
                    name: s.name,
                    role: s.Staff?.staffRole || "General",
                    shift: s.Staff?.shift || "Morning",
                    phone: s.Staff?.phone || "N/A",
                    email: s.email,
                    status: "Active"
                })));
            }
        } catch (error) {
            console.error("Failed to fetch staff:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(staffList.map(s => s.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

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
            title: "Delete Staff Members?",
            message: `Permanently remove ${selectedIds.size} selected staff records? This will revoke their system access.`,
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Deleting staff records...");
                try {
                    const res = await API.delete("/users/bulk", { data: { ids: Array.from(selectedIds) } });
                    if (res.data.success) {
                        toast.success("Staff deleted successfully", { id: loadToast });
                        setSelectedIds(new Set());
                        fetchStaff();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch (error) {
                    toast.error("Bulk delete failed", { id: loadToast });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const handleClearAll = () => {
        setConfirmModal({
            isOpen: true,
            title: "Clear Staff List?",
            message: "WARNING: This will delete ALL staff accounts from the hospital database. This action is irreversible.",
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Clearing staff...");
                try {
                    const allIds = staffList.map(s => s.id);
                    const res = await API.delete("/users/bulk", { data: { ids: allIds } });
                    if (res.data.success) {
                        toast.success("All staff removed", { id: loadToast });
                        fetchStaff();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch {
                    toast.error("Clear failed", { id: loadToast });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const toggleStatus = (id) => {
        toast.success("Staff status updated");
        setStaffList(prev => prev.map(s =>
            s.id === id ? { ...s, status: s.status === "Active" ? "On Leave" : "Active" } : s
        ));
    };

    const handleDelete = (id) => {
        const member = staffList.find(s => s.id === id);
        setConfirmModal({
            isOpen: true,
            title: `Remove ${member?.name}?`,
            message: "Are you sure you want to delete this staff member's profile and system access?",
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Deleting staff record...");
                try {
                    const res = await API.delete(`/users/${id}`);
                    if (res.data.success) {
                        toast.success("Staff member removed successfully", { id: loadToast });
                        fetchStaff();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch (error) {
                    toast.error("Failed to delete staff member", { id: loadToast });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div className="page-title">
                        <h1 style={{ margin: 0 }}>Staff Management</h1>
                        <p style={{ margin: '4px 0 0 0' }}>Manage hospital administrative & nursing staff</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {selectedIds.size > 0 && (
                            <button 
                                onClick={handleDeleteSelected}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                            >
                                <Trash2 size={16} />
                                Delete Selected ({selectedIds.size})
                            </button>
                        )}
                        <button 
                            onClick={handleClearAll}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                        >
                            <AlertCircle size={16} />
                            Clear All
                        </button>
                        <Link to="/admin/staff/add" className="add-btn" style={{ padding: '10px 20px', borderRadius: '12px', background: '#0fb48c', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px' }}>
                            <Plus size={18} />
                            Add Staff
                        </Link>
                    </div>
                </div>

                <div className="table-card" style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div className="table-toolbar" style={{ padding: '20px' }}>
                        <div className="inner-search" style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '350px' }}>
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search staff members..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }} />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <tr>
                                    <th style={{ padding: '16px', textAlign: 'left', width: '40px' }}>
                                        <input 
                                            type="checkbox" 
                                            onChange={handleSelectAll}
                                            checked={selectedIds.size === staffList.length && staffList.length > 0}
                                        />
                                    </th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Staff Member</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Department / Role</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Shift</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Contact</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.length > 0 ? staffList.map((staff) => (
                                    <tr key={staff.id} style={{ borderBottom: '1px solid #f1f5f9', background: selectedIds.has(staff.id) ? '#f0f9ff' : 'transparent' }}>
                                        <td style={{ padding: '16px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.has(staff.id)}
                                                onChange={() => handleSelectOne(staff.id)}
                                            />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '12px' }}>
                                                    <Briefcase size={20} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{staff.name}</p>
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>ID: {staff.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '600' }}>{staff.role}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>{staff.shift}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{staff.phone}</p>
                                            <span style={{ fontSize: '11px', color: '#64748b' }}>{staff.email}</span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <span
                                                className={`status-badge ${staff.status === 'Active' ? 'active' : ''}`}
                                                onClick={() => toggleStatus(staff.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    ...(staff.status === 'On Leave' ? { background: '#fff7ed', color: '#ea580c', border: 'none' } : {})
                                                }}
                                            >
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <Link to="/admin/profile" style={{ border: 'none', background: '#f1f5f9', color: '#6366f1', padding: '8px', borderRadius: '10px' }} title="View Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to="/admin/staff/add?mode=edit" style={{ border: 'none', background: '#f1f5f9', color: '#0fb48c', padding: '8px', borderRadius: '10px' }} title="Edit Profile">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button 
                                                    style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                                                    onClick={() => handleDelete(staff.id)}
                                                    title="Delete Staff"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                                            {loading ? "Loading staff records..." : "No staff found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination" style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Total Staff: <strong>{staffList.length}</strong></span>
                    </div>

                </div>
            </div>

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />
        </AdminLayout>
    );
}
