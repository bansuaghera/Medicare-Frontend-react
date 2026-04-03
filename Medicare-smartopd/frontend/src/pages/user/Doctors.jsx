import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { UserCircle, Calendar, Star, Search, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await API.get('/users/doctors');
                const fetchedDoctors = response.data?.data || [];
                setDoctors(fetchedDoctors);
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doctor =>
        (doctor.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.Doctor?.specialization || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>Find a Doctor</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '16px' }}>Browse our expert doctors</p>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search by doctor name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                        <Loader size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
                        <p>Loading doctors...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
                            <div key={doctor.id} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--pill-purple-bg)', color: 'var(--pill-purple-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserCircle size={24} />
                                    </div>
                                    <span style={{ background: 'var(--pill-success-bg)', color: 'var(--pill-success-text)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                        Available
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Dr. {doctor.name}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>{doctor.Doctor?.specialization || "General"}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                    <Star size={16} fill="var(--text-primary)" color="var(--text-primary)" />
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>4.8</span>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>({doctor.Doctor?.experienceYears || 0} years exp.)</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--pill-success-text)', margin: 0 }}>₹{doctor.Doctor?.opdFees || 500}</h2>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>per visit</span>
                                </div>

                                <Link to="/user/book-appointment" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--pill-success-text)', color: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', marginTop: 'auto' }}>
                                    <Calendar size={18} />
                                    Book Appointment
                                </Link>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                No doctors found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </UserLayout>
    );
}
