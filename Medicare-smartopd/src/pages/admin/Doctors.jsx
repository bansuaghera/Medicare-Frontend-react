import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    Search,
    Eye,
    Edit3,
    Trash2,
    Stethoscope
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/patients.css";

export default function Doctors() {
    const [doctors, setDoctors] = useState([
        { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", phone: "+1 234-567-8900", email: "sarah.j@hospital.com", patients: 145, status: "Active" },
        { id: 2, name: "Dr. Michael Chen", specialty: "Pediatrics", phone: "+1 234-567-8901", email: "michael.c@hospital.com", patients: 132, status: "Active" },
        { id: 3, name: "Dr. Emily Davis", specialty: "Dermatology", phone: "+1 234-567-8902", email: "emly.d@hospital.com", patients: 98, status: "On Leave" },
        { id: 4, name: "Dr. Robert Wilson", specialty: "Orthopedics", phone: "+1 234-567-8903", email: "robert.w@hospital.com", patients: 156, status: "Active" },
    ]);

    const toggleStatus = (id) => {
        setDoctors(prev => prev.map(d =>
            d.id === id ? { ...d, status: d.status === "Active" ? "On Leave" : "Active" } : d
        ));
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>Doctors</h1>
                        <p>Manage doctor profiles</p>
                    </div>
                    <Link to="/admin/doctors/add" className="add-btn">
                        <Plus size={20} />
                        <span>Add Doctor</span>
                    </Link>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="inner-search">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search doctors..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Doctor Name</th>
                                    <th>Specialty</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Patients</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '8px', borderRadius: '8px' }}>
                                                    <Stethoscope size={18} />
                                                </div>
                                                <span className="patient-name">{doctor.name}</span>
                                            </div>
                                        </td>
                                        <td>{doctor.specialty}</td>
                                        <td>{doctor.phone}</td>
                                        <td>{doctor.email}</td>
                                        <td style={{ fontWeight: '600' }}>{doctor.patients}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${doctor.status === 'Active' ? 'active' : ''}`}
                                                onClick={() => toggleStatus(doctor.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    ...(doctor.status === 'On Leave' ? { background: '#fff7ed', color: '#ea580c' } : {})
                                                }}
                                            >
                                                {doctor.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <Link to="/admin/profile" className="action-btn" title="View Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to="/admin/doctors/add?mode=edit" className="action-btn">
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
                        <span>Showing {doctors.length} results</span>
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
