import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Eye,
    Edit3,
    Trash2,
    Users as UsersIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null); // State for the user being edited

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This will remove all associated profile data.")) {
            const loadToast = toast.loading("Deleting user...");
            try {
                const res = await API.delete(`/users/${id}`);
                if (res.data.success) {
                    toast.success("User deleted successfully", { id: loadToast });
                    fetchUsers();
                }
            } catch (error) {
                toast.error("Failed to delete user", { id: loadToast });
            }
        }
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

                <div className="page-header">
                    <div className="page-title">
                        <h1>All System Users</h1>
                        <p>Manage all accounts in the system</p>
                    </div>
                </div>

                {/* Edit Modal / Form overlay */}
                {editUser && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div className="form-card" style={{ width: '450px', background: 'white', padding: '30px' }}>
                            <h2 style={{ marginBottom: '20px' }}>Edit User</h2>
                            <form onSubmit={handleUpdate}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={editUser.name} 
                                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        value={editUser.email} 
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '25px' }}>
                                    <label>Role</label>
                                    <select 
                                        value={editUser.role} 
                                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                        required
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="staff">Staff</option>
                                        <option value="user">User (Patient)</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setEditUser(null)} className="cancel-btn" style={{ padding: '8px 20px' }}>Cancel</button>
                                    <button type="submit" className="save-btn" style={{ padding: '8px 20px', background: '#0fb48c', color: 'white', border: 'none', borderRadius: '8px' }}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="inner-search">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search users by name, email or role..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ 
                                                    background: user.role === 'admin' ? '#fee2e2' : user.role === 'doctor' ? '#e0f2fe' : '#f0fdf4', 
                                                    color: user.role === 'admin' ? '#ef4444' : user.role === 'doctor' ? '#0ea5e9' : '#22c55e', 
                                                    padding: '8px', 
                                                    borderRadius: '8px' 
                                                }}>
                                                    <UsersIcon size={18} />
                                                </div>
                                                <span className="patient-name">{user.name}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span style={{ 
                                                textTransform: 'capitalize', 
                                                fontWeight: '600',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                background: '#f1f5f9'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.createdAt?.split("T")[0]}</td>
                                        <td>
                                            <span className="status-badge active">Active</span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button 
                                                    className="action-btn" 
                                                    onClick={() => setEditUser(user)}
                                                    title="Edit User"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    className="action-btn delete" 
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                            {loading ? "Loading users..." : "No users found"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Showing {users.length} results</span>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
