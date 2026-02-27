import { Link, useLocation } from "react-router-dom";
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
    Bell
} from "lucide-react";
import "../styles/adminLayout.css";

export default function AdminLayout({ children, panelTitle = "Admin Panel" }) {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
        { icon: <Users size={20} />, label: "Patients", path: "/admin/patients" },
        { icon: <UserRound size={20} />, label: "Doctors", path: "/admin/doctors" },
        { icon: <Briefcase size={20} />, label: "Staff", path: "/admin/staff" },
        { icon: <CalendarRange size={20} />, label: "OPD Schedule", path: "/admin/schedule" },
        { icon: <CalendarDays size={20} />, label: "Appointments", path: "/admin/appointments" },
        { icon: <ListOrdered size={20} />, label: "Token Queue", path: "/admin/queue" },
        { icon: <FileText size={20} />, label: "Prescriptions", path: "/admin/prescriptions" },
        { icon: <BarChart3 size={20} />, label: "Reports", path: "/admin/reports" },
        { icon: <Pill size={20} />, label: "Medicines", path: "/admin/medicines" },
        { icon: <FileBox size={20} />, label: "Templates", path: "/admin/templates" },
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
                        <input type="text" placeholder="Search patients, doctors, appointments..." />
                    </div>

                    <div className="header-actions">
                        <button className="notification-btn">
                            <Bell size={22} />
                            <span className="notif-badge"></span>
                        </button>
                        <Link to="/admin/profile" className="user-profile" style={{ textDecoration: 'none' }}>
                            <div className="user-avatar">AD</div>
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
