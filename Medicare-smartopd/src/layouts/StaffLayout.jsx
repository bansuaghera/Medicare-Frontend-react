import { Link, useLocation } from "react-router-dom";
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
    Bell
} from "lucide-react";
import "../styles/adminLayout.css";

export default function StaffLayout({ children, panelTitle = "Staff Panel" }) {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/staff/dashboard" },
        { icon: <UserPlus size={20} />, label: "Register Patient", path: "/staff/register-patient" },
        { icon: <Users size={20} />, label: "Patients", path: "/staff/patients" },
        { icon: <CalendarDays size={20} />, label: "Appointments", path: "/staff/appointments" },
        { icon: <ListOrdered size={20} />, label: "Tokens", path: "/staff/tokens" },
        { icon: <ListOrdered size={20} />, label: "Queue", path: "/staff/queue" },
        { icon: <Mic size={20} />, label: "Call Token", path: "/staff/call-token" },
        { icon: <Clock size={20} />, label: "Schedule", path: "/staff/schedule" },
        { icon: <Printer size={20} />, label: "Print", path: "/staff/print" },
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
                    <Link to="/login" className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="main-content">
                {/* HEADER */}
                <header className="dashboard-header">
                    <div className="search-bar">
                        <Search size={18} className="text-muted" />
                        <input type="text" placeholder="Search patients, appointments..." />
                    </div>

                    <div className="header-actions">
                        <button className="notification-btn">
                            <Bell size={22} />
                            <span className="notif-badge"></span>
                        </button>
                        <Link to="/staff/profile" className="user-profile" style={{ textDecoration: 'none' }}>
                            <div className="user-avatar" style={{ backgroundColor: '#0fb48c' }}>ST</div>
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
