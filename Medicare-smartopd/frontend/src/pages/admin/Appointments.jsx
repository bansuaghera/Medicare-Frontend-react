import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Filter,
    Eye,
    MoreVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await API.get("/appointments");
                if (res.data.success) {
                    setAppointments(res.data.data.map(app => ({
                        id: app.id,
                        patient: app.Patient?.name || "Unknown",
                        doctor: app.Doctor?.name || "Assigning...",
                        date: app.date,
                        time: app.time,
                        type: app.reason || "Checkup",
                        token: app.tokenNumber,
                        status: app.status ? (app.status.charAt(0).toUpperCase() + app.status.slice(1)) : "Pending"
                    })));
                }
            } catch (error) {
                toast.error("Failed to load appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const toggleStatus = (id) => {
        const statusCycle = ["Pending", "Confirmed", "Cancelled"];
        setAppointments(prev => prev.map(a => {
            if (a.id === id) {
                const nextIdx = (statusCycle.indexOf(a.status) + 1) % statusCycle.length;
                const nextStatus = statusCycle[nextIdx];
                toast.success(`Appointment status updated to ${nextStatus}`);
                return { ...a, status: nextStatus };
            }
            return a;
        }));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Confirmed": return { background: "#e7f7f3", color: "#0fb48c" };
            case "Pending": return { background: "#fef9c3", color: "#a16207" };
            case "Cancelled": return { background: "#fee2e2", color: "#ef4444" };
            default: return {};
        }
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>Appointments</h1>
                        <p>Manage all appointments</p>
                    </div>
                    <button className="page-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="inner-search">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search appointments..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Token</th>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt) => (
                                    <tr key={appt.id}>
                                        <td style={{ fontSize: "12px", color: "#94a3b8" }}>{appt.id.slice(0, 8)}...</td>
                                        <td style={{ fontWeight: "700", color: "#0fb48c" }}>#{appt.token}</td>
                                        <td className="patient-name">{appt.patient}</td>
                                        <td>{appt.doctor}</td>
                                        <td>{appt.date}</td>
                                        <td>{appt.time}</td>
                                        <td>{appt.type}</td>
                                        <td>
                                            <span
                                                className="status-badge"
                                                style={{ ...getStatusStyle(appt.status), cursor: 'pointer' }}
                                                onClick={() => toggleStatus(appt.id)}
                                            >
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <Link to="/admin/profile" className="action-btn" title="View Patient Profile">
                                                    <Eye size={18} />
                                                </Link>
                                                <button className="action-btn"><MoreVertical size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Showing {appointments.length} results</span>
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
