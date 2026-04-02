import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Schedule() {
    const [currentDate, setCurrentDate] = useState(new Date("2026-02-13"));
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const dates = [
        [26, 27, 28, 29, 30, 31, 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 1],
    ];

    useEffect(() => {
        const fetchSchedules = async () => {
            if (!user.id) return;
            try {
                const res = await API.get(`/opd/schedule?doctorId=${user.id}`);
                if (res.data.success) {
                    setSchedules(res.data.data);
                }
            } catch (error) {
                toast.error("Failed to load your schedule");
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, [user.id]);

    const isMorning = (time) => {
        const hour = parseInt(time.split(':')[0]);
        return hour < 12;
    };

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>My Schedule</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>View your OPD schedule</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '24px' }}>

                {/* Calendar Selection (Static for Now) */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px', color: '#222' }}>Select Date</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <button style={{ background: '#f5f5f5', border: 'none', cursor: 'pointer', color: '#555', padding: '8px', borderRadius: '8px' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>February 2026</span>
                        <button style={{ background: '#f5f5f5', border: 'none', cursor: 'pointer', color: '#555', padding: '8px', borderRadius: '8px' }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', textAlign: 'center', marginBottom: '16px' }}>
                        {days.map(day => (
                            <div key={day} style={{ fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>{day}</div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dates.map((week, wIndex) => (
                            <div key={wIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', textAlign: 'center' }}>
                                {week.map((date, dIndex) => {
                                    const isCurrentMonth = (wIndex === 0 && date > 20) || (wIndex === 4 && date < 10) ? false : true;
                                    const isSelected = date === 13 && isCurrentMonth;

                                    return (
                                        <div
                                            key={`${wIndex}-${dIndex}`}
                                            style={{
                                                padding: '12px 0',
                                                fontSize: '15px',
                                                color: isSelected ? '#fff' : (isCurrentMonth ? '#333' : '#ccc'),
                                                background: isSelected ? '#0fb48c' : 'transparent',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                fontWeight: isSelected ? '600' : '500'
                                            }}
                                        >
                                            {date}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Date Schedule (Dynamic) */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222' }}>{loading ? "Loading Schedule..." : "Weekly Schedule"}</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {!loading && schedules.length === 0 && (
                            <p style={{ color: '#666', background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                No shifts scheduled yet. Please contact the administrator.
                            </p>
                        )}
                        {schedules.map((sch) => (
                            <div key={sch.id} style={{ 
                                background: isMorning(sch.startTime) ? "#e8fdf5" : "#ebf2fc", 
                                border: isMorning(sch.startTime) ? "1px solid #b2efdb" : "1px solid #c2dbf9", 
                                borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden" 
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: isMorning(sch.startTime) ? "#0fb48c" : "#4589f5" }}>
                                        {isMorning(sch.startTime) ? "Morning Session" : "Afternoon Session"}
                                    </h3>
                                    <div style={{ background: isMorning(sch.startTime) ? "#0fb48c" : "#4589f5", color: "#fff", padding: "10px", borderRadius: "10px" }}>
                                        {isMorning(sch.startTime) ? <Sun size={24} /> : <Moon size={24} />}
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#333", marginBottom: "16px", fontSize: "14px", fontWeight: "500" }}>
                                    <span>{sch.startTime} - {sch.endTime}</span>
                                    <span style={{ color: isMorning(sch.startTime) ? "#0fb48c" : "#4589f5" }}>•</span>
                                    <span>Room {sch.room} / Floor {sch.floor || "1st"}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#222", fontWeight: "600", fontSize: "14px" }}>
                                    <span>{sch.totalSlots} appointments per shift</span>
                                    <span style={{ marginLeft: '12px', fontSize: '12px', color: '#666', fontWeight: 400 }}>
                                        Days: {sch.days?.join(', ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
