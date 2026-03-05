import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { UserCircle, Calendar, Star } from "lucide-react";

export default function Doctors() {
    const doctors = [
        {
            name: "Dr. Sarah Johnson",
            specialty: "Cardiology",
            rating: "4.8",
            experience: "15 years exp.",
            price: "$50",
            available: true,
            bgColor: "#f3e8ff",
            color: "#a855f7"
        },
        {
            name: "Dr. Michael Chen",
            specialty: "Pediatrics",
            rating: "4.7",
            experience: "12 years exp.",
            price: "$45",
            available: true,
            bgColor: "#f3e8ff",
            color: "#a855f7"
        },
        {
            name: "Dr. Emily Davis",
            specialty: "Dermatology",
            rating: "4.9",
            experience: "10 years exp.",
            price: "$55",
            available: true,
            bgColor: "#f3e8ff",
            color: "#a855f7"
        },
        {
            name: "Dr. Robert Wilson",
            specialty: "Orthopedics",
            rating: "4.6",
            experience: "18 years exp.",
            price: "$60",
            available: true,
            bgColor: "#f3e8ff",
            color: "#a855f7"
        }
    ];

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>Find a Doctor</h1>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>Browse our expert doctors</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {doctors.map((doctor, index) => (
                        <div key={index} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: doctor.bgColor, color: doctor.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserCircle size={24} />
                                </div>
                                {doctor.available && (
                                    <span style={{ background: '#d1fae5', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                        Available
                                    </span>
                                )}
                            </div>
                            
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>{doctor.name}</h3>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>{doctor.specialty}</p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <Star size={16} fill="#111827" color="#111827" />
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{doctor.rating}</span>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>({doctor.experience})</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', margin: 0 }}>{doctor.price}</h2>
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>per visit</span>
                            </div>
                            
                            <Link to="/user/book-appointment" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#10b981', color: '#fff', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', marginTop: 'auto' }}>
                                <Calendar size={18} />
                                Book Appointment
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
