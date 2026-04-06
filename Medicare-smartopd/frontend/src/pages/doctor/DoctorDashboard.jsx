import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Calendar, UserCircle, CheckCircle, Clock } from "lucide-react";
import API from "../../api/axiosConfig";
import StatCard from "../../components/common/StatCard";
import DoctorAppointmentsList from "../../components/doctor/DoctorAppointmentsList";
import DoctorQuickStats from "../../components/doctor/DoctorQuickStats";

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [stats, setStats] = useState({
        todayAppointments: 0,
        waitingPatients: 0,
        completed: 0,
        tomorrow: 0,
        totalPatients: 0,
        progress: 0
    });

    const fetchDashboardData = async () => {
        if (!user.id) return;
        try {
            // Fetch dynamic stats for this doctor
            const [statsRes, queueRes] = await Promise.all([
                API.get(`/users/dashboard/stats?role=doctor&userId=${user.id}`),
                API.get(`/appointments/queue/${user.id}`)
            ]);

            if (statsRes.data.success) {
                const data = statsRes.data.data;
                setStats(prev => ({
                    ...prev,
                    todayAppointments: data.myAppointmentsToday || 0,
                    completed: data.myCompleted || 0,
                    tomorrow: data.myTomorrow || 0,
                    totalPatients: data.myTotalPatients || 0,
                    progress: data.myProgress || 0
                }));
            }

            if (queueRes.data.success) {
                setAppointments(queueRes.data.data || []);
                setStats(prev => ({
                    ...prev,
                    waitingPatients: (queueRes.data.data || []).filter(a => a.status === 'pending').length
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
    }, [user.id]);

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Doctor Dashboard</h1>
                <p style={{ color: "#666" }}>Welcome back, Dr. {user.name || "Doctor"}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "2rem" }}>
                <StatCard title="Today's Appointments" value={stats.todayAppointments.toString()} icon={Calendar} iconBg="#e8fdf5" iconColor="#0fb48c" />
                <StatCard title="Waiting Patients" value={stats.waitingPatients.toString()} icon={UserCircle} iconBg="#ebf2fc" iconColor="#4589f5" />
                <StatCard title="Completed" value={stats.completed.toString()} icon={CheckCircle} iconBg="#f2e8fd" iconColor="#b645f5" />
                <StatCard title="Tomorrow" value={stats.tomorrow.toString()} icon={Clock} iconBg="#fff8ed" iconColor="#f5a445" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
                <DoctorAppointmentsList 
                    appointments={appointments.map(app => ({
                        id: app.id,
                        time: app.time,
                        patient: app.Patient?.name || 'Unknown',
                        type: app.reason || "Checkup",
                        token: app.tokenNumber,
                        status: app.status || "pending",
                        isEmergency: app.isEmergency
                    }))} 
                    onAppointmentsChange={fetchDashboardData}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <DoctorQuickStats total={stats.totalPatients} avgTime="—" prescriptions={stats.completed} progress={stats.progress} />
                </div>
            </div>
        </DoctorLayout>
    );
}
