import AdminLayout from "../../layouts/AdminLayout";
import {
    Users,
    CalendarDays,
    DollarSign,
    ArrowUpRight,
    TrendingUp
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    AreaChart, Area
} from "recharts";
import "../../styles/adminDashboard.css";

const monthlyData = [
    { name: 'Jan', count: 420 },
    { name: 'Feb', count: 480 },
    { name: 'Mar', count: 380 },
    { name: 'Apr', count: 520 },
    { name: 'May', count: 450 },
    { name: 'Jun', count: 580 },
];

const deptData = [
    { name: 'Cardiology', value: 35 },
    { name: 'Pediatrics', value: 25 },
    { name: 'Dermatology', value: 20 },
    { name: 'Orthopedics', value: 20 },
];

const revenueTrend = [
    { name: 'Jan', value: 15000 },
    { name: 'Feb', value: 18000 },
    { name: 'Mar', value: 16000 },
    { name: 'Apr', value: 20000 },
    { name: 'May', value: 19000 },
    { name: 'Jun', value: 22000 },
];

// Reference Colors from Image
const COLORS = ['#0fb48c', '#3b82f6', '#8b5cf6', '#f97316'];

export default function Reports() {
    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="dashboard-page">
                <div className="page-title">
                    <h1>Reports & Analytics</h1>
                    <p>View comprehensive reports</p>
                </div>

                {/* STATS OVERVIEW */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-info">
                            <span>Total Patients</span>
                            <h2>3,050</h2>
                            <div className="stat-trend up" style={{ color: '#0fb48c' }}>
                                <ArrowUpRight size={14} /> +15.3%
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#e7f7f3', color: '#0fb48c' }}>
                            <Users size={24} />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <span>Appointments</span>
                            <h2>2,847</h2>
                            <div className="stat-trend up" style={{ color: '#3b82f6' }}>
                                <ArrowUpRight size={14} /> +12.8%
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                            <CalendarDays size={24} />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <span>Revenue</span>
                            <h2>₹1,10,200</h2>
                            <div className="stat-trend up" style={{ color: '#8b5cf6' }}>
                                <ArrowUpRight size={14} /> +18.5%
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                            <DollarSign size={24} />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <span>Growth</span>
                            <h2>+22%</h2>
                            <div className="stat-trend up" style={{ color: '#f97316' }}>
                                <ArrowUpRight size={14} /> +4.2%
                            </div>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#fff7ed', color: '#f97316' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                {/* MAIN CHARTS GRID */}
                <div className="charts-grid" style={{ gridTemplateColumns: '1.6fr 1fr' }}>

                    {/* Monthly Patients Bar Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Monthly Patients</h3>
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 13 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 13 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                            padding: '12px 16px'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#0fb48c" radius={[6, 6, 0, 0]} barSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Department Distribution Pie Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Department Distribution</h3>
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={deptData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={70}
                                        outerRadius={105}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {deptData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        formatter={(value) => <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 500 }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Revenue Trend Area Chart */}
                <div className="chart-card" style={{ marginTop: '24px' }}>
                    <div className="chart-header">
                        <h3>Revenue Trend</h3>
                    </div>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <AreaChart data={revenueTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0fb48c" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#0fb48c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                                    tickFormatter={(val) => `₹${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                        padding: '12px 16px'
                                    }}
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0fb48c"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0fb48c' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
