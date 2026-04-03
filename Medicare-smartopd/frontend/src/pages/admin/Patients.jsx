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

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await API.get("/users/patients");
                if (res.data.success) {
                    setPatients(res.data.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        age: p.Patient?.age || 0,
                        gender: p.Patient?.gender || "other",
                        phone: p.Patient?.phone || "N/A",
                        lastVisit: p.updatedAt?.split("T")[0] || "N/A",
                        status: "Active"
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const toggleStatus = (id) => {
        toast.success("Patient status updated");
        setPatients(prev => prev.map(p =>
            p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
        ));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this patient?")) {
            const loadToast = toast.loading("Deleting patient record...");
            try {
                const res = await API.delete(`/users/${id}`);
                if (res.data.success) {
                    toast.success("Patient records deleted successfully", { id: loadToast });
                    setPatients(prev => prev.filter(p => p.id !== id));
                }
            } catch (error) {
                toast.error("Failed to delete patient", { id: loadToast });
            }
        }
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
                                                <Link to={`/admin/profile/${patient.id}`} className="action-btn" title="View Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to="/admin/patients/add?mode=edit" className="action-btn">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button 
                                                    className="action-btn delete" 
                                                    onClick={() => handleDelete(patient.id)}
                                                    title="Delete Patient"
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
