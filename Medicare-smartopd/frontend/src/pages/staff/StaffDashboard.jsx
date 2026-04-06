import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { UserPlus, Calendar, CreditCard, Clock, FileText } from "lucide-react";
import API from "../../api/axiosConfig";
import StatCard from "../../components/common/StatCard";
import StaffQuickActions from "../../components/staff/StaffQuickActions";
import TodayAppointments from "../../components/staff/TodayAppointments";
import toast from "react-hot-toast";

export default function StaffDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayAppointments: 0,
        activeTokens: 0,
        newPatients: 0,
        scheduledTomorrow: 0
    });

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/appointments/${id}/status`, { status });
            setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
            toast.success(`Status updated to ${status}`);
            setStats(prev => ({
                ...prev,
                activeTokens: prev.activeTokens + (status === 'pending' ? 1 : status === 'completed' ? -1 : 0)
            }));
        } catch (error) {
            console.error('Failed to update appointment status', error);
            toast.error('Failed to update appointment status');
        }
    };

    const fetchDashboardData = async () => {
        try {
            const [statsRes, appointmentsRes] = await Promise.all([
                API.get("/users/dashboard/stats"),
                API.get("/appointments")
            ]);

            if (statsRes.data.success) {
                const data = statsRes.data.data;
                setStats(prev => ({
                    ...prev,
                    todayAppointments: data.totalAppointments || 0,
                    newPatients: data.totalPatients || 0,
                    scheduledTomorrow: 0
                }));
            }

            if (appointmentsRes.data.success) {
                setAppointments(appointmentsRes.data.data || []);
                setStats(prev => ({
                    ...prev,
                    activeTokens: (appointmentsRes.data.data || []).filter(a => a.status === 'pending').length
                }));
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div className="dashboard-header-section" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Staff Dashboard</h1>
                <p style={{ color: "#666" }}>Welcome back! Here's today's overview</p>
            </div>

            <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "2rem" }}>
                <StatCard title="Today's Appointments" value={stats.todayAppointments.toString()} icon={Calendar} iconBg="#e8fdf5" iconColor="#0fb48c" />
                <StatCard title="Active Tokens" value={stats.activeTokens.toString()} icon={CreditCard} iconBg="#ebf2fc" iconColor="#4589f5" />
                <StatCard title="Total Patients" value={stats.newPatients.toString()} icon={UserPlus} iconBg="#faf1fd" iconColor="#b645f5" />
                <StatCard title="Scheduled Tomorrow" value={stats.scheduledTomorrow.toString()} icon={Clock} iconBg="#fff8ed" iconColor="#f5a445" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
                <StaffQuickActions />
                <TodayAppointments
                    appointments={appointments.map(app => ({
                        id: app.id,
                        time: app.time,
                        patient: app.Patient?.name || 'Unknown',
                        doctor: app.Doctor?.name || 'Assigning...',
                        token: app.tokenNumber,
                        status: app.status || 'pending'
                    }))}
                    onStatusChange={handleStatusUpdate}
                    onAppointmentsChange={fetchDashboardData}
                    enableStatusEdit={true}
                />
            </div>
        </StaffLayout>
    );
}

