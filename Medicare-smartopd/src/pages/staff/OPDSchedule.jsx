import React, { useState } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OPDSchedule() {
    const [currentDate, setCurrentDate] = useState(new Date("2026-02-13"));

    const schedules = [
        { doctor: "Dr. Sarah Johnson", time: "09:00 AM - 12:00 PM", room: "Room 101", slots: 12 },
        { doctor: "Dr. Michael Chen", time: "10:00 AM - 01:00 PM", room: "Room 102", slots: 15 },
        { doctor: "Dr. Emily Davis", time: "02:00 PM - 05:00 PM", room: "Room 103", slots: 10 },
        { doctor: "Dr. James Wilson", time: "03:00 PM - 06:00 PM", room: "Room 104", slots: 8 },
        { doctor: "Dr. Lisa Thompson", time: "11:00 AM - 02:00 PM", room: "Room 105", slots: 6 },
    ];

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const dates = [
        [26, 27, 28, 29, 30, 31, 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 1],
    ];

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>OPD Schedule</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>View doctor schedules</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>

                {/* Calendar Widget */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>Select Date</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>February 2026</span>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
                        {days.map(day => (
                            <div key={day} style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>{day}</div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {dates.map((week, wIndex) => (
                            <div key={wIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                                {week.map((date, dIndex) => {
                                    const isCurrentMonth = (wIndex === 0 && date > 20) || (wIndex === 4 && date < 10) ? false : true;
                                    const isSelected = date === 13 && isCurrentMonth;

                                    return (
                                        <div
                                            key={`${wIndex}-${dIndex}`}
                                            style={{
                                                padding: '8px 0',
                                                fontSize: '14px',
                                                color: isSelected ? '#fff' : (isCurrentMonth ? '#333' : '#ccc'),
                                                background: isSelected ? '#333' : 'transparent',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: isSelected ? '600' : '400'
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

                {/* Schedule List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {schedules.map((schedule, index) => (
                        <div key={index} style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>{schedule.doctor}</h3>
                                <p style={{ fontSize: '14px', color: '#666' }}>{schedule.time} • {schedule.room}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#0fb48c' }}>{schedule.slots}</div>
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Available Slots</div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </StaffLayout>
    );
}
