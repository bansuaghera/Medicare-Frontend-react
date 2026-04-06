import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    HeartPulse,
    LayoutDashboard,
    Users,
    UserRound,
    Briefcase,
    CalendarRange,
    CalendarDays,
    ListOrdered,
    FileText,
    BarChart3,
    Pill,
    FileBox,
    Settings,
    LogOut,
    Search,
    Bell,
    MessageSquare
} from "lucide-react";
import Avatar from "../components/common/Avatar";
import { useAuth } from "../context/useAuth";
import { logActivity, getUnreadNotificationsCount } from "../api/activityAPI";
import "../styles/adminLayout.css";

export default function AdminLayout({ children, panelTitle = "Admin Panel" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
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

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [user?.id, location.pathname]);

    const handleLogout = (e) => {
        if (e) e.preventDefault();
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const menuItems = [
// ... (omitting for brevity in this view, will use the whole range in replacement)
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
        { icon: <Users size={20} />, label: "All Users", path: "/admin/users" },
        { icon: <Users size={20} />, label: "Patients", path: "/admin/patients" },
        { icon: <UserRound size={20} />, label: "Doctors", path: "/admin/doctors" },
        { icon: <Briefcase size={20} />, label: "Staff", path: "/admin/staff" },
        { icon: <CalendarRange size={20} />, label: "OPD Schedule", path: "/admin/schedule" },
        { icon: <CalendarDays size={20} />, label: "Appointments", path: "/admin/appointments" },
        { icon: <ListOrdered size={20} />, label: "Token Queue", path: "/admin/queue" },
        { icon: <FileText size={20} />, label: "Prescriptions", path: "/admin/prescriptions" },
        { icon: <Bell size={20} />, label: "Notifications", path: "/admin/notifications" },
        { icon: <BarChart3 size={20} />, label: "Reports", path: "/admin/reports" },
        { icon: <Pill size={20} />, label: "Medicines", path: "/admin/medicines" },
        { icon: <FileBox size={20} />, label: "Templates", path: "/admin/templates" },
        { icon: <MessageSquare size={20} />, label: "Feedback", path: "/admin/feedback" },
        { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
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
                        <p className="profile-name">{user?.name || "Administrator"}</p>
                        <p className="profile-email">{user?.email || "admin@medicare.com"}</p>
                        <span className="user-role-badge">Admin</span>
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
                        <Link to="/admin/notifications" className="notification-btn" style={{ textDecoration: 'none' }}>
                            <Bell size={22} />
                            {unreadCount > 0 && <span className="notif-badge"></span>}
                        </Link>
                        <Link to="/admin/profile" className="user-profile" style={{ textDecoration: 'none' }}>
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
