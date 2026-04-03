import { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function MyAppointments() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAppointments = async () => {
        if (!user.id) return;
        try {
            // Use dedicated patient appointments endpoint
            const res = await API.get(`/appointments/patient/${user.id}`);
            if (res.data.success) {
                const myApts = res.data.data.map(app => ({
                    id: app.id,
                    token: app.tokenNumber,
                    doctor: app.Doctor?.name || "Unassigned",
                    specialty: app.Doctor?.Doctor?.specialization || "General",
                    date: app.date,
                    time: app.time,
                    reason: app.reason || "Checkup",
                    status: app.status || "pending",
                    actionable: app.status === "pending" || app.status === "in-progress"
                }));
                setAppointments(myApts);
            }
        } catch (error) {
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user.id]);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            const loadToast = toast.loading("Cancelling appointment...");
            try {
                await API.put(`/appointments/${id}/status`, { status: 'cancelled' });
                toast.success("Appointment cancelled", { id: loadToast });
                fetchAppointments();
            } catch (error) {
                toast.error("Failed to cancel", { id: loadToast });
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'in-progress': return { background: '#dbeafe', color: '#1d4ed8', label: 'In Progress' };
            case 'completed': return { background: '#dcfce7', color: '#166534', label: 'Completed' };
            case 'cancelled': return { background: '#fee2e2', color: '#ef4444', label: 'Cancelled' };
            default: return { background: '#fef9c3', color: '#a16207', label: 'Pending' };
        }
    };

    const filteredAppointments = appointments.filter(apt => 
        apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>My Appointments</h1>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 16px 0' }}>View and manage your appointments</p>
                    
                    <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Search by doctor or status..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading your appointments...</p>
                    ) : filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                        <div key={apt.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px' }}>TOKEN #{apt.token}</div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Dr. {apt.doctor}</h3>
                                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{apt.specialty} • {apt.reason}</p>
                                </div>
                                <span style={{ ...(getStatusStyle(apt.status)), padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                                    {getStatusStyle(apt.status).label}
                                </span>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '40px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                                    <Calendar size={18} style={{ color: '#0fb48c' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{apt.date}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                                    <Clock size={18} style={{ color: '#0fb48c' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{apt.time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                                    <MapPin size={18} style={{ color: '#0fb48c' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{apt.room}</span>
                                </div>
                            </div>
                            
                            {apt.actionable && (
                                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                                    <button onClick={() => navigate('/user/book-appointment')} style={{ background: '#f1f5f9', color: '#475569', padding: '10px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                                        Reschedule
                                    </button>
                                    <button onClick={() => handleCancel(apt.id)} style={{ background: '#fef2f2', color: '#ef4444', padding: '10px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                                        Cancel Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '64px', color: '#64748b', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                            <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <p style={{ fontSize: '16px' }}>No appointments found matching your search</p>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
