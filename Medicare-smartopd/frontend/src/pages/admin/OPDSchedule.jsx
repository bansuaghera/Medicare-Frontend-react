import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import CalendarWidget from "../../components/common/CalendarWidget";
import ScheduleList from "../../components/admin/ScheduleList";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";

export default function OPDSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await API.get("/opd/schedule");
                if (res.data.success) {
                    setSchedules(res.data.data.map(sch => ({
                        id: sch.id,
                        doctor: sch.doctor?.name || "Dr. Unassigned",
                        time: `${sch.startTime} - ${sch.endTime}`,
                        room: `Room ${sch.room}`,
                        slots: sch.totalSlots
                    })));
                }
            } catch (error) {
                toast.error("Failed to load OPD schedules");
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []);

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
