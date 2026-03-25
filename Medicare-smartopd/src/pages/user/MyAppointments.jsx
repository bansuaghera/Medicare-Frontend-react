import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";

export default function MyAppointments() {
    const navigate = useNavigate();
    const appointments = [
        {
            doctor: "Dr. Ramesh Sharma",
            specialty: "Cardiology",
            date: "2024-02-15",
            time: "10:00 AM",
            room: "Room 101",
            status: "Confirmed",
            statusColor: "var(--text-primary)", // The pill background is white-ish, text is dark
            statusBg: "transparent",
            actionable: true,
        },
        {
            doctor: "Dr. Anjali Gupta",
            specialty: "Pediatrics",
            date: "2024-02-20",
            time: "02:00 PM",
            room: "Room 102",
            status: "Confirmed",
            statusColor: "var(--text-primary)",
            statusBg: "transparent",
            actionable: true,
        },
        {
            doctor: "Dr. Amit Patel",
            specialty: "Dermatology",
            date: "2024-02-10",
            time: "09:00 AM",
            room: "Room 103",
            status: "Completed",
            statusColor: "var(--text-tertiary)",
            statusBg: "var(--bg-quaternary)", // light gray pill
            actionable: false,
        }
    ];

    const [searchTerm, setSearchTerm] = useState("");

    const filteredAppointments = appointments.filter(apt => 
        apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>My Appointments</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: '0 0 16px 0' }}>View and manage your appointments</p>
                    
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by doctor or status..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px' }} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredAppointments.length > 0 ? filteredAppointments.map((apt, index) => (
                        <div key={index} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{apt.doctor}</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>{apt.specialty}</p>
                                </div>
                                <div>
                                    <span style={{ background: apt.statusBg, color: apt.statusColor, padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-block' }}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '48px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
                                    <Calendar size={18} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{apt.date}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
                                    <Clock size={18} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{apt.time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
                                    <MapPin size={18} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{apt.room}</span>
                                </div>
                            </div>
                            
                            {apt.actionable && (
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button onClick={() => { alert('Redirecting to reschedule...'); navigate('/user/book-appointment'); }} style={{ background: 'var(--bg-quaternary)', color: 'var(--text-tertiary)', padding: '10px 24px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                                        Reschedule
                                    </button>
                                    <button onClick={() => alert('Appointment successfully cancelled.')} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 24px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            No appointments found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
