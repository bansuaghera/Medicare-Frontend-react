import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import {
    Calendar,
    User,
    CheckCircle,
    Clock,
    Plus,
    Search,
    UserCircle2
} from "lucide-react";

import "../../styles/adminDashboard.css";

import UserQuickActions from "../../components/user/UserQuickActions";
import UserUpcomingAppointments from "../../components/user/UserUpcomingAppointments";

export default function UserDashboard() {

    const appointments = [
        {
            doctor: "Dr. Ramesh Sharma",
            specialty: "Cardiology",
            date: "2024-02-15",
            time: "10:00 AM",
            iconBg: "#f3e8ff",
            iconColor: "#a855f7"
        },
        {
            doctor: "Dr. Anjali Gupta",
            specialty: "Pediatrics",
            date: "2024-02-20",
            time: "02:00 PM",
            iconBg: "#dbeafe",
            iconColor: "#3b82f6"
        }
    ];

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Welcome Back, User!</h1>
                    <p style={{ fontSize: '15px' }}>Here's your health dashboard</p>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>

                    {/* Card 1 */}
                    <div className="stat-card">
                        <p>Upcoming Appointments</p>
                        <h2>2</h2>
                        <Calendar size={24} />
                    </div>

                    {/* Card 2 */}
                    <div className="stat-card">
                        <p>Total Visits</p>
                        <h2>12</h2>
                        <User size={24} />
                    </div>

                    {/* Card 3 */}
                    <div className="stat-card">
                        <p>Prescriptions</p>
                        <h2>8</h2>
                        <CheckCircle size={24} />
                    </div>

                    {/* Card 4 */}
                    <div className="stat-card">
                        <p>Last Visit</p>
                        <h2>Feb 10</h2>
                        <Clock size={24} />
                    </div>

                </div>

                {/* Main Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '24px'
                }}>

                    {/* Use Components (BEST PRACTICE) */}
                    <UserQuickActions />
                    <UserUpcomingAppointments appointments={appointments} />

                </div>

            </div>
        </UserLayout>
    );
}