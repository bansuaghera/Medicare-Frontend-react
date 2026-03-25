import React from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { UserPlus, Calendar, CreditCard, Clock, FileText } from "lucide-react";

// Components
import StatCard from "../../components/common/StatCard";
import StaffQuickActions from "../../components/staff/StaffQuickActions";
import TodayAppointments from "../../components/staff/TodayAppointments";

export default function StaffDashboard() {
    const todayAppointmentsData = [
        { time: "09:00 AM", patient: "Rahul Verma", doctor: "Dr. Ramesh Sharma", token: "A-045" },
        { time: "09:30 AM", patient: "Priya Sharma", doctor: "Dr. Anjali Gupta", token: "A-046" },
        { time: "10:00 AM", patient: "Suresh Kumar", doctor: "Dr. Amit Patel", token: "A-047" },
        { time: "10:30 AM", patient: "Sneha Desai", doctor: "Dr. Vikram Singh", token: "A-048" },
        { time: "11:00 AM", patient: "Vikram Singh", doctor: "Dr. Neha Reddy", token: "A-049" },
        { time: "11:30 AM", patient: "Neha Reddy", doctor: "Dr. Mark Thompson", token: "A-050" }
    ];

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div className="dashboard-header-section" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Staff Dashboard</h1>
                <p style={{ color: "#666" }}>Welcome back! Here's today's overview</p>
            </div>

            <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "2rem" }}>
                <StatCard title="Today's Appointments" value="38" icon={Calendar} iconBg="#e8fdf5" iconColor="#0fb48c" />
                <StatCard title="Active Tokens" value="12" icon={CreditCard} iconBg="#ebf2fc" iconColor="#4589f5" />
                <StatCard title="New Patients" value="5" icon={UserPlus} iconBg="#faf1fd" iconColor="#b645f5" />
                <StatCard title="Scheduled Tomorrow" value="42" icon={Clock} iconBg="#fff8ed" iconColor="#f5a445" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
                <StaffQuickActions />
                <TodayAppointments appointments={todayAppointmentsData} />
            </div>
        </StaffLayout>
    );
}

