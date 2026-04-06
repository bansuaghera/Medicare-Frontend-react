import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Eye,
    Edit3,
    Trash2,
    Users as UsersIcon,
    CheckSquare,
    Square,
    AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function Users() {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "danger",
        onConfirm: () => {}
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const selectable = users.filter(u => u.id !== currentUser.id).map(u => u.id);
            setSelectedIds(new Set(selectable));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id) => {
        if (id === currentUser.id) return;
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) return;
        
        setConfirmModal({
            isOpen: true,
            title: "Bulk Delete Users?",
            message: `You are about to permanently delete ${selectedIds.size} selected user accounts. This action is irreversible.`,
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading(`Deleting ${selectedIds.size} users...`);
                try {
                    const res = await API.delete("/users/bulk", { data: { ids: Array.from(selectedIds) } });
                    if (res.data.success) {
                        toast.success("Users deleted successfully", { id: loadToast });
                        setSelectedIds(new Set());
                        fetchUsers();
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
            title: "Wipe System Users?",
            message: "CRITICAL: This will delete ALL registered users except your own admin account. Proceed with extreme caution.",
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Clearing all users...");
                try {
                    const res = await API.delete("/users/clear-all", { data: { excludeId: currentUser.id } });
                    if (res.data.success) {
                        toast.success("All users cleared successfully", { id: loadToast });
                        setSelectedIds(new Set());
                        fetchUsers();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch (error) {
                    toast.error("Failed to clear users", { id: loadToast });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const handleDelete = (id) => {
        if (id === currentUser.id) return toast.error("You cannot delete your own account here.");
        
        const targetUser = users.find(u => u.id === id);
        setConfirmModal({
            isOpen: true,
            title: `Delete ${targetUser?.name}?`,
            message: "Permanently remove this user and all associated medical data? This cannot be undone.",
            type: "danger",
            onConfirm: async () => {
                const loadToast = toast.loading("Deleting user...");
                try {
                    const res = await API.delete(`/users/${id}`);
                    if (res.data.success) {
                        toast.success("User deleted successfully", { id: loadToast });
                        fetchUsers();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                } catch (error) {
                    toast.error("Failed to delete user", { id: loadToast });
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Updating user info...");
        try {
            const res = await API.put(`/users/${editUser.id}`, {
                name: editUser.name,
                email: editUser.email,
                role: editUser.role
            });
            if (res.data.success) {
                toast.success("User updated successfully", { id: loadToast });
                setEditUser(null);
                fetchUsers();
            }
        } catch (error) {
            toast.error("Failed to update user", { id: loadToast });
        }
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div className="page-title">
                        <h1 style={{ margin: 0 }}>All System Users</h1>
                        <p style={{ margin: '4px 0 0 0' }}>Manage all accounts in the system</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {selectedIds.size > 0 && (
                            <button 
                                onClick={handleDeleteSelected}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                            >
                                <Trash2 size={18} />
                                Delete Selected ({selectedIds.size})
                            </button>
                        )}
                        <button 
                            onClick={handleClearAll}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                        >
                            <AlertCircle size={18} />
                            Clear All Users
                        </button>
                    </div>
                </div>

                {/* Edit Modal / Form overlay */}
                {editUser && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div className="form-card" style={{ width: '450px', background: 'white', padding: '30px', borderRadius: '20px' }}>
                            <h2 style={{ marginBottom: '20px' }}>Edit User</h2>
                            <form onSubmit={handleUpdate}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={editUser.name} 
                                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        value={editUser.email} 
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '25px' }}>
                                    <label>Role</label>
                                    <select 
                                        value={editUser.role} 
                                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="staff">Staff</option>
                                        <option value="user">User (Patient)</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setEditUser(null)} className="cancel-btn" style={{ padding: '8px 20px', border: 'none', background: '#f3f4f6', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="save-btn" style={{ padding: '8px 20px', background: '#0fb48c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="table-card" style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div className="table-toolbar" style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
                        <div className="inner-search" style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px' }}>
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search by name, email or role..." style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '14px', outline: 'none' }} />
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
                                            checked={selectedIds.size === users.filter(u => u.id !== currentUser.id).length && users.length > 0}
                                        />
                                    </th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>User Info</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Role</th>
                                    <th style={{ padding: '16px', textAlign: 'left' }}>Joined Date</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', background: selectedIds.has(user.id) ? '#f0f9ff' : 'transparent' }}>
                                        <td style={{ padding: '16px', textAlign: 'left' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.has(user.id)}
                                                onChange={() => handleSelectOne(user.id)}
                                                disabled={user.id === currentUser.id}
                                            />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ 
                                                    background: user.role === 'admin' ? '#fee2e2' : user.role === 'doctor' ? '#e0f2fe' : '#f0fdf4', 
                                                    color: user.role === 'admin' ? '#ef4444' : user.role === 'doctor' ? '#0ea5e9' : '#22c55e', 
                                                    padding: '10px', 
                                                    borderRadius: '12px' 
                                                }}>
                                                    <UsersIcon size={20} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{user.name} {user.id === currentUser.id && <span style={{ fontSize: '10px', color: '#0fb48c' }}>(You)</span>}</p>
                                                    <span style={{ fontSize: '12px', color: '#64748b' }}>ID: {user.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#64748b' }}>{user.email}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ 
                                                textTransform: 'capitalize', 
                                                fontWeight: '700',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                background: user.role === 'admin' ? '#fff1f2' : user.role === 'doctor' ? '#f0f9ff' : '#f0fdf4',
                                                color: user.role === 'admin' ? '#e11d48' : user.role === 'doctor' ? '#0284c7' : '#16a34a'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: '#64748b' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    style={{ border: 'none', background: '#f1f5f9', color: '#6366f1', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                                                    onClick={() => setEditUser(user)}
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={user.id === currentUser.id}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                                            {loading ? "Loading users data..." : "No matching users found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Total Users: <strong>{users.length}</strong></span>
                        {selectedIds.size > 0 && <span style={{ fontSize: '13px', color: '#0fb48c', fontWeight: '700' }}>{selectedIds.size} users selected</span>}
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
