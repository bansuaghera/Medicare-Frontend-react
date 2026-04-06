import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    HeartPulse,
    LayoutDashboard,
    UserPlus,
    Users,
    CalendarDays,
    ListOrdered,
    Mic,
    Clock,
    Printer,
    LogOut,
    Search,
    Bell,
    MessageSquare,
    Settings
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import Avatar from "../components/common/Avatar";
import { logActivity, getUnreadNotificationsCount } from "../api/activityAPI";
import "../styles/adminLayout.css";

export default function StaffLayout({ children, panelTitle = "Staff Panel" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

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

        if (location.pathname.includes('notifications')) {
            setUnreadCount(0);
            return;
        }

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [user?.id, location.pathname]);

    const handleLogout = async (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem("user") || "null");
        if (currentUser) {
            await logActivity({
                userId: currentUser.id,
                activityType: "logout",
                description: `${currentUser.name} logged out`
            }).catch(() => {});
        }
        localStorage.removeItem("user");
        navigate("/login");
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/staff/dashboard" },
        { icon: <UserPlus size={20} />, label: "Register Patient", path: "/staff/register-patient" },
        { icon: <Users size={20} />, label: "Patients", path: "/staff/patients" },
        { icon: <CalendarDays size={20} />, label: "Appointments", path: "/staff/appointments" },
        { icon: <ListOrdered size={20} />, label: "Tokens / Queue", path: "/staff/tokens" },
        { icon: <Mic size={20} />, label: "Call Token", path: "/staff/call-token" },
        { icon: <Bell size={20} />, label: "Notifications", path: "/staff/notifications" },
        { icon: <Clock size={20} />, label: "Schedule", path: "/staff/schedule" },
        { icon: <Printer size={20} />, label: "Print", path: "/staff/print" },
        { icon: <MessageSquare size={20} />, label: "Feedback", path: "/staff/feedback" },
        { icon: <Settings size={20} />, label: "Settings", path: "/staff/settings" },
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
                        <p className="profile-name">{user?.name || "Staff Member"}</p>
                        <p className="profile-email">{user?.email || "staff@medicare.com"}</p>
                        <span className="user-role-badge">Staff</span>
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
                        <Link to="/staff/notifications" className="notification-btn" style={{ textDecoration: 'none' }}>
                            <Bell size={22} />
                            {unreadCount > 0 && <span className="notif-badge"></span>}
                        </Link>
                        <Link to="/staff/profile" className="user-profile" style={{ textDecoration: 'none' }}>
                            <Avatar user={user} size={36} />
                        </Link>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="page-container">
                    {children}
                </div>
            </main>
        </div>
    );
}
