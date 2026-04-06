import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    Search,
    Eye,
    Edit3,
    Trash2,
    Stethoscope,
    AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
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

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await API.get("/users/doctors");
            if (res.data.success) {
                setDoctors(res.data.data.map(doc => ({
                    id: doc.id,
                    name: doc.name,
                    specialty: doc.Doctor?.specialization || "General",
                    phone: doc.Doctor?.phone || "N/A",
                    email: doc.email,
                    patients: doc.Doctor?.experienceYears || 0,
                    status: doc.Doctor?.availabilityStatus || "Active"
                })));
            }
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(doctors.map(d => d.id)));
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
            title: "Bulk Delete Doctors?",
            message: `Are you sure you want to delete ${selectedIds.size} doctors? This will remove all their appointment records and profile data.`,
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Deleting doctor records...");
                try {
                    const res = await API.delete("/users/bulk", { data: { ids: Array.from(selectedIds) } });
                    if (res.data.success) {
                        toast.success("Doctors deleted successfully", { id: loadToast });
                        setSelectedIds(new Set());
                        fetchDoctors();
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
            title: "Clear Doctors Directory?",
            message: "WARNING: This will delete ALL doctor profiles from the system. This cannot be undone.",
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Clearing system...");
                try {
                    const allIds = doctors.map(d => d.id);
                    const res = await API.delete("/users/bulk", { data: { ids: allIds } });
                    if (res.data.success) {
                        toast.success("All doctors removed", { id: loadToast });
                        fetchDoctors();
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
        toast.success("Doctor status updated");
        setDoctors(prev => prev.map(d =>
            d.id === id ? { ...d, status: d.status === "Active" ? "On Leave" : "Active" } : d
        ));
    };

    const handleDelete = (id) => {
        const doc = doctors.find(d => d.id === id);
        setConfirmModal({
            isOpen: true,
            title: `Remove ${doc?.name}?`,
            message: "Permanently delete this doctor profile? All scheduling data for this doctor will be lost.",
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Deleting doctor record...");
                try {
                    const res = await API.delete(`/users/${id}`);
                    if (res.data.success) {
                        toast.success("Doctor deleted successfully", { id: loadToast });
                        fetchDoctors();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch (error) {
                    toast.error("Failed to delete doctor", { id: loadToast });
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
                        <h1 style={{ margin: 0 }}>Doctors Directory</h1>
                        <p style={{ margin: '4px 0 0 0' }}>Manage doctor profiles and availability</p>
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
                        <Link to="/admin/doctors/add" className="add-btn" style={{ padding: '10px 20px', borderRadius: '12px', background: '#0fb48c', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px' }}>
                            <Plus size={18} />
                            Add Doctor
                        </Link>
                    </div>
                </div>

                <div className="table-card" style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div className="table-toolbar" style={{ padding: '20px' }}>
                        <div className="inner-search" style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '350px' }}>
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search doctors..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }} />
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
                                            checked={selectedIds.size === doctors.length && doctors.length > 0}
                                        />
                                    </th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Doctor Name</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Specialty</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Contact Info</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Patients</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.length > 0 ? doctors.map((doctor) => (
                                    <tr key={doctor.id} style={{ borderBottom: '1px solid #f1f5f9', background: selectedIds.has(doctor.id) ? '#f0f9ff' : 'transparent' }}>
                                        <td style={{ padding: '16px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.has(doctor.id)}
                                                onChange={() => handleSelectOne(doctor.id)}
                                            />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '10px', borderRadius: '12px' }}>
                                                    <Stethoscope size={20} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{doctor.name}</p>
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>{doctor.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '600' }}>{doctor.specialty}</td>
                                        <td style={{ padding: '16px', color: '#64748b' }}>{doctor.phone}</td>
                                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: '800', color: '#0fb48c' }}>{doctor.patients}</td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <span
                                                className={`status-badge ${doctor.status === 'Active' ? 'active' : ''}`}
                                                onClick={() => toggleStatus(doctor.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    ...(doctor.status === 'On Leave' ? { background: '#fff7ed', color: '#ea580c', border: 'none' } : {})
                                                }}
                                            >
                                                {doctor.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <Link to={`/admin/profile/${doctor.id}`} style={{ border: 'none', background: '#f1f5f9', color: '#6366f1', padding: '8px', borderRadius: '10px' }} title="View Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to={`/admin/profile/${doctor.id}?mode=edit`} style={{ border: 'none', background: '#f1f5f9', color: '#0fb48c', padding: '8px', borderRadius: '10px' }} title="Edit Profile">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button 
                                                    style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                                                    onClick={() => handleDelete(doctor.id)}
                                                    title="Delete Doctor"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                                            {loading ? "Fetching doctors list..." : "No doctors found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination" style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Total Doctors: <strong>{doctors.length}</strong></span>
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
