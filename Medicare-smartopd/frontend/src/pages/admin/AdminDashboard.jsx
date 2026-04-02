import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    Users,
    CalendarCheck,
    UserPlus,
    DollarSign,
    ArrowUpRight,
    Plus
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";
import "../../styles/adminDashboard.css";

// Components
import SystemActivity from "../../components/admin/SystemActivity";
import AdminQuickStats from "../../components/admin/AdminQuickStats";
import AdminUpcomingAppointments from "../../components/admin/AdminUpcomingAppointments";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalAppointments: 0,
        onlineDoctors: 0,
        revenueToday: 0
    });
    const [weeklyData, setWeeklyData] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch dynamic stats from the database
                const [statsRes, appointmentsRes] = await Promise.all([
                    API.get("/users/dashboard/stats"),
                    API.get("/appointments").catch(() => ({ data: { data: [] } }))
                ]);

                if (statsRes.data.success) {
                    const data = statsRes.data.data;
                    setStats({
                        totalPatients: data.totalPatients,
                        onlineDoctors: data.totalDoctors,
                        totalAppointments: data.totalAppointments,
                        revenueToday: data.revenueToday
                    });
                    if (data.weeklyData) setWeeklyData(data.weeklyData);
                }
                
                setUpcomingAppointments(appointmentsRes.data.data?.slice(0, 5) || []);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            }
        };
        fetchDashboardData();
    }, []);

    const systemActivities = [
        { text: 'Prescription issued #9021', time: '5m ago', color: '#0fb48c' },
        { text: 'New Doctor registered', time: '1h ago', color: '#3b82f6' },
        { text: 'Emergency alert in Ward 4', time: '2h ago', color: '#ef4444' }
    ];

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="dashboard-page">
                <div className="page-header" style={{ marginBottom: '32px' }}>
                    <div className="page-title">
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Healthcare Dashboard</h1>
                        <p style={{ color: '#64748b', fontSize: '15px' }}>Good morning, Admin. Here's what's happening today.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/admin/appointments" className="add-btn" style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0' }}>
                            <CalendarCheck size={18} />
                            <span>View Schedule</span>
                        </Link>
                        <Link to="/admin/patients/add" className="add-btn">
                            <Plus size={18} />
                            <span>New Entry</span>
                        </Link>
                    </div>
                </div>

                <div className="stats-grid" style={{ gap: '24px', marginBottom: '32px' }}>
                    <div className="stat-card" style={{ padding: '24px' }}>
                        <div className="stat-info">
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Total Patients</span>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>{stats.totalPatients}</h2>
                            <div className="stat-trend up" style={{ color: '#0fb48c', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                                <ArrowUpRight size={14} /> +12.5%
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#e7f7f3', color: '#0fb48c', width: '60px', height: '60px', borderRadius: '16px' }}>
                            <Users size={28} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px' }}>
                        <div className="stat-info">
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Appointments Today</span>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>{stats.totalAppointments}</h2>
                            <div className="stat-trend up" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                                <ArrowUpRight size={14} /> +8.2%
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#eff6ff', color: '#3b82f6', width: '60px', height: '60px', borderRadius: '16px' }}>
                            <CalendarCheck size={28} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px' }}>
                        <div className="stat-info">
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Online Doctors</span>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>{stats.onlineDoctors}</h2>
                            <div className="stat-trend" style={{ color: '#ea580c', fontSize: '13px', fontWeight: 700 }}>
                                Active Duty
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#fff7ed', color: '#ea580c', width: '60px', height: '60px', borderRadius: '16px' }}>
                            <UserPlus size={28} />
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '24px' }}>
                        <div className="stat-info">
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Revenue Today</span>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>₹{stats.revenueToday}</h2>
                            <div className="stat-trend up" style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                                <ArrowUpRight size={14} /> +15.3%
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#f5f3ff', color: '#8b5cf6', width: '60px', height: '60px', borderRadius: '16px' }}>
                            <DollarSign size={28} />
                        </div>
                    </div>
                </div>

                <div className="charts-grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    <div className="chart-card" style={{ padding: '24px' }}>
                        <div className="chart-header" style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Patient Traffic Analysis</h3>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>Weekly frequency of patients visiting</p>
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0fb48c" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#0fb48c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
                                    <Area type="monotone" dataKey="count" stroke="#0fb48c" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <AdminQuickStats stats={stats} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {upcomingAppointments.length > 0 ? (
                        <AdminUpcomingAppointments appointments={upcomingAppointments.map(app => ({
                            name: app.Patient?.name || 'Unknown',
                            time: app.time,
                            doc: app.Doctor?.name || "Assigning...",
                            type: app.reason || "Checkup"
                        }))} />
                    ) : (
                        <div className="info-card">No appointments yet</div>
                    )}
                    <SystemActivity activities={systemActivities} />
                </div>
            </div>
        </AdminLayout>
    );
}
