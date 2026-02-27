import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/patients.css";

export default function OPDSchedule() {
    const schedules = [
        { id: 1, doctor: "Dr. Sarah Johnson", time: "09:00 AM - 12:00 PM", room: "Room 101", slots: 12 },
        { id: 2, doctor: "Dr. Michael Chen", time: "10:00 AM - 01:00 PM", room: "Room 102", slots: 15 },
        { id: 3, doctor: "Dr. Emily Davis", time: "02:00 PM - 05:00 PM", room: "Room 103", slots: 10 },
        { id: 4, doctor: "Dr. Robert Wilson", time: "03:00 PM - 06:00 PM", room: "Room 104", slots: 12 },
    ];

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>OPD Schedule</h1>
                        <p>Manage OPD schedules and slots</p>
                    </div>
                    <Link to="/admin/schedule/add" className="add-btn">
                        <Plus size={20} />
                        <span>Add Schedule</span>
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>

                    {/* MINI CALENDAR (Visual Mockup) */}
                    <div className="table-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Select Date</h3>
                        <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <ChevronLeft size={18} cursor="pointer" />
                                <span style={{ fontWeight: 700 }}>February 2026</span>
                                <ChevronRight size={18} cursor="pointer" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '8px' }}>
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{d}</span>)}
                                {[23, 24, 25, 26, 27, 28, 16, 17, 18, 19, 20, 21, 22, 9, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 1].map((day, idx) => (
                                    <div key={idx} style={{
                                        padding: '8px',
                                        borderRadius: '50%',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        background: day === 14 ? '#1e293b' : 'transparent',
                                        color: day === 14 ? 'white' : '#1e293b',
                                        fontWeight: day === 14 ? 700 : 500
                                    }}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SCHEDULE LIST */}
                    <div className="table-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Today's Schedule</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {schedules.map(sch => (
                                <div key={sch.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '20px',
                                    borderRadius: '15px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white'
                                }}>
                                    <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '12px', borderRadius: '12px' }}>
                                        <CalendarDays size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{sch.doctor}</h4>
                                        <p style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Clock size={12} /> {sch.time} • {sch.room}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 700 }}>{sch.slots}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Available Slots</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
