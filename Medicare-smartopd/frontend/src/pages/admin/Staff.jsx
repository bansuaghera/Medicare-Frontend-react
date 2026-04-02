import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    Search,
    Eye,
    Edit3,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";

export default function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
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
        fetchStaff();
    }, []);

    const toggleStatus = (id) => {
        toast.success("Staff status updated");
        setStaffList(prev => prev.map(s =>
            s.id === id ? { ...s, status: s.status === "Active" ? "On Leave" : "Active" } : s
        ));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
            const loadToast = toast.loading("Deleting staff record...");
            try {
                const res = await API.delete(`/users/${id}`);
                if (res.data.success) {
                    toast.success("Staff member removed successfully", { id: loadToast });
                    setStaffList(prev => prev.filter(s => s.id !== id));
                }
            } catch (error) {
                toast.error("Failed to delete staff member", { id: loadToast });
            }
        }
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>Staff</h1>
                        <p>Manage staff members</p>
                    </div>
                    <Link to="/admin/staff/add" className="add-btn">
                        <Plus size={20} />
                        <span>Add Staff</span>
                    </Link>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="inner-search">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search staff..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Shift</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map((staff) => (
                                    <tr key={staff.id}>
                                        <td>{staff.id}</td>
                                        <td className="patient-name">{staff.name}</td>
                                        <td>{staff.role}</td>
                                        <td>{staff.shift}</td>
                                        <td>{staff.phone}</td>
                                        <td>{staff.email}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${staff.status === 'Active' ? 'active' : ''}`}
                                                onClick={() => toggleStatus(staff.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    ...(staff.status === 'On Leave' ? { background: '#fff7ed', color: '#ea580c' } : {})
                                                }}
                                            >
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <Link to="/admin/profile" className="action-btn" title="View Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to="/admin/staff/add?mode=edit" className="action-btn">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button 
                                                    className="action-btn delete" 
                                                    onClick={() => handleDelete(staff.id)}
                                                    title="Delete Staff"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Showing {staffList.length} results</span>
                        <div className="pagination-btns">
                            <button className="page-btn">Previous</button>
                            <button className="page-btn">Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
