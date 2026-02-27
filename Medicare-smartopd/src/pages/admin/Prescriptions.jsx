import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Eye,
    Download,
    Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/patients.css";

export default function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([
        { id: 1, patient: "John Smith", doctor: "Dr. Sarah Johnson", date: "2024-02-12", medicines: 3, status: "Active" },
        { id: 2, patient: "Sarah Johnson", doctor: "Dr. Michael Chen", date: "2024-02-11", medicines: 2, status: "Completed" },
        { id: 3, patient: "Michael Chen", doctor: "Dr. Emily Davis", date: "2024-02-10", medicines: 4, status: "Active" },
        { id: 4, patient: "Emily Davis", doctor: "Dr. Robert Wilson", date: "2024-02-09", medicines: 5, status: "Completed" },
    ]);

    const toggleStatus = (id) => {
        setPrescriptions(prev => prev.map(p =>
            p.id === id ? { ...p, status: p.status === "Active" ? "Completed" : "Active" } : p
        ));
    };

    const getStatusStyle = (status) => {
        return status === "Active"
            ? { background: "#e7f7f3", color: "#0fb48c" }
            : { background: "#f1f5f9", color: "#94a3b8" };
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>Prescriptions</h1>
                        <p>View all prescriptions</p>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="inner-search">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search prescriptions..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Medicines</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptions.map((pres) => (
                                    <tr key={pres.id}>
                                        <td>{pres.id}</td>
                                        <td className="patient-name">{pres.patient}</td>
                                        <td>{pres.doctor}</td>
                                        <td>{pres.date}</td>
                                        <td style={{ fontWeight: 600 }}>{pres.medicines}</td>
                                        <td>
                                            <span
                                                className="status-badge"
                                                style={{ ...getStatusStyle(pres.status), cursor: 'pointer' }}
                                                onClick={() => toggleStatus(pres.id)}
                                            >
                                                {pres.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <Link to="/admin/prescriptions/detail" className="action-btn" title="View Prescription Details">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to="/admin/profile" className="action-btn" title="View Patient Profile" style={{ marginLeft: '8px' }}>
                                                    <Download size={18} style={{ display: 'none' }} /> {/* Just to maintain consistency */}
                                                    <Activity size={18} />
                                                </Link>
                                                <button className="action-btn"><Download size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Showing {prescriptions.length} results</span>
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
