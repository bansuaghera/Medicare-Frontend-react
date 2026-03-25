import React from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Calendar, UserCircle, CheckCircle, Clock } from "lucide-react";

import StatCard from "../../components/common/StatCard";
import DoctorAppointmentsList from "../../components/doctor/DoctorAppointmentsList";
import DoctorQuickStats from "../../components/doctor/DoctorQuickStats";

export default function DoctorDashboard() {
    const appointments = [
        { time: "09:00 AM", patient: "Rahul Verma", type: "Checkup", token: "A-045", status: "In Progress" },
        { time: "09:30 AM", patient: "Priya Sharma", type: "Consultation", token: "A-046", status: "Waiting" },
        { time: "10:00 AM", patient: "Suresh Kumar", type: "Follow-up", token: "A-047", status: "Waiting" },
        { time: "10:30 AM", patient: "Sneha Desai", type: "Checkup", token: "A-048", status: "Waiting" },
        { time: "11:00 AM", patient: "Vikram Singh", type: "Consultation", token: "A-049", status: "Scheduled" },
        { time: "11:30 AM", patient: "Neha Reddy", type: "Follow-up", token: "A-050", status: "Scheduled" },
    ];

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Doctor Dashboard</h1>
                <p style={{ color: "#666" }}>Welcome back, Dr. Ramesh Sharma</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "2rem" }}>
                <StatCard title="Today's Appointments" value="12" icon={Calendar} iconBg="#e8fdf5" iconColor="#0fb48c" />
                <StatCard title="Waiting Patients" value="8" icon={UserCircle} iconBg="#ebf2fc" iconColor="#4589f5" />
                <StatCard title="Completed" value="4" icon={CheckCircle} iconBg="#f2e8fd" iconColor="#b645f5" />
                <StatCard title="Tomorrow" value="15" icon={Clock} iconBg="#fff8ed" iconColor="#f5a445" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
                <DoctorAppointmentsList appointments={appointments} />
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <DoctorQuickStats total={156} avgTime="18 min" prescriptions={142} progress={33} />
                </div>
            </div>
        </DoctorLayout>
    );
}
