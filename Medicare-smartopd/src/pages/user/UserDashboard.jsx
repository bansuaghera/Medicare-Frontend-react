import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { Calendar, User, CheckCircle, Clock } from "lucide-react";
import "../../styles/adminDashboard.css";

import UserQuickActions from "../../components/user/UserQuickActions";
import UserUpcomingAppointments from "../../components/user/UserUpcomingAppointments";

export default function UserDashboard() {
    const appointments = [
        { doctor: "Dr. Ramesh Sharma", specialty: "Cardiology", date: "2024-02-15", time: "10:00 AM", iconBg: "#f3e8ff", iconColor: "#a855f7" },
        { doctor: "Dr. Anjali Gupta", specialty: "Pediatrics", date: "2024-02-20", time: "02:00 PM", iconBg: "#dbeafe", iconColor: "#3b82f6" }
    ];

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>Welcome Back, User!</h1>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>Here's your health dashboard</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div className="stat-card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Upcoming Appointments</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>2</h2>
                        </div>
                        <div style={{ background: '#d1fae5', color: '#10b981', padding: '12px', borderRadius: '12px' }}>
                            <Calendar size={24} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Total Visits</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>12</h2>
                        </div>
                        <div style={{ background: '#dbeafe', color: '#3b82f6', padding: '12px', borderRadius: '12px' }}>
                            <User size={24} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Prescriptions</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>8</h2>
                        </div>
                        <div style={{ background: '#f3e8ff', color: '#a855f7', padding: '12px', borderRadius: '12px' }}>
                            <CheckCircle size={24} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Last Visit</p>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>Feb 10</h2>
                        </div>
                        <div style={{ background: '#ffedd5', color: '#f97316', padding: '12px', borderRadius: '12px' }}>
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                    <UserQuickActions />
                    <UserUpcomingAppointments appointments={appointments} />
                </div>
            </div>
        </UserLayout>
    );
}
