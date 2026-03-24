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
        { id: 1, name: "Kavita Joshi", role: "Receptionist", shift: "Morning", phone: "+91 98765-43210", email: "kavita.j@hospital.com", status: "Active" },
        { id: 2, name: "Deepak Kumar", role: "Nurse", shift: "Night", phone: "+91 98765-43211", email: "deepak.k@hospital.com", status: "Active" },
        { id: 3, name: "Neha Reddy", role: "Lab Technician", shift: "Morning", phone: "+91 98765-43212", email: "neha.r@hospital.com", status: "Active" },
        { id: 4, name: "Sanjay Verma", role: "Pharmacist", shift: "Evening", phone: "+91 98765-43213", email: "sanjay.v@hospital.com", status: "On Leave" },
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
