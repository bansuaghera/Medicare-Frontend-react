import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarWidget({ onDateSelect }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newSelected);
        if(onDateSelect) onDateSelect(newSelected);
    };

    const renderDays = () => {
        const days = [];
        // empty slots before 1st day
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} style={{ padding: '8px' }}></div>);
        }
        // real days
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = new Date().getDate() === d && new Date().getMonth() === new Date().getMonth() && new Date().getFullYear() === new Date().getFullYear();
            const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
            
            let bg = 'transparent';
            let color = '#1e293b';
            let fw = 500;

            if (isSelected) {
                bg = '#1e293b';
                color = 'white';
                fw = 700;
            } else if (isToday) {
                bg = '#e2e8f0';
                fw = 700;
            }

            days.push(
                <div key={d} 
                    onClick={() => handleDateClick(d)}
                    style={{
                        padding: '8px',
                        borderRadius: '50%',
                        fontSize: '14px',
                        cursor: 'pointer',
                        background: bg,
                        color: color,
                        fontWeight: fw,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '35px',
                        width: '35px',
                        margin: 'auto',
                        transition: 'background 0.2s'
                    }}>
                    {d}
                </div>
            );
        }
        return days;
    };

    return (
        <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div onClick={handlePrevMonth} style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#fff' }}>
                    <ChevronLeft size={18} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <div onClick={handleNextMonth} style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#fff' }}>
                    <ChevronRight size={18} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '8px', marginBottom: '8px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <span key={d} style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{d}</span>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '8px' }}>
                {renderDays()}
            </div>
        </div>
    );
}
