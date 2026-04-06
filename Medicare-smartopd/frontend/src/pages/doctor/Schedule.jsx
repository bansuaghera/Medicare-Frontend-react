import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { ChevronLeft, ChevronRight, Sun, Moon, Calendar as CalIcon, MapPin, Clock, Users, Timer, Sparkles } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Schedule() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchSchedules = async () => {
        if (!user.id) return;
        setLoading(true);
        try {
            // Fetch the doctor's weekly OPD shifts
            const res = await API.get(`/opd/schedule?doctorId=${user.id}`);
            if (res.data.success) {
                setSchedules(res.data.data || []);
            }
        } catch (error) { toast.error("Failed to load shift schedule."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSchedules(); }, [user.id]);

    const isMorning = (time) => {
        const hour = parseInt(time.split(':')[0]);
        return hour < 12;
    };

    // Calendar Helpers
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    const monthName = selectedDate.toLocaleString('default', { month: 'long' });
    const currentYear = selectedDate.getFullYear();

    const calendarGrid = [];
    let day = 1;
    for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startDayOfMonth) {
                week.push(null);
            } else if (day > daysInMonth) {
                week.push(null);
            } else {
                week.push(day++);
            }
        }
        calendarGrid.push(week);
        if (day > daysInMonth) break;
    }

    return (
        <DoctorLayout panelTitle="Clinical Operations">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', marginBottom: '4px' }}>Shift Management</h1>
                    <p style={{ color: '#667085', fontSize: '15px' }}>Official OPD schedule and clinical floor assignments.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '40px', alignItems: 'start' }}>
                    
                    {/* INTERACTIVE CALENDAR */}
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #eaecf0', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5faff', color: '#175cd3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CalIcon size={20}/></div>
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', margin: 0 }}>{monthName} {currentYear}</h3>
                             </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '16px' }}>
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{d}</div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {calendarGrid.map((week, wIdx) => (
                                <div key={wIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                                    {week.map((d, dIdx) => {
                                        const isToday = d === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth();
                                        return (
                                            <div key={dIdx} style={{ 
                                                height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px',
                                                fontSize: '14px', fontWeight: isToday ? '950' : '650', cursor: 'pointer',
                                                background: isToday ? '#0fb48c' : (d ? '#f9fafb' : 'transparent'),
                                                color: isToday ? '#fff' : (d ? '#475467' : 'transparent'),
                                                border: isToday ? 'none' : (d ? '1px solid #f2f4f7' : 'none')
                                            }}>{d}</div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DYNAMIC SHIFT ROSTER */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#101828', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Weekly Clinical Roster <Clock size={20} color="#0fb48c" />
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {loading ? (
                                    <p style={{ textAlign: 'center', padding: '40px', color: '#667085' }}>Roster synchronization in progress...</p>
                                ) : schedules.length > 0 ? (
                                    schedules.map((sch) => (
                                        <div key={sch.id} style={{ 
                                            background: isMorning(sch.startTime) ? '#f0fdf9' : '#f5faff',
                                            border: isMorning(sch.startTime) ? '1px solid #d1fadf' : '1px solid #d1e9ff',
                                            borderRadius: '28px', padding: '32px', position: 'relative', overflow: 'hidden'
                                        }}>
                                            <div style={{ position: 'absolute', right: '-20px', top: '-10px', opacity: 0.1 }}><Sparkles size={100} /></div>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                        {isMorning(sch.startTime) ? <Sun size={16} color="#0fb48c" /> : <Moon size={16} color="#175cd3" />}
                                                        <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: isMorning(sch.startTime) ? '#0fb48c' : '#175cd3' }}>
                                                            {isMorning(sch.startTime) ? "Morning OPD Block" : "Evening OPD Block"}
                                                        </span>
                                                    </div>
                                                    <h3 style={{ fontSize: '24px', fontWeight: '950', color: '#101828', margin: 0 }}>{sch.startTime} — {sch.endTime}</h3>
                                                </div>
                                                <div style={{ background: '#fff', color: '#101828', padding: '12px 20px', borderRadius: '16px', border: '1px solid #eaecf0', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                                    <p style={{ margin: 0, fontSize: '10px', fontWeight: '850', color: '#667085' }}>ROOM</p>
                                                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '950' }}>{sch.room}</p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <MapPin size={18} color="#667085" />
                                                    <span style={{ fontSize: '14px', fontWeight: '750', color: '#344054' }}>{sch.floor} Floor</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Users size={18} color="#667085" />
                                                    <span style={{ fontSize: '14px', fontWeight: '750', color: '#344054' }}>{sch.totalSlots} Slots / Day</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Timer size={18} color="#667085" />
                                                    <span style={{ fontSize: '14px', fontWeight: '750', color: '#344054' }}>15m / Patient</span>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {sch.days?.map(day => (
                                                    <span key={day} style={{ background: '#fff', padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', color: '#475467', border: '1px solid #eaecf0' }}>{day.toUpperCase()}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '60px', textAlign: 'center', border: '2px dashed #eaecf0', borderRadius: '32px', color: '#667085' }}>
                                        No active OPD blocks found for your profile. Please contact clinical staffing.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
