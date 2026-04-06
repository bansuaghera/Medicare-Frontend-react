import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    HeartPulse,
    Home,
    Users,
    CalendarPlus,
    CalendarDays,
    Clock,
    FileText,
    History,
    User,
    LogOut,
    Search,
    Sun,
    Moon,
    Bell,
    MessageSquare,
    Settings,
    Megaphone,
    X
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/useAuth";
import Avatar from "../components/common/Avatar";
import API from "../api/axiosConfig";
import toast from "react-hot-toast";
import { logActivity, getUnreadNotificationsCount } from "../api/activityAPI";
import "../styles/adminLayout.css";

export default function UserLayout({ children, panelTitle = "User Panel" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [callAlert, setCallAlert] = useState(null);
    const [dismissedCallId, setDismissedCallId] = useState(null);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (user?.id) {
                try {
                    const data = await getUnreadNotificationsCount(user.id);
                    if (data?.success) {
                        setUnreadCount(data.unreadCount);
                    }
                } catch (error) {
                    console.error("Error fetching unread count", error);
                }
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [user?.id, location.pathname]);

    // Token Calling Polling Logic
    useEffect(() => {
        if (!user?.id) return;

        const checkActiveCall = async () => {
            try {
                const res = await API.get(`/appointments/patient/${user.id}`);
                if (res.data.success) {
                    const activeCall = (res.data.data || []).find(a => a.status === 'in-progress');
                    if (activeCall && activeCall.id !== dismissedCallId) {
                        setCallAlert(activeCall);
                    } else if (!activeCall) {
                        setCallAlert(null);
                    }
                }
            } catch (error) {
                console.error("Call check failed", error);
            }
        };

        checkActiveCall();
        const interval = setInterval(checkActiveCall, 10000); // Polling every 10 seconds
        return () => clearInterval(interval);
    }, [user?.id, dismissedCallId]);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const menuItems = [
        { icon: <Home size={20} />, label: "Home", path: "/user/dashboard" },
        { icon: <Users size={20} />, label: "Doctors", path: "/user/doctors" },
        { icon: <CalendarPlus size={20} />, label: "Book Appointment", path: "/user/book-appointment" },
        { icon: <CalendarDays size={20} />, label: "My Appointments", path: "/user/appointments" },
        { icon: <Clock size={20} />, label: "Token Status", path: "/user/token-status" },
        { icon: <FileText size={20} />, label: "Prescriptions", path: "/user/prescriptions" },
        { icon: <Bell size={20} />, label: "Notifications", path: "/user/notifications" },
        { icon: <History size={20} />, label: "History", path: "/user/history" },
        { icon: <MessageSquare size={20} />, label: "Feedback", path: "/user/feedback" },
        { icon: <User size={20} />, label: "Profile", path: "/user/profile" },
        { icon: <Settings size={20} />, label: "Settings", path: "/user/settings" },
    ];

    return (
        <div className="dashboard-layout">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo-box">
                        <HeartPulse size={24} />
                    </div>
                    <div className="sidebar-brand">
                        <h3>MediCare</h3>
                        <span>{panelTitle}</span>
                    </div>
                </div>

                {/* Profile Card in Sidebar */}
                <div className="sidebar-profile-card">
                    <Avatar user={user} size={48} />
                    <div className="profile-info">
                        <p className="profile-name">{user?.name || "Patient"}</p>
                        <p className="profile-email">{user?.email || "patient@medicare.com"}</p>
                        <span className="user-role-badge">Patient</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="main-content">
                {/* HEADER */}
                <header className="dashboard-header">

                    <div className="header-actions">
                        {/* Theme Toggle Button */}
                        <button onClick={toggleTheme} className="notification-btn" title="Toggle Dark Mode" style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                        <Link to="/user/notifications" className="notification-btn" style={{ textDecoration: 'none' }}>
                            <Bell size={22} />
                            {unreadCount > 0 && <span className="notif-badge"></span>}
                        </Link>       
                        <Link to="/user/profile" className="user-profile" style={{ textDecoration: 'none' }}>
                            <Avatar user={user} size={36} />
                        </Link>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="page-container">
                    {children}
                </div>

                {/* CALL NOTIFICATION MODAL */}
                {callAlert && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div style={{ background: '#fff', borderRadius: '32px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '4px solid #0fb48c', position: 'relative' }}>
                            <button 
                                onClick={() => { setDismissedCallId(callAlert.id); setCallAlert(null); }}
                                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <div style={{ width: '80px', height: '80px', background: '#e8fdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: '#0fb48c', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}>
                                <Megaphone size={40} />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Token Activation Alert</h4>
                                <div style={{ background: '#0fb48c', color: '#fff', padding: '24px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
                                    <h2 style={{ fontSize: '64px', fontWeight: '900', margin: 0 }}>#{callAlert.tokenNumber}</h2>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Your Token is being Called!</h3>
                                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6 }}>Please proceed to <strong>Dr. {callAlert.Doctor?.name}'s</strong> consulting room immediately.</p>
                            </div>

                            <button 
                                onClick={() => { setDismissedCallId(callAlert.id); setCallAlert(null); }}
                                style={{ width: '100%', background: '#0fb48c', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15,180,140,0.3)' }}
                            >
                                I'm On My Way
                            </button>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes ping {
                        0% { transform: scale(1); opacity: 1; }
                        75%, 100% { transform: scale(1.5); opacity: 0; }
                    }
                `}</style>
            </main>
        </div>
    );
}

