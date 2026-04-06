import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { UserCircle, Calendar, Star, Search, Loader, ListOrdered, X, Clock, User, ShieldCheck, Filter, UserPlus, Heart, Stethoscope, Microscope, Activity, ArrowRight, CheckCircle2, MapPin, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // FILTERS
    const [activeSpecialization, setActiveSpecialization] = useState("All Specialties");
    const [activeDoctorId, setActiveDoctorId] = useState("All Doctors");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docsRes, apptsRes] = await Promise.all([
                    API.get('/users/doctors'),
                    API.get('/appointments')
                ]);
                setDoctors(docsRes.data?.data || []);
                setAllAppointments(apptsRes.data?.data || []);
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); 
        return () => clearInterval(interval);
    }, []);

    const specializations = ["All Specialties", ...new Set(doctors.map(d => d.Doctor?.specialization || "General Medicine"))];
    
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSpec = activeSpecialization === "All Specialties" || (doctor.Doctor?.specialization || "General Medicine") === activeSpecialization;
        const matchesDoc = activeDoctorId === "All Doctors" || doctor.id === activeDoctorId;
        const matchesSearch = (doctor.name || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSpec && matchesDoc && matchesSearch;
    });

    const getDocStats = (docId) => {
        const today = new Date().toISOString().split("T")[0];
        const docAppts = allAppointments.filter(a => a.doctorId === docId && a.date === today && a.status !== 'cancelled');
        const totalHistorical = allAppointments.filter(a => a.doctorId === docId).length;
        return {
            totalToday: docAppts.length,
            waiting: docAppts.filter(a => a.status === 'pending').length,
            inProgress: docAppts.filter(a => a.status === 'in-progress').length,
            lifetime: totalHistorical,
            queue: docAppts.sort((a, b) => a.tokenNumber - b.tokenNumber)
        };
    };

    const maskName = (name) => {
        if (!name) return "Patient";
        const parts = name.split(" ");
        return parts.map(p => p.length > 2 ? p[0] + "***" + p[p.length-1] : p[0] + "*").join(" ");
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'in-progress': return { bg: '#ebf2fc', color: '#1d4ed8', label: 'Consulting' };
            case 'completed': return { bg: '#ecfdf5', color: '#047857', label: 'Completed' };
            default: return { bg: '#f9fafb', color: '#667085', label: 'Waiting' };
        }
    };

    const filterBtnStyle = (isActive) => ({
        padding: '12px 24px', borderRadius: '30px', border: '1px solid', fontSize: '13px', fontWeight: '900', cursor: 'pointer',
        borderColor: isActive ? '#0fb48c' : '#eaecf0',
        background: isActive ? '#0fb48c' : '#fff',
        color: isActive ? '#fff' : '#475467',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', 
        boxShadow: isActive ? '0 4px 12px rgba(15, 180, 140, 0.15)' : 'none'
    });

    return (
        <UserLayout panelTitle="Digital OPD Radar">
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                
                {/* 
                     MASTER FILTER CONTROL CENTER
                */}
                <div style={{ background: '#fff', borderRadius: '32px', padding: '40px', border: '1px solid #eaecf0', marginBottom: '40px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: '950', color: '#101828', marginBottom: '4px' }}>Live OPD Streams</h1>
                            <p style={{ color: '#667085', fontSize: '16px', margin: 0 }}>Filter by department or specific consultant to track live tokens.</p>
                        </div>
                        <div style={{ position: 'relative', width: '350px' }}>
                            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text" placeholder="Dr. Name search..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '16px', border: '1px solid #d0d5dd', background: '#f9fafb', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* SPECIALIZATION FILTER */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '950', color: '#667085', textTransform: 'uppercase', marginBottom: '12px', display: 'block', letterSpacing: '1px' }}>Department Filter</label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {specializations.map(spec => (
                                <button key={spec} onClick={() => { setActiveSpecialization(spec); setActiveDoctorId("All Doctors"); }} style={filterBtnStyle(activeSpecialization === spec)}>
                                    <Filter size={14} /> {spec}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SPECIFIC DOCTOR FILTER (DYNAMIC) */}
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: '950', color: '#0fb48c', textTransform: 'uppercase', marginBottom: '12px', display: 'block', letterSpacing: '1px' }}>Direct Consultant Selection</label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button onClick={() => setActiveDoctorId("All Doctors")} style={filterBtnStyle(activeDoctorId === "All Doctors")}>
                                <Users size={14} /> All Doctors
                            </button>
                            {doctors.filter(d => activeSpecialization === "All Specialties" || (d.Doctor?.specialization || "General Medicine") === activeSpecialization).map(doc => (
                                <button key={doc.id} onClick={() => setActiveDoctorId(doc.id)} style={filterBtnStyle(activeDoctorId === doc.id)}>
                                    <User size={14} /> Dr. {doc.name.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}><Loader size={48} className="animate-spin" /></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '40px' }}>
                        {filteredDoctors.map((doc) => {
                            const stats = getDocStats(doc.id);
                            return (
                                <div key={doc.id} style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f5faff', color: '#175cd3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d1e9ff' }}>
                                                <UserCircle size={56} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '26px', fontWeight: '950', color: '#101828', margin: 0 }}>Dr. {doc.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                                     <span style={{ fontSize: '12px', fontWeight: '900', color: '#0fb48c', textTransform: 'uppercase' }}>{doc.Doctor?.specialization || "MBBS"}</span>
                                                     <span style={{ width: '4px', height: '4px', background: '#d0d5dd', borderRadius: '50%' }}></span>
                                                     <span style={{ fontSize: '13px', color: '#667085', fontWeight: '700' }}>{stats.lifetime} Records</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to="/user/book-appointment" style={{ background: '#0fb48c', color: '#fff', padding: '14px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '950', fontSize: '14px', boxShadow: '0 4px 12px rgba(15, 180, 140, 0.2)' }}>BOOK</Link>
                                    </div>

                                    {/* LIVE TELEMETRY RIBS */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
                                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', textAlign: 'center', border: '1px solid #eaecf0' }}>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: '950', color: '#667085' }}>TODAY LOAD</p>
                                            <p style={{ margin: 0, fontSize: '20px', fontWeight: '950', color: '#101828' }}>{stats.totalToday}</p>
                                        </div>
                                        <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '20px', textAlign: 'center', border: '1px solid #d1fadf' }}>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: '950', color: '#027a48' }}>CONSULTING</p>
                                            <p style={{ margin: 0, fontSize: '20px', fontWeight: '950', color: '#027a48' }}>{stats.inProgress}</p>
                                        </div>
                                        <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '20px', textAlign: 'center', border: '1px solid #fef3c7' }}>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: '950', color: '#b45309' }}>IN QUEUE</p>
                                            <p style={{ margin: 0, fontSize: '20px', fontWeight: '950', color: '#b45309' }}>{stats.waiting}</p>
                                        </div>
                                    </div>

                                    {/* LIVE OPD SEQUENCE STREAM */}
                                    <div style={{ background: '#f5faff', borderRadius: '24px', padding: '24px', border: '1px solid #d1e9ff', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#175cd3', fontWeight: '950', fontSize: '13px' }}><Activity size={16} /> LIVE TOKEN FLOW</div>
                                            <div style={{ fontSize: '11px', color: '#175cd3', fontWeight: '950', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> REAL-TIME</div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {stats.queue.length === 0 ? (
                                                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#98a2b3' }}>
                                                    <Users size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                                    <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic' }}>Clinical traffic currently zero.</p>
                                                </div>
                                            ) : stats.queue.slice(0, 5).map((apt, idx) => {
                                                const s = getStatusStyle(apt.status);
                                                return (
                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', background: '#fff', border: `1px solid #e0e7ff` }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                                            <div style={{ fontSize: '22px', fontWeight: '950', color: apt.status === 'in-progress' ? '#175cd3' : '#101828' }}>#{apt.tokenNumber}</div>
                                                            <div>
                                                                <div style={{ fontSize: '15px', fontWeight: '900' }}>{maskName(apt.Patient?.name)}</div>
                                                                <div style={{ fontSize: '11px', color: '#667085', fontWeight: '700' }}>Booking Slot: {apt.time}</div>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: '10px', fontWeight: '950', color: s.color, textTransform: 'uppercase', background: s.bg, padding: '6px 12px', borderRadius: '8px' }}>{s.label}</span>
                                                    </div>
                                                );
                                            })}
                                            {stats.queue.length > 5 && (
                                                <div style={{ textAlign: 'center', padding: '10px', background: '#f5faff', borderRadius: '12px', fontSize: '12px', fontWeight: '900', color: '#175cd3' }}>
                                                    + {stats.queue.length - 5} More Tokens in Sequence
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </UserLayout>
    );
}
