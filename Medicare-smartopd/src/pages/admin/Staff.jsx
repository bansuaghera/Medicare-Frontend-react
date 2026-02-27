import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    Search,
    Eye,
    Edit3,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/patients.css";

export default function Staff() {
    const [staffList, setStaffList] = useState([
        { id: 1, name: "Jennifer Lee", role: "Receptionist", shift: "Morning", phone: "+1 234-567-8900", email: "jennifer.l@hospital.com", status: "Active" },
        { id: 2, name: "David Brown", role: "Nurse", shift: "Night", phone: "+1 234-567-8901", email: "david.b@hospital.com", status: "Active" },
        { id: 3, name: "Lisa Anderson", role: "Lab Technician", shift: "Morning", phone: "+1 234-567-8902", email: "lisa.a@hospital.com", status: "Active" },
        { id: 4, name: "James Taylor", role: "Pharmacist", shift: "Evening", phone: "+1 234-567-8903", email: "james.t@hospital.com", status: "On Leave" },
    ]);

    const toggleStatus = (id) => {
        setStaffList(prev => prev.map(s =>
            s.id === id ? { ...s, status: s.status === "Active" ? "On Leave" : "Active" } : s
        ));
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
                                                <button className="action-btn delete"><Trash2 size={18} /></button>
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
