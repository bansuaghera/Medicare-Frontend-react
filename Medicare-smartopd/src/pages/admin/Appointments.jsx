import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Filter,
    Eye,
    MoreVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/patients.css";

export default function Appointments() {
    const [appointments, setAppointments] = useState([
        { id: 1, patient: "John Smith", doctor: "Dr. Sarah Johnson", date: "2024-02-12", time: "10:00 AM", type: "Checkup", status: "Confirmed" },
        { id: 2, patient: "Sarah Johnson", doctor: "Dr. Michael Chen", date: "2024-02-12", time: "11:00 AM", type: "Consultation", status: "Pending" },
        { id: 3, patient: "Michael Chen", doctor: "Dr. Emily Davis", date: "2024-02-12", time: "02:00 PM", type: "Follow-up", status: "Confirmed" },
        { id: 4, patient: "Emily Davis", doctor: "Dr. Robert Wilson", date: "2024-02-13", time: "09:00 AM", type: "Emergency", status: "Cancelled" },
        { id: 5, patient: "Robert Wilson", doctor: "Dr. Sarah Johnson", date: "2024-02-13", time: "03:00 PM", type: "Checkup", status: "Confirmed" },
    ]);

    const toggleStatus = (id) => {
        const statusCycle = ["Pending", "Confirmed", "Cancelled"];
        setAppointments(prev => prev.map(a => {
            if (a.id === id) {
                const nextIdx = (statusCycle.indexOf(a.status) + 1) % statusCycle.length;
                return { ...a, status: statusCycle[nextIdx] };
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
                                        <td>{appt.id}</td>
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
