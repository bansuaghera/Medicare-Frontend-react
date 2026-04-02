import React, { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import {
    Calendar,
    User,
    CheckCircle,
    Clock,
    Plus,
    Search,
    UserCircle2
} from "lucide-react";

import API from "../../api/axiosConfig";
import "../../styles/adminDashboard.css";

import UserQuickActions from "../../components/user/UserQuickActions";
import UserUpcomingAppointments from "../../components/user/UserUpcomingAppointments";

export default function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        upcoming: 0,
        totalVisits: 0,
        prescriptions: 0,
        lastVisit: '---'
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user.id) return;
            try {
                // Fetch dynamic stats for this user
                const [statsRes, appointmentsRes] = await Promise.all([
                    API.get(`/users/dashboard/stats?role=user&userId=${user.id}`),
                    API.get(`/appointments/patient/${user.id}`)
                ]);

                if (statsRes.data.success) {
                    const data = statsRes.data.data;
                    setStats({
                        upcoming: data.myUpcomingAppointments || 0,
                        totalVisits: data.myUpcomingAppointments || 0,
                        prescriptions: data.myPrescriptionsCount || 0,
                        lastVisit: data.lastVisit || '---'
                    });
                }

                if (appointmentsRes.data.success) {
                    setAppointments(appointmentsRes.data.data.map(app => ({
                        doctor: app.Doctor?.name || "Dr. Unassigned",
                        specialty: "General",
                        date: app.date,
                        time: app.time,
                        iconBg: "#f3e8ff",
                        iconColor: "#a855f7"
                    })));
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user.id]);

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Welcome Back, {user.name || "User"}!</h1>
                    <p style={{ fontSize: '15px' }}>Here's your health dashboard overview</p>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>

                    {/* Card 1 */}
                    <div className="stat-card">
                        <p>Upcoming Appointments</p>
                        <h2>{stats.upcoming}</h2>
                        <Calendar size={24} />
                    </div>

                    {/* Card 2 */}
                    <div className="stat-card">
                        <p>Total Visits</p>
                        <h2>{stats.totalVisits}</h2>
                        <User size={24} />
                    </div>

                    {/* Card 3 */}
                    <div className="stat-card">
                        <p>Prescriptions</p>
                        <h2>{stats.prescriptions}</h2>
                        <CheckCircle size={24} />
                    </div>

                    {/* Card 4 */}
                    <div className="stat-card">
                        <p>Last Activity</p>
                        <h2>{stats.lastVisit}</h2>
                        <Clock size={24} />
                    </div>

                </div>

                {/* Main Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '24px'
                }}>

                    {/* Use Components (BEST PRACTICE) */}
                    <UserQuickActions />
                    <UserUpcomingAppointments appointments={appointments} />

                </div>

            </div>
        </UserLayout>
    );
}