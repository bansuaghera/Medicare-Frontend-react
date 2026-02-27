import AdminLayout from "../../layouts/AdminLayout";
import {
    Users,
    Clock,
    PlayCircle,
    CheckCircle2
} from "lucide-react";
import "../../styles/adminDashboard.css";

export default function TokenQueue() {
    const queueData = [
        { token: "A-045", name: "John Smith", doctor: "Dr. Sarah Johnson", wait: "5 min", status: "In Progress" },
        { token: "A-046", name: "Sarah Johnson", doctor: "Dr. Michael Chen", wait: "15 min", status: "Waiting" },
        { token: "A-047", name: "Michael Chen", doctor: "Dr. Emily Davis", wait: "22 min", status: "Waiting" },
        { token: "A-048", name: "Emily Davis", doctor: "Dr. Robert Wilson", wait: "30 min", status: "Waiting" },
    ];

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="dashboard-page">

                <div className="page-title">
                    <h1>Token Queue Dashboard</h1>
                    <p>Monitor live token queue</p>
                </div>

                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-info">
                            <span>Active Tokens</span>
                            <h2>24</h2>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#e7f7f3', color: '#0fb48c' }}>
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <span>In Progress</span>
                            <h2>4</h2>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#f0f4ff', color: '#4f46e5' }}>
                            <PlayCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <span>Avg Wait Time</span>
                            <h2>18 min</h2>
                        </div>
                        <div className="stat-icon-box" style={{ background: '#fff7ed', color: '#ea580c' }}>
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                {/* Live Queue Cards */}
                <div className="recent-activity" style={{ marginTop: '32px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Live Queue</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {queueData.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '20px',
                                background: '#f8fafc',
                                borderRadius: '16px',
                                border: '1px solid #f1f5f9'
                            }}>
                                <div style={{
                                    background: '#0fb48c',
                                    color: 'white',
                                    padding: '12px 18px',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '20px'
                                }}>
                                    {item.token}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{item.name}</h4>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>{item.doctor}</p>
                                </div>
                                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Wait Time</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{item.wait}</div>
                                </div>
                                <div style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    background: item.status === 'In Progress' ? '#f0f4ff' : '#fff7ed',
                                    color: item.status === 'In Progress' ? '#4f46e5' : '#ea580c'
                                }}>
                                    {item.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
