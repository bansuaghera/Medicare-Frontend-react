import { Link, useLocation } from "react-router-dom";
import {
    HeartPulse,
    LayoutDashboard,
    CalendarDays,
    Users,
    Stethoscope,
    FileText,
    Clock,
    CheckCircle,
    LogOut,
    Search,
    Bell
} from "lucide-react";
import "../styles/adminLayout.css";

export default function DoctorLayout({ children, panelTitle = "Doctor Panel" }) {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/doctor/dashboard" },
        { icon: <CalendarDays size={20} />, label: "Appointments", path: "/doctor/appointments" },
        { icon: <Users size={20} />, label: "Patients", path: "/doctor/patients" },
        { icon: <Stethoscope size={20} />, label: "Examination", path: "/doctor/examination" },
        { icon: <FileText size={20} />, label: "Prescriptions", path: "/doctor/prescriptions" },
        { icon: <Clock size={20} />, label: "Schedule", path: "/doctor/schedule" },
        { icon: <CheckCircle size={20} />, label: "Follow-ups", path: "/doctor/followups" },
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
                        <Link to="/doctor/profile" className="user-profile" style={{ textDecoration: 'none' }}>
                            <div className="user-avatar" style={{ backgroundColor: '#0fb48c' }}>DR</div>
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
