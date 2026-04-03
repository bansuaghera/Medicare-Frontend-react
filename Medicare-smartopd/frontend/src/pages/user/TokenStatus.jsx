import { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { User, Stethoscope, Clock, Calendar, Hash, RefreshCw, AlertCircle } from "lucide-react";
import API from "../../api/axiosConfig";

export default function TokenStatus() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("today");

    const fetchStatus = async () => {
        if (!user.id) return;
        setLoading(true);
        try {
            const res = await API.get(`/appointments/patient/${user.id}`);
            if (res.data.success) {
                setAllAppointments(res.data.data || []);
            }
        } catch (err) {
            console.error("Failed to load token status", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, [user.id]);

    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = allAppointments
        .filter(a => a.date === today)
        .sort((a, b) => a.tokenNumber - b.tokenNumber);

    const upcomingAppointments = allAppointments
        .filter(a => a.date > today)
        .sort((a, b) => a.date.localeCompare(b.date) || a.tokenNumber - b.tokenNumber);

    const pastAppointments = allAppointments
        .filter(a => a.date < today)
        .sort((a, b) => b.date.localeCompare(a.date));

    const tabs = [
        { key: "today", label: "Today", count: todayAppointments.length },
        { key: "upcoming", label: "Upcoming", count: upcomingAppointments.length },
        { key: "past", label: "Past", count: pastAppointments.length }
    ];

    const currentList =
        activeTab === "today" ? todayAppointments :
        activeTab === "upcoming" ? upcomingAppointments :
        pastAppointments;

    const getStatusConfig = (status) => {
        switch (status) {
            case "in-progress": return { label: "In Progress", color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe", dot: "#3b82f6" };
            case "completed":   return { label: "Completed ✓", color: "#166534", bg: "#dcfce7", border: "#bbf7d0", dot: "#22c55e" };
            case "cancelled":   return { label: "Cancelled", color: "#991b1b", bg: "#fee2e2", border: "#fecaca", dot: "#ef4444" };
            default:            return { label: "Waiting", color: "#92400e", bg: "#fef9c3", border: "#fde68a", dot: "#f59e0b" };
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    };

    // ─── Styles ───
    const tabBarStyle = {
        display: "flex",
        gap: "4px",
        background: "#f1f5f9",
        borderRadius: "12px",
        padding: "4px",
        marginBottom: "28px"
    };

    const tabStyle = (isActive) => ({
        flex: 1,
        padding: "10px 16px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: isActive ? "700" : "500",
        color: isActive ? "#fff" : "#64748b",
        background: isActive ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
        boxShadow: isActive ? "0 2px 8px rgba(99,102,241,0.35)" : "none",
        transition: "all 0.25s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
    });

    const countBadgeStyle = (isActive) => ({
        background: isActive ? "rgba(255,255,255,0.25)" : "#e2e8f0",
        color: isActive ? "#fff" : "#64748b",
        fontSize: "12px",
        fontWeight: "700",
        padding: "2px 8px",
        borderRadius: "20px",
        minWidth: "22px",
        textAlign: "center"
    });

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 16px' }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary, #1e293b)', margin: '0 0 6px 0' }}>Token Status</h1>
                        <p style={{ color: 'var(--text-secondary, #64748b)', fontSize: '14px', margin: 0 }}>
                            Live queue status • {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                    </div>
                    <button
                        onClick={fetchStatus}
                        style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            background: "var(--bg-secondary, #f1f5f9)", border: "1px solid var(--border-color, #e2e8f0)",
                            color: "var(--text-secondary, #475569)", padding: "8px 16px", borderRadius: "8px",
                            cursor: "pointer", fontSize: "13px", fontWeight: "600"
                        }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Tabs */}
                <div style={tabBarStyle}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={tabStyle(activeTab === tab.key)}
                        >
                            {tab.label}
                            <span style={countBadgeStyle(activeTab === tab.key)}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px", color: "var(--text-secondary, #94a3b8)" }}>
                        <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: "12px" }} />
                        <p>Loading token status...</p>
                    </div>
                ) : currentList.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "64px 24px",
                        background: "var(--bg-secondary, #fff)", borderRadius: "16px",
                        border: "2px dashed var(--border-color, #e2e8f0)"
                    }}>
                        <AlertCircle size={48} style={{ color: "var(--text-secondary, #cbd5e1)", marginBottom: "16px" }} />
                        <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary, #64748b)", margin: "0 0 8px 0" }}>
                            {activeTab === "today" ? "No appointments today" :
                             activeTab === "upcoming" ? "No upcoming appointments" :
                             "No past appointments"}
                        </p>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary, #94a3b8)", margin: 0 }}>
                            {activeTab === "today" ? "Book an appointment to see your token here" :
                             activeTab === "upcoming" ? "Your future bookings will appear here" :
                             "Your appointment history will appear here"}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {currentList.map((apt) => {
                            const s = getStatusConfig(apt.status);
                            return (
                                <div key={apt.id} style={{
                                    background: "var(--bg-secondary, #fff)", borderRadius: "16px",
                                    border: `1px solid ${s.border}`, padding: "28px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                                }}>
                                    {/* Token Number */}
                                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary, #94a3b8)", marginBottom: "10px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                                            Your Token Number
                                        </p>
                                        <div style={{ background: s.bg, borderRadius: "16px", padding: "20px 32px", display: "inline-block" }}>
                                            <h2 style={{ fontSize: "52px", fontWeight: "900", color: s.color, margin: 0, letterSpacing: "-2px" }}>
                                                #{apt.tokenNumber}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Status Banner */}
                                    <div style={{
                                        background: s.bg, border: `1px solid ${s.border}`, borderRadius: "12px",
                                        padding: "14px", textAlign: "center", marginBottom: "20px",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                                    }}>
                                        <div style={{
                                            width: "10px", height: "10px", borderRadius: "50%", background: s.dot,
                                            boxShadow: apt.status === "in-progress" ? `0 0 8px ${s.dot}` : "none",
                                            animation: apt.status === "in-progress" ? "pulse 1.5s infinite" : "none"
                                        }} />
                                        <span style={{ fontSize: "15px", fontWeight: "700", color: s.color }}>{s.label}</span>
                                    </div>

                                    {/* Details Grid */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-tertiary, #f8fafc)", borderRadius: "10px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary, #64748b)" }}>
                                                <User size={16} />
                                                <span style={{ fontSize: "13px" }}>Patient</span>
                                            </div>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary, #1e293b)" }}>{user.name}</span>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-tertiary, #f8fafc)", borderRadius: "10px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary, #64748b)" }}>
                                                <Stethoscope size={16} />
                                                <span style={{ fontSize: "13px" }}>Doctor</span>
                                            </div>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary, #1e293b)" }}>Dr. {apt.Doctor?.name || "Assigning..."}</span>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-tertiary, #f8fafc)", borderRadius: "10px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary, #64748b)" }}>
                                                <Clock size={16} />
                                                <span style={{ fontSize: "13px" }}>Time</span>
                                            </div>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary, #1e293b)" }}>{apt.time || "—"}</span>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-tertiary, #f8fafc)", borderRadius: "10px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary, #64748b)" }}>
                                                <Calendar size={16} />
                                                <span style={{ fontSize: "13px" }}>Date</span>
                                            </div>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary, #1e293b)" }}>{formatDate(apt.date)}</span>
                                        </div>

                                        {apt.reason && (
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-tertiary, #f8fafc)", borderRadius: "10px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary, #64748b)" }}>
                                                    <Hash size={16} />
                                                    <span style={{ fontSize: "13px" }}>Reason</span>
                                                </div>
                                                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary, #1e293b)" }}>{apt.reason}</span>
                                            </div>
                                        )}
                                    </div>

                                    {activeTab === "today" && (
                                        <p style={{ fontSize: "11px", color: "var(--text-secondary, #94a3b8)", textAlign: "center", marginTop: "16px", margin: "16px 0 0 0" }}>
                                            Auto-refreshes every 30 seconds
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Keyframe animations */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.3); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </UserLayout>
    );
}
