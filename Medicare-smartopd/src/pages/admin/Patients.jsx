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

export default function Patients() {
    const [patients, setPatients] = useState([
        { id: 1, name: "John Smith", age: 45, gender: "Male", phone: "+1 234-567-8900", lastVisit: "2024-02-10", status: "Active" },
        { id: 2, name: "Sarah Johnson", age: 32, gender: "Female", phone: "+1 234-567-8901", lastVisit: "2024-02-09", status: "Active" },
        { id: 3, name: "Michael Chen", age: 58, gender: "Male", phone: "+1 234-567-8902", lastVisit: "2024-01-28", status: "Inactive" },
        { id: 4, name: "Emily Davis", age: 28, gender: "Female", phone: "+1 234-567-8903", lastVisit: "2024-02-11", status: "Active" },
        { id: 5, name: "Robert Wilson", age: 41, gender: "Male", phone: "+1 234-567-8904", lastVisit: "2024-02-08", status: "Active" },
    ]);

    const toggleStatus = (id) => {
        setPatients(prev => prev.map(p =>
            p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
        ));
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>Patients</h1>
                        <p>Manage patient records</p>
                    </div>
                    <Link to="/admin/patients/add" className="add-btn">
                        <Plus size={20} />
                        <span>Add Patient</span>
                    </Link>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="inner-search">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search patients..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Phone</th>
                                    <th>Last Visit</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.id}>
                                        <td>{patient.id}</td>
                                        <td className="patient-name">{patient.name}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.phone}</td>
                                        <td>{patient.lastVisit}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${patient.status.toLowerCase()}`}
                                                onClick={() => toggleStatus(patient.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {patient.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <Link to="/admin/profile" className="action-btn" title="View Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to="/admin/patients/add?mode=edit" className="action-btn">
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
                        <span>Showing {patients.length} results</span>
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
