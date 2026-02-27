import React, { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";

export default function Schedule() {
    const [currentDate, setCurrentDate] = useState(new Date("2026-02-13"));

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const dates = [
        [26, 27, 28, 29, 30, 31, 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 1],
    ];

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>My Schedule</h1>
                <p style={{ color: "#666", fontSize: "14px" }}>View your OPD schedule</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '24px' }}>

                {/* Calendar Selection */}
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

                {/* Selected Date Schedule */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222' }}>Today's Schedule</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                        <div style={{ background: "#e8fdf5", border: "1px solid #b2efdb", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0fb48c" }}>Morning Session</h3>
                                <div style={{ background: "#0fb48c", color: "#fff", padding: "10px", borderRadius: "10px" }}>
                                    <Sun size={24} />
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#333", marginBottom: "16px", fontSize: "14px", fontWeight: "500" }}>
                                <span>09:00 AM - 12:00 PM</span>
                                <span style={{ color: "#0fb48c" }}>•</span>
                                <span>Room 101</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#222", fontWeight: "600", fontSize: "14px" }}>
                                <span>12 appointments scheduled</span>
                            </div>
                        </div>

                        <div style={{ background: "#ebf2fc", border: "1px solid #c2dbf9", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#4589f5" }}>Afternoon Session</h3>
                                <div style={{ background: "#4589f5", color: "#fff", padding: "10px", borderRadius: "10px" }}>
                                    <Moon size={24} />
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#333", marginBottom: "16px", fontSize: "14px", fontWeight: "500" }}>
                                <span>02:00 PM - 05:00 PM</span>
                                <span style={{ color: "#4589f5" }}>•</span>
                                <span>Room 101</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#222", fontWeight: "600", fontSize: "14px" }}>
                                <span>8 appointments scheduled</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </DoctorLayout>
    );
}
