import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { ChevronLeft, ChevronRight, Stethoscope, Users, Trash2, CheckSquare, Square, Search, RefreshCw, Calendar as CalIcon, MapPin, Clock } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function OPDSchedule() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "manage"
    const [selectedIds, setSelectedIds] = useState([]);

    const today = new Date();
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();

    const fetchAll = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [docsRes, apptRes, schRes] = await Promise.all([
                API.get("/users/doctors"),
                API.get("/appointments"),
                API.get("/opd/schedule") // Assuming there's a global schedule fetch for staff
            ]);
            if (docsRes.data.success) setDoctors(docsRes.data.data);
            if (apptRes.data.success) setAppointments(apptRes.data.data);
            if (schRes.data.success) setSchedules(schRes.data.data);
        } catch {
            toast.error("Failed to load clinical operational data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSelectToggle = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(selectedIds.length === schedules.length ? [] : schedules.map(s => s.id));

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently remove ${selectedIds.length} OPD shifts? This will affect doctor availability.`)) return;
        try {
            await API.post("/opd/schedule/bulk-delete", { ids: selectedIds }); 
            toast.success("Shifts removed from roster.");
            setSchedules(schedules.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
        } catch {
            toast.error("Roster update failed.");
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    const getDoctorAppointmentsCount = (doctorId) =>
        appointments.filter(a => a.doctorId === doctorId && a.date === selectedDateStr).length;

    const prevMonth = () => setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
    const selectDay = (day) => { if (day) setSelectedDate(new Date(currentYear, currentMonth, day)); };

    // Build calendar days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    return (
        <StaffLayout panelTitle="Operational Roster">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '950', color: '#101828', marginBottom: '4px' }}>OPD Schedule</h1>
                        <p style={{ color: '#667085', fontSize: '15px' }}>{viewMode === "calendar" ? "Doctor availability and booking load." : "Manage repeating clinical shifts."}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={() => setViewMode(viewMode === "calendar" ? "manage" : "calendar")}
                            style={{ background: viewMode === "calendar" ? '#101828' : '#0fb48c', color: '#fff', padding: '12px 24px', borderRadius: '16px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                            {viewMode === "calendar" ? "Manage Shift Roster" : "Back to Calendar"}
                        </button>
                    </div>
                </div>

                {viewMode === "calendar" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "40px" }}>
                         {/* Calendar Widget */}
                        <div style={{ background: "#fff", borderRadius: "32px", padding: "32px", border: '1px solid #eaecf0', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <CalIcon size={24} color="#0fb48c" />
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', margin: 0 }}>Clinical Date</h3>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                                <button onClick={prevMonth} style={{ background: "#f8fafc", border: "none", cursor: "pointer", color: "#666", padding: "8px", borderRadius: '12px' }}><ChevronLeft size={20} /></button>
                                <span style={{ fontSize: "16px", fontWeight: "950", color: "#101828" }}>{monthNames[currentMonth]} {currentYear}</span>
                                <button onClick={nextMonth} style={{ background: "#f8fafc", border: "none", cursor: "pointer", color: "#666", padding: "8px", borderRadius: '12px' }}><ChevronRight size={20} /></button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", marginBottom: "16px" }}>
                                {dayNames.map(d => (
                                    <div key={d} style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "900", textTransform: 'uppercase' }}>{d}</div>
                                ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center" }}>
                                {calendarDays.map((day, i) => {
                                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                    const isSelected = day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
                                    return (
                                        <div key={i} onClick={() => selectDay(day)} style={{
                                            height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '14px', cursor: day ? 'pointer' : 'default',
                                            background: isSelected ? '#0fb48c' : (isToday ? '#f0fdf9' : 'transparent'),
                                            color: isSelected ? '#fff' : (day ? '#1e293b' : 'transparent'),
                                            fontWeight: isSelected || isToday ? '950' : '650',
                                            border: isToday && !isSelected ? '1px solid #0fb48c' : 'none'
                                        }}>{day || ""}</div>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: "32px", padding: "20px", background: "#f0fdf9", borderRadius: "20px", textAlign: "center", border: '1px solid #d1fadf' }}>
                                <p style={{ fontSize: "13px", color: "#0fb48c", fontWeight: "900", margin: 0 }}>
                                    {appointments.filter(a => a.date === selectedDateStr).length} Active Appointments
                                </p>
                            </div>
                        </div>

                        {/* Doctor Schedule List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#101828", marginBottom: '8px' }}>Active Consultants — {String(selectedDate.getDate()).padStart(2, "0")} {monthNames[currentMonth]}</h3>
                            {loading ? (
                                <p>Syncing schedule...</p>
                            ) : doctors.map((doc, index) => {
                                const apptCount = getDoctorAppointmentsCount(doc.id);
                                return (
                                    <div key={doc.id} style={{ background: "#fff", borderRadius: "24px", padding: "28px", border: '1px solid #eaecf0', display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: '20px' }}>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#f5faff', color: '#175cd3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d1e9ff' }}>
                                                <Stethoscope size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: "18px", fontWeight: "950", color: "#101828", margin: 0 }}>Dr. {doc.name}</h3>
                                                <p style={{ fontSize: "13px", color: "#667085", fontWeight: '700' }}>{doc.Doctor?.specialization || "General Medicine"} Specialist</p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                                            <div style={{ textAlign: "center" }}>
                                                <div style={{ fontSize: "28px", fontWeight: "950", color: '#101828' }}>{apptCount}</div>
                                                <div style={{ fontSize: "11px", fontWeight: '900', color: "#667085", textTransform: 'uppercase' }}>Bookings</div>
                                            </div>
                                            <span style={{ background: "#ecfdf5", color: "#047857", padding: "8px 20px", borderRadius: "24px", fontSize: "12px", fontWeight: "900" }}>AVAILABLE</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* SHIFT MANAGEMENT MODE WITH BULK DELETE */
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '40px', border: '1px solid #eaecf0', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {selectedIds.length === schedules.length && schedules.length > 0 ? <CheckSquare size={28} color="#0fb48c" /> : <Square size={28} color="#eaecf0" />}
                                    <span style={{ fontSize: '13px', fontWeight: '900', color: '#444' }}>SELECT ALL SHIFTS</span>
                                </button>
                            </div>
                            {selectedIds.length > 0 && (
                                <button onClick={handleDeleteSelected} style={{ background: '#fee4e2', color: '#f04438', padding: '14px 28px', borderRadius: '18px', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Trash2 size={20} /> DELETE SELECTED ({selectedIds.length})
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {schedules.map((sch) => {
                                const isMorning = parseInt(sch.startTime?.split(':')[0]) < 12;
                                const isSelected = selectedIds.includes(sch.id);
                                return (
                                    <div key={sch.id} style={{ 
                                        padding: '28px', borderRadius: '28px', border: isSelected ? '2px solid #0fb48c' : '1px solid #f2f4f7', 
                                        background: isSelected ? '#f0fdf9' : '#fff', position: 'relative', transition: '0.2s' 
                                    }}>
                                        <button onClick={() => handleSelectToggle(sch.id)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {isSelected ? <CheckSquare size={24} color="#0fb48c" /> : <Square size={24} color="#eaecf0" />}
                                        </button>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ background: isMorning ? '#f0fdf9' : '#f5faff', color: isMorning ? '#0fb48c' : '#175cd3', padding: '8px', borderRadius: '10px' }}>
                                               <Clock size={20} />
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: '950', color: isMorning ? '#0fb48c' : '#175cd3', textTransform: 'uppercase' }}>{isMorning ? "Morning OPD" : "Evening OPD"}</span>
                                        </div>
                                        
                                        <h3 style={{ fontSize: '20px', fontWeight: '950', color: '#101828', marginBottom: '8px' }}>Dr. {doctors.find(d => d.id === sch.doctorId)?.name || "Doctor"}</h3>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475467', fontSize: '14px', fontWeight: '750' }}>
                                                <MapPin size={16} /> Room {sch.room} / Floor {sch.floor || "1st"}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475467', fontSize: '14px', fontWeight: '750' }}>
                                                <Users size={16} /> {sch.totalSlots} Tokens / Day
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '20px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {sch.days?.map(d => (
                                                <span key={d} style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '950', color: '#64748b', border: '1px solid #eaecf0' }}>{d.toUpperCase()}</span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}
