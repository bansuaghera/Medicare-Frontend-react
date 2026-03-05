import { Link, useLocation } from "react-router-dom";
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
    Bell
} from "lucide-react";
import "../styles/adminLayout.css";

export default function UserLayout({ children, panelTitle = "User Panel" }) {
    const location = useLocation();

    const menuItems = [
        { icon: <Home size={20} />, label: "Home", path: "/user/dashboard" },
        { icon: <Users size={20} />, label: "Doctors", path: "/user/doctors" },
        { icon: <CalendarPlus size={20} />, label: "Book Appointment", path: "/user/book-appointment" },
        { icon: <CalendarDays size={20} />, label: "My Appointments", path: "/user/appointments" },
        { icon: <Clock size={20} />, label: "Token Status", path: "/user/token-status" },
        { icon: <FileText size={20} />, label: "Prescriptions", path: "/user/prescriptions" },
        { icon: <History size={20} />, label: "History", path: "/user/history" },
        { icon: <User size={20} />, label: "Profile", path: "/user/profile" },
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
                        <input type="text" placeholder="Search doctors, appointments..." />
                    </div>

                    <div className="header-actions">
                        <button className="notification-btn">
                            <Bell size={22} />
                            <span className="notif-badge"></span>
                        </button>
                        <Link to="/user/profile" className="usser-profile" style={{ textDecoration: 'none' }}>
                            <div className="user-avatar" style={{ backgroundColor: '#10b981' }}>PT</div>
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

