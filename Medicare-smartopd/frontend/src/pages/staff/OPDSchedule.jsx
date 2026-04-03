import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { ChevronLeft, ChevronRight, Stethoscope, Users } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function OPDSchedule() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();

    // Build calendar days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsRes, apptRes] = await Promise.all([
                    API.get("/users/doctors"),
                    API.get("/appointments")
                ]);
                if (doctorsRes.data.success) setDoctors(doctorsRes.data.data);
                if (apptRes.data.success) setAppointments(apptRes.data.data);
            } catch {
                toast.error("Failed to load schedule data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Count appointments per doctor on selected date
    const getDoctorAppointmentsCount = (doctorId) =>
        appointments.filter(a => a.doctorId === doctorId && a.date === selectedDateStr).length;

    const prevMonth = () => setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
    const selectDay = (day) => { if (day) setSelectedDate(new Date(currentYear, currentMonth, day)); };

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>OPD Schedule</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>Doctor availability for {monthNames[currentMonth]} {currentYear}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px" }}>

                {/* Calendar Widget */}
                <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", height: "fit-content" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px", color: "#333" }}>Select Date</h3>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: "4px" }}>
                            <ChevronLeft size={20} />
                        </button>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>{monthNames[currentMonth]} {currentYear}</span>
                        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: "4px" }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center", marginBottom: "8px" }}>
                        {dayNames.map(d => (
                            <div key={d} style={{ fontSize: "12px", color: "#888", fontWeight: "600", padding: "4px" }}>{d}</div>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center" }}>
                        {calendarDays.map((day, i) => {
                            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                            const isSelected = day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
                            return (
                                <div
                                    key={i}
                                    onClick={() => selectDay(day)}
                                    style={{
                                        padding: "8px 0",
                                        fontSize: "14px",
                                        color: day ? (isSelected ? "#fff" : isToday ? "#0fb48c" : "#333") : "transparent",
                                        background: isSelected ? "#0fb48c" : "transparent",
                                        borderRadius: "8px",
                                        cursor: day ? "pointer" : "default",
                                        fontWeight: isSelected || isToday ? "700" : "400",
                                        border: isToday && !isSelected ? "1px solid #0fb48c" : "none"
                                    }}
                                >
                                    {day || ""}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: "20px", padding: "12px", background: "#f0fdf9", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ fontSize: "13px", color: "#0fb48c", fontWeight: "600" }}>
                            {appointments.filter(a => a.date === selectedDateStr).length} appointments on this day
                        </p>
                    </div>
                </div>

                {/* Doctor Schedule List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: 0 }}>
                        Doctors Available — {String(selectedDate.getDate()).padStart(2, "0")} {monthNames[currentMonth]}
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#999", background: "#fff", borderRadius: "12px" }}>Loading schedule...</div>
                    ) : doctors.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#999", background: "#fff", borderRadius: "12px" }}>
                            <Stethoscope size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
                            <p>No doctors registered yet. Add doctors from Admin Panel.</p>
                        </div>
                    ) : doctors.map((doc, index) => {
                        const apptCount = getDoctorAppointmentsCount(doc.id);
                        const colors = ["#7c3aed", "#0fb48c", "#3b82f6", "#ea580c", "#ec4899"];
                        const color = colors[index % colors.length];
                        return (
                            <div key={doc.id} style={{ background: "#fff", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ background: `${color}15`, color, width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Stethoscope size={22} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>Dr. {doc.name}</h3>
                                        <p style={{ fontSize: "13px", color: "#64748b" }}>
                                            {doc.Doctor?.specialization || "General"} • {doc.Doctor?.phone || "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "24px", fontWeight: "700", color }}>{apptCount}</div>
                                        <div style={{ fontSize: "12px", color: "#64748b" }}>Appointments</div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <span style={{ background: "#e8fdf5", color: "#0fb48c", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </StaffLayout>
    );
}
