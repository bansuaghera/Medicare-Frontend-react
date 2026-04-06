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
    UserCircle2,
    Activity,
    Pill,
    Droplets,
    HeartPulse,
    Thermometer,
    Scale,
    AlertCircle
} from "lucide-react";

import API from "../../api/axiosConfig";
import "../../styles/adminDashboard.css";

import UserQuickActions from "../../components/user/UserQuickActions";
import UserUpcomingAppointments from "../../components/user/UserUpcomingAppointments";
import StatCard from "../../components/common/StatCard";

export default function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [isExample, setIsExample] = useState(false);
    const [stats, setStats] = useState({
        upcoming: 0,
        totalVisits: 0,
        prescriptions: 0,
        lastVisit: '---',
        bloodGroup: '---',
        medicalHistory: '---',
        latestVitals: null,
        latestMedicines: [],
        latestDiagnosis: null
    });

    const DUMMY_STATS = {
        upcoming: 1,
        totalVisits: 3,
        prescriptions: 2,
        lastVisit: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
        bloodGroup: 'O+',
        medicalHistory: 'Mild Asthma',
        latestVitals: { heartRate: "72 bpm", bp: "120/80", temp: "98.6°F", weight: "70 kg" },
        latestMedicines: [
            { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily after meals" },
            { name: "Amoxicillin", dosage: "250mg", frequency: "Thrice daily" }
        ],
        latestDiagnosis: "Common Cold & Seasonal Allergy"
    };

    const DUMMY_APPOINTMENTS = [
        {
            id: 'dummy-1',
            doctor: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            date: "Next Monday",
            time: "10:30 AM",
            iconBg: "#f3e8ff",
            iconColor: "#a855f7"
        }
    ];

    const fetchDashboardData = async () => {
        if (!user.id) return;
        try {
            const [statsRes, appointmentsRes, activitiesRes] = await Promise.all([
                API.get(`/users/dashboard/stats?role=user&userId=${user.id}`),
                API.get(`/appointments/patient/${user.id}`),
                API.get(`/activities/recent/${user.id}?limit=5`)
            ]);

            let hasRealData = false;

            if (statsRes.data.success) {
                const data = statsRes.data.data;
                // If user has visits or appointments, it's real data
                if (data.myTotalVisits > 0 || data.myUpcomingAppointments > 0) {
                    hasRealData = true;
                    setStats({
                        upcoming: data.myUpcomingAppointments || 0,
                        totalVisits: data.myTotalVisits || 0,
                        prescriptions: data.myPrescriptionsCount || 0,
                        lastVisit: data.lastVisit || '---',
                        bloodGroup: data.bloodGroup || '---',
                        medicalHistory: data.medicalHistory || '---',
                        latestVitals: data.latestVitals,
                        latestMedicines: data.latestMedicines || [],
                        latestDiagnosis: data.latestDiagnosis
                    });
                }
            }

            if (appointmentsRes.data.success && appointmentsRes.data.data.length > 0) {
                hasRealData = true;
                const activeApts = appointmentsRes.data.data
                    .filter(app => ['pending', 'in-progress'].includes(app.status))
                    .map((app) => ({
                        id: app.id,
                        doctor: app.Doctor?.name || "Dr. Unassigned",
                        specialty: app.Doctor?.Doctor?.specialization || "General",
                        date: app.date,
                        time: app.time,
                        iconBg: "#f3e8ff",
                        iconColor: "#a855f7"
                    }));
                setAppointments(activeApts);
            }

            // Fallback to Dummy if no data
            if (!hasRealData) {
                setIsExample(true);
                setStats(DUMMY_STATS);
                setAppointments(DUMMY_APPOINTMENTS);
            } else {
                setIsExample(false);
            }

            if (activitiesRes.data && activitiesRes.data.length > 0) {
                setActivities(activitiesRes.data);
            } else if (!hasRealData) {
                setActivities([{ id: 'd-act', description: 'Welcome to Medicare! Your account is active.', createdAt: new Date() }]);
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

    const getVitalIcon = (key) => {
        switch(key.toLowerCase()) {
            case 'bp': return <Activity size={18} color="#ef4444" />;
            case 'heartrate': return <HeartPulse size={18} color="#ef4444" />;
            case 'temp': return <Thermometer size={18} color="#f59e0b" />;
            case 'weight': return <Scale size={18} color="#6366f1" />;
            default: return <Droplets size={18} color="#0fb48c" />;
        }
    };

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>

                {/* Welcome Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Welcome Back, {user.name || "User"}!</h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>
                            {isExample ? "Take a look at an example of your health dashboard below." : "Keep track of your health updates and appointments"}
                        </p>
                    </div>
                    {isExample && (
                        <div style={{ background: '#fef3c7', color: '#b45309', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} />
                            Viewing Example Profile
                        </div>
                    )}
                    {!isExample && stats.bloodGroup !== '---' && (
                        <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fecaca' }}>
                            <Droplets size={20} fill="#ef4444" />
                            <span style={{ fontWeight: '800', fontSize: '14px' }}>Blood Group: {stats.bloodGroup}</span>
                        </div>
                    )}
                </div>

                {/* Primary Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <StatCard title="Upcoming Appointments" value={stats.upcoming.toString()} icon={Calendar} iconBg="var(--pill-success-bg)" iconColor="var(--pill-success-text)" />
                    <StatCard title="Total Visits" value={stats.totalVisits.toString()} icon={User} iconBg="var(--pill-info-bg)" iconColor="var(--pill-info-text)" />
                    <StatCard title="Prescriptions" value={stats.prescriptions.toString()} icon={CheckCircle} iconBg="var(--pill-purple-bg)" iconColor="var(--pill-purple-text)" />
                    <StatCard 
                        title="Last Visit Date" 
                        value={stats.lastVisit !== '---' && stats.lastVisit ? new Date(stats.lastVisit).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '---'} 
                        icon={Clock} 
                        iconBg="var(--pill-orange-bg)" 
                        iconColor="var(--pill-orange-text)" 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    {/* Left Column: Health Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Health Snapshot Card */}
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: '0 4px 6px -1px var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '18px', fontWeight: '700' }}>
                                    <HeartPulse size={20} color="#0fb48c" />
                                    Latest Health Snapshot
                                </h3>
                                {stats.latestDiagnosis && (
                                    <span style={{ fontSize: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                                        Diagnosis: {stats.latestDiagnosis}
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                                {stats.latestVitals ? Object.entries(stats.latestVitals).map(([key, val]) => (
                                    <div key={key} style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '16px', textAlign: 'center', transition: 'transform 0.2s' }}>
                                        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{getVitalIcon(key)}</div>
                                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>{key}</p>
                                        <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{val}</p>
                                    </div>
                                )) : (
                                    <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-primary)', borderRadius: '12px' }}>
                                        No recent vitals available. Your next checkup vitals will appear here.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Appointments Component */}
                        <UserUpcomingAppointments appointments={appointments} onAppointmentsChange={fetchDashboardData} />
                    </div>

                    {/* Right Column: Medications & Activity */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Quick Actions */}
                        <UserQuickActions />

                        {/* Current Medications */}
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '24px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', fontSize: '17px', fontWeight: '700' }}>
                                <Pill size={18} color="#6366f1" />
                                Recent Medications
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {stats.latestMedicines.length > 0 ? stats.latestMedicines.slice(0, 3).map((med, i) => (
                                    <div key={i} style={{ padding: '12px', background: '#fefce8', borderRadius: '12px', border: '1px solid #fef08a' }}>
                                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>{med.name}</p>
                                        <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>{med.dosage} • {med.frequency}</p>
                                    </div>
                                )) : (
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, padding: '16px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                                        No active prescriptions found.
                                    </p>
                                )}
                                {stats.latestMedicines.length > 3 && (
                                    <Link to="/user/prescriptions" style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none', fontWeight: '600', textAlign: 'center' }}>+ View All Medications</Link>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity Mini Feed */}
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '24px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', fontSize: '17px', fontWeight: '700' }}>
                                <Activity size={18} color="#0fb48c" />
                                Recent Activity
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {activities.length > 0 ? activities.map((act) => (
                                    <div key={act.id} style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ paddingTop: '4px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0fb48c' }}></div>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 2px 0', fontWeight: '500' }}>{act.description}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ fontSize: '13px', textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>No recent activities</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </UserLayout>
    );
}