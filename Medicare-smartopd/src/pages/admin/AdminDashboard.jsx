import AdminLayout from "../../layouts/AdminLayout";
import {
    Users,
    CalendarCheck,
    UserPlus,
    DollarSign,
    TrendingUp,
    Activity,
    Clock,
    ArrowUpRight,
    Plus
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from "recharts";
import { Link } from "react-router-dom";
import "../../styles/adminDashboard.css";

const weeklyData = [
    { name: 'Mon', count: 45 },
    { name: 'Tue', count: 52 },
    { name: 'Wed', count: 38 },
    { name: 'Thu', count: 65 },
    { name: 'Fri', count: 48 },
    { name: 'Sat', count: 30 },
    { name: 'Sun', count: 20 },
];

const trendData = [
    { name: '9AM', count: 12 },
    { name: '11AM', count: 25 },
    { name: '1PM', count: 18 },
    { name: '3PM', count: 32 },
    { name: '5PM', count: 24 },
    { name: '7PM', count: 15 },
];

export default function AdminDashboard() {
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

                {/* Stats Grid - High Visual Impact */}
                <div className="stats-grid" style={{ gap: '24px', marginBottom: '32px' }}>
                    <div className="stat-card" style={{ padding: '24px' }}>
                        <div className="stat-info">
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Total Patients</span>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>1,280</h2>
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
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Appointments</span>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>42</h2>
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
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>18</h2>
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
                            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>₹4,250</h2>
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
                    {/* Main Chart Card */}
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

                    {/* Quick Actions / Status Card */}
                    <div className="chart-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Quick Stats</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0fb48c' }}></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>Consultation</p>
                                    <p style={{ fontWeight: 700 }}>75% Capacity</p>
                                </div>
                            </div>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>Lab Tests</p>
                                    <p style={{ fontWeight: 700 }}>12 Pending</p>
                                </div>
                            </div>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }}></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>Pharmacy</p>
                                    <p style={{ fontWeight: 700 }}>Critical Stock (5)</p>
                                </div>
                            </div>
                        </div>
                        <button className="add-btn" style={{ width: '100%', marginTop: 'auto', padding: '14px' }}>
                            View Full Report
                        </button>
                    </div>
                </div>

                {/* Recent Activities Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="chart-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Upcoming Appointments</h3>
                            <Link to="/admin/appointments" style={{ fontSize: '13px', color: '#0fb48c', textDecoration: 'none', fontWeight: 600 }}>See All</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { name: 'Sarah Jenkins', time: '10:30 AM', doc: 'Dr. Smith', type: 'Checkup' },
                                { name: 'Michael Ross', time: '11:15 AM', doc: 'Dr. Ross', type: 'Follow-up' },
                                { name: 'Emily Blunt', time: '12:00 PM', doc: 'Dr. Smith', type: 'Consultation' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748b' }}>
                                        {item.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700, fontSize: '15px' }}>{item.name}</p>
                                        <p style={{ fontSize: '13px', color: '#64748b' }}>{item.doc} • {item.type}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 700, color: '#0fb48c', fontSize: '14px' }}>{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chart-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>System Activity</h3>
                            <Activity size={18} color="#64748b" />
                        </div>
                        <div className="activity-list" style={{ marginLeft: '12px', borderLeft: '2px solid #f1f5f9', paddingLeft: '24px', position: 'relative' }}>
                            {[
                                { text: 'Prescription issued #9021', time: '5m ago', color: '#0fb48c' },
                                { text: 'New Doctor registered', time: '1h ago', color: '#3b82f6' },
                                { text: 'Emergency alert in Ward 4', time: '2h ago', color: '#ef4444' }
                            ].map((act, i) => (
                                <div key={i} style={{ marginBottom: '24px', position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '-31px',
                                        top: '4px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        border: `3px solid ${act.color}`
                                    }}></div>
                                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{act.text}</p>
                                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>{act.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
