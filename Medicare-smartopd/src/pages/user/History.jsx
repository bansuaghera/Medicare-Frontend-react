import UserLayout from "../../layouts/UserLayout";
import { Stethoscope, Calendar } from "lucide-react";

export default function History() {
    const historyData = [
        { title: "Routine Checkup", doctor: "Dr. Sarah Johnson", date: "2024-02-10", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" },
        { title: "Fever", doctor: "Dr. Michael Chen", date: "2024-01-25", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" },
        { title: "Blood Pressure Check", doctor: "Dr. Emily Davis", date: "2023-12-10", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" },
        { title: "General Consultation", doctor: "Dr. Robert Wilson", date: "2023-11-15", status: "Completed", iconColor: "#a855f7", iconBg: "#f3e8ff" }
    ];

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>Visit History</h1>
                    <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Your complete medical visit history</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {historyData.map((item, index) => (
                        <div key={index} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Stethoscope size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>{item.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>{item.doctor}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px' }}>
                                        <Calendar size={14} />
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <span style={{ background: '#f3f4f6', color: '#374151', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
