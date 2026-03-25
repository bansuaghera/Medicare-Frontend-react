import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import CalendarWidget from "../../components/common/CalendarWidget";
import ScheduleList from "../../components/admin/ScheduleList";
import "../../styles/patients.css";

export default function OPDSchedule() {
    const schedules = [
        { id: 1, doctor: "Dr. Ramesh Sharma", time: "09:00 AM - 12:00 PM", room: "Room 101", slots: 12 },
        { id: 2, doctor: "Dr. Anjali Gupta", time: "10:00 AM - 01:00 PM", room: "Room 102", slots: 15 },
        { id: 3, doctor: "Dr. Amit Patel", time: "02:00 PM - 05:00 PM", room: "Room 103", slots: 10 },
        { id: 4, doctor: "Dr. Vikram Singh", time: "03:00 PM - 06:00 PM", room: "Room 104", slots: 12 },
    ];

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <PageHeader 
                    title="OPD Schedule" 
                    subtitle="Manage OPD schedules and slots" 
                    buttonText="Add Schedule" 
                    buttonLink="/admin/schedule/add" 
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>

                    {/* DYNAMIC FUNCTIONAL CALENDAR */}
                    <div className="table-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Select Date</h3>
                        <CalendarWidget onDateSelect={(date) => console.log("Date selected:", date)} />
                    </div>

                    {/* SCHEDULE LIST COMPONENT */}
                    <div className="table-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Daily Schedule</h3>
                        <ScheduleList schedules={schedules} />
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
