import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { UserCircle, Calendar, Star, Search, Loader, ListOrdered, X, Clock, User, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewQueueDoc, setViewQueueDoc] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docsRes, apptsRes] = await Promise.all([
                    API.get('/users/doctors'),
                    API.get('/appointments')
                ]);
                setDoctors(docsRes.data?.data || []);
                setAllAppointments(apptsRes.data?.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); // Live update
        return () => clearInterval(interval);
    }, []);

    const filteredDoctors = doctors.filter(doctor =>
        (doctor.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.Doctor?.specialization || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter appointments for a specific doctor, sorted by token
    const getDoctorQueue = (docId) => {
        const today = new Date().toISOString().split("T")[0];
        return allAppointments
            .filter(a => a.doctorId === docId && a.date === today && a.status !== 'cancelled')
            .sort((a, b) => a.tokenNumber - b.tokenNumber);
    };

    // Helper to mask name for privacy
    const maskName = (name) => {
        if (!name) return "Patient";
        const parts = name.split(" ");
        return parts.map(p => p.length > 2 ? p[0] + "***" + p[p.length-1] : p[0] + "*").join(" ");
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'in-progress': return { bg: '#dbeafe', color: '#1d4ed8', label: 'Consulting' };
            case 'completed': return { bg: '#dcfce7', color: '#166534', label: 'Finished' };
            default: return { bg: '#f8fafc', color: '#64748b', label: 'Waiting' };
        }
    }

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>Our Medical Specialists</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0fb48c', fontSize: '14px', fontWeight: '600' }}>
                           <ShieldCheck size={16} /> <span>Privacy Protected Queue Viewing Only</span>
                        </div>
                    </div>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Find a specialist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>
                        <Loader size={48} className="animate-spin" />
                        <p style={{ marginTop: '16px', fontWeight: '600' }}>Loading available doctors...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                        {filteredDoctors.map((doctor) => {
                            const queue = getDoctorQueue(doctor.id);
                            return (
                                <div key={doctor.id} style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f8fafc', color: '#0fb48c', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                                <UserCircle size={32} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Dr. {doctor.name}</h3>
                                                <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', margin: 0 }}>{doctor.Doctor?.specialization}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', color: '#1e293b' }}>
                                        <div style={{ background: '#f0fdf4', padding: '10px 16px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                                            <p style={{ fontSize: '11px', color: '#0fb48c', fontWeight: '800', margin: '0 0 4px 0' }}>FEE</p>
                                            <p style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>₹{doctor.Doctor?.opdFees || 500}</p>
                                        </div>
                                        <div style={{ background: '#fff7ed', padding: '10px 16px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                                            <p style={{ fontSize: '11px', color: '#ea580c', fontWeight: '800', margin: '0 0 4px 0' }}>XP</p>
                                            <p style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>{doctor.Doctor?.experienceYears || 0} Yrs</p>
                                        </div>
                                        <div 
                                            onClick={() => setViewQueueDoc(doctor)}
                                            style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', flex: 1, textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                                        >
                                            <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', margin: '0 0 4px 0' }}>QUEUE</p>
                                            <p style={{ fontSize: '18px', fontWeight: '900', color: '#0fb48c', margin: 0 }}>{queue.filter(q => q.status === 'pending').length}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                        <Link to="/user/book-appointment" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0fb48c', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                                            <Calendar size={18} /> Book Now
                                        </Link>
                                        <button 
                                            onClick={() => setViewQueueDoc(doctor)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#475569', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            <ListOrdered size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Queue Modal with Privacy Shield */}
                {viewQueueDoc && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.75)", backdropFilter: 'blur(10px)', display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                        <div style={{ background: "#fff", borderRadius: "24px", padding: "40px", maxWidth: "550px", width: "90%", maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div>
                                    <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", marginBottom: '4px' }}>Live Queue: Dr. {viewQueueDoc.name}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0fb48c', fontSize: '12px', fontWeight: '800' }}>
                                        <Clock size={14} /> LIVE STATUS FEED
                                    </div>
                                </div>
                                <button onClick={() => setViewQueueDoc(null)} style={{ border: 'none', background: '#f8fafc', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                            </div>

                            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '12px' }}>
                                {getDoctorQueue(viewQueueDoc.id).length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No patients in line for today yet.</div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {getDoctorQueue(viewQueueDoc.id).map((apt, idx) => {
                                            const s = getStatusBadge(apt.status);
                                            return (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '16px', background: s.bg, border: `1px solid ${s.color}22` }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                        <div style={{ fontSize: '18px', fontWeight: '900', color: s.color, minWidth: '40px' }}>#{apt.tokenNumber}</div>
                                                        <div>
                                                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <User size={14} color="#94a3b8" />
                                                                {maskName(apt.Patient?.name)}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Schedule: {apt.time}</div>
                                                        </div>
                                                    </div>
                                                    <span style={{ fontSize: '10px', fontWeight: '900', color: s.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ marginTop: '32px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <ShieldCheck color="#0fb48c" size={24} />
                                <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                                    <strong>Privacy Policy:</strong> Full patient identities and diagnostic reasons are hidden from public view for security compliance.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
