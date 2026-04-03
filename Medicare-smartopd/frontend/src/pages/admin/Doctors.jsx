import { useState, useEffect } from "react";
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
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await API.get("/users/doctors");
                if (res.data.success) {
                    setDoctors(res.data.data.map(doc => ({
                        id: doc.id,
                        name: doc.name,
                        specialty: doc.Doctor?.specialization || "General",
                        phone: doc.Doctor?.phone || "N/A",
                        email: doc.email,
                        patients: doc.Doctor?.experienceYears || 0, // Placeholder for patient count
                        status: doc.Doctor?.availabilityStatus || "Active"
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const toggleStatus = (id) => {
        // In real app, call API to update status
        toast.success("Doctor status updated", {
            duration: 2000,
            position: 'top-right'
        });
        setDoctors(prev => prev.map(d =>
            d.id === id ? { ...d, status: d.status === "Active" ? "On Leave" : "Active" } : d
        ));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            const loadToast = toast.loading("Deleting doctor record...");
            try {
                const res = await API.delete(`/users/${id}`);
                if (res.data.success) {
                    toast.success("Doctor deleted successfully", { id: loadToast });
                    setDoctors(prev => prev.filter(d => d.id !== id));
                }
            } catch (error) {
                toast.error("Failed to delete doctor", { id: loadToast });
            }
        }
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
                                                <Link to={`/admin/profile/${doctor.id}`} className="action-btn" title="View Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to="/admin/doctors/add?mode=edit" className="action-btn">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button 
                                                    className="action-btn delete" 
                                                    onClick={() => handleDelete(doctor.id)}
                                                    title="Delete Doctor"
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
