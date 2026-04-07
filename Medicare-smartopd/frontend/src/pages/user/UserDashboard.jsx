import React, { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import {
    Calendar,
    User,
    CheckCircle,
    Clock,
    Plus,
    Search,
    UserCircle2,
    Activity,
    Pill,
    Droplets,
    HeartPulse,
    Thermometer,
    Scale,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    ListOrdered
} from "lucide-react";

import API from "../../api/axiosConfig";
import "../../styles/adminDashboard.css";

import UserQuickActions from "../../components/user/UserQuickActions";
import UserUpcomingAppointments from "../../components/user/UserUpcomingAppointments";

// --- REFINED STAT CARD ---
const MiniStat = ({ title, value, icon: Icon, color, bg }) => (
    <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #eaecf0', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)' }}>
        <div style={{ background: bg, width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ fontSize: '11px', fontWeight: '800', color: '#667085', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#101828', margin: 0 }}>{value}</h3>
        </div>
    </div>
);

export default function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [stats, setStats] = useState({
        upcoming: 0,
        totalVisits: 0,
        prescriptions: 0,
        lastVisit: null,
        bloodGroup: 'O+',
        latestVitals: null,
        latestMedicines: [],
        latestDiagnosis: null
    });

    const FETCHED_DUMMY_VITALS = {
        Heartrate: "74 bpm",
        BP: "118/76",
        Temp: "98.4°F",
        Weight: "68 kg"
    };

    const FETCHED_DUMMY_MEDICINES = [
        { name: "Paracetamol", dosage: "500mg", frequency: "2 times a day" },
        { name: "Cough Syrup", dosage: "5ml", frequency: "Before sleep" }
    ];

    const fetchDashboardData = async () => {
        if (!user.id) return;
        try {
            const [statsRes, appointmentsRes, activitiesRes] = await Promise.all([
                API.get(`/users/dashboard/stats?role=user&userId=${user.id}`),
                API.get(`/appointments/patient/${user.id}`),
                API.get(`/activities/recent/${user.id}?limit=5`)
            ]);

            if (statsRes.data.success) {
                const d = statsRes.data.data;
                setStats({
                    upcoming: d.myUpcomingAppointments || 0,
                    totalVisits: d.myTotalVisits || 0,
                    prescriptions: d.myPrescriptionsCount || 0,
                    lastVisit: d.lastVisit,
                    bloodGroup: d.bloodGroup || '---',
                    medicalHistory: d.medicalHistory || '---',
                    latestVitals: d.latestVitals || null,
                    latestMedicines: d.latestMedicines || [],
                    latestDiagnosis: d.latestDiagnosis
                });
            }

            if (appointmentsRes.data.success) {
                setAppointments(appointmentsRes.data.data.filter(app => ['pending', 'in-progress'].includes(app.status)));
            }
            if (activitiesRes.data) setActivities(activitiesRes.data);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboardData(); }, [user.id]);

    const getVitalIcon = (key) => {
        switch(key.toLowerCase()) {
            case 'bp': return <Activity size={20} color="#f04438" />;
            case 'heartrate': return <HeartPulse size={20} color="#f04438" />;
            case 'temp': return <Thermometer size={20} color="#f79009" />;
            case 'weight': return <Scale size={20} color="#2e90fa" />;
            default: return <Droplets size={20} color="#0fb48c" />;
        }
    };

    return (
        <UserLayout panelTitle="User Panel">
            <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px' }}>
                
                {/* 1. TOP HEADER & HEALTH PROGRESS BAR */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', margin: 0 }}>Hello, {user.name}!</h1>
                        </div>
                        <p style={{ fontSize: '16px', color: '#667085', margin: 0 }}>Discover your personal health dashboard and upcoming visits.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                         <div style={{ background: '#F9F5FF', border: '1px solid #E9D7FE', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Droplets size={20} color="#7F56D9" fill="#7F56D9" />
                            <span style={{ fontWeight: '800', fontSize: '14px', color: '#6941C6' }}>BLOOD: {stats.bloodGroup}</span>
                         </div>
                    </div>
                </div>

                {/* 2. MAIN GRID LAYOUT (BENTO STYLE) */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    
                    {/* LEFT COLUMN: MAIN JOURNEY */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* HEALTH JOURNEY TIMELINE CARD */}
                        <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0fb48c, #079669)', borderRadius: '32px', padding: '40px', color: '#fff', boxShadow: '0 20px 40px -10px rgba(15,180,140,0.4)' }}>
                            <div style={{ zIndex: 1, position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', opacity: 0.9 }}>
                                    <Clock size={20} />
                                    <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>CLINIC STATUS TODAY</span>
                                </div>
                                <h2 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '12px' }}>{new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</h2>
                                <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px', maxWidth: '400px' }}>Your next checkup is pending. Book now to keep your health on track.</p>
                                
                                <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                                     <div>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '800', opacity: 0.7 }}>LAST VISIT</p>
                                        <p style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{stats.lastVisit ? new Date(stats.lastVisit).toLocaleDateString() : '---'}</p>
                                     </div>
                                     <div>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '800', opacity: 0.7 }}>LATEST DIAGNOSIS</p>
                                        <p style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{stats.latestDiagnosis || "Routine Checkup"}</p>
                                     </div>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', color: '#fff', opacity: 0.1 }}><HeartPulse size={280} /></div>
                        </div>

                        {/* HIGH-PRIORITY ACTIVE TOKEN TRACKER */}
                        {appointments.some(a => a.date === new Date().toISOString().split('T')[0]) && (
                            <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: '32px', border: '1px solid #bae6fd', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#0284c7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <ListOrdered size={32} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0c4a6e', margin: 0 }}>Active Clinic Token</h3>
                                        <p style={{ fontSize: '14px', color: '#0369a1', margin: '4px 0 0 0', fontWeight: '600' }}>Your live position in today's clinic queue.</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '48px', fontWeight: '900', color: '#0284c7', lineHeight: 1, letterSpacing: '-2px' }}>
                                        #{appointments.find(a => a.date === new Date().toISOString().split('T')[0])?.tokenNumber || "---"}
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: '900', color: '#0284c7', letterSpacing: '1px' }}>TIC-NO.</span>
                                </div>
                            </div>
                        )}

                        {/* STATS MINI GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                            <MiniStat title="Upcoming" value={stats.upcoming} icon={Calendar} bg="#F2F4F7" color="#344054" />
                            <MiniStat title="Visits" value={stats.totalVisits} icon={CheckCircle2} bg="#ECFDF3" color="#12B76A" />
                            <MiniStat title="RPTS" value={stats.prescriptions} icon={TrendingUp} bg="#EFF8FF" color="#2E90FA" />
                        </div>

                        {/* UPCOMING VISITS SECTION */}
                        <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#101828', margin: 0 }}>Active Appointments</h3>
                                <Link to="/user/appointments" style={{ fontSize: '14px', fontWeight: '700', color: '#0fb48c', textDecoration: 'none' }}>View All Visit History</Link>
                            </div>
                            <UserUpcomingAppointments appointments={appointments} />
                             {appointments.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>No upcoming sessions found.</p>
                                    <Link to="/user/book-appointment" style={{ background: '#0fb48c', color: '#fff', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '14px' }}>Book Appointment</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PERSONAL HEALTH BAR */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* QUICK ACTION BAR */}
                        <UserQuickActions />

                        {/* VITALS PANEL */}
                        <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <Activity size={20} color="#0fb48c" />
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#101828', margin: 0 }}>Vitals Overview</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {stats.latestVitals ? Object.entries(stats.latestVitals).map(([key, val]) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {getVitalIcon(key)}
                                            <span style={{ fontSize: '13px', color: '#667085', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key === 'heartRate' || key === 'Heartrate' ? 'HR' : key}</span>
                                        </div>
                                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#101828' }}>{val}</span>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "16px", color: "#667085", fontSize: "14px" }}>
                                        Not recorded yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MEDICATIONS MINI PANEL */}
                        <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#101828', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Pill size={20} color="#6366f1" />
                                Recent Medications
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {stats.latestMedicines.length > 0 ? stats.latestMedicines.slice(0, 3).map((med, i) => (
                                    <div key={i} style={{ padding: '16px', background: '#fefce8', borderRadius: '16px', border: '1px solid #fef08a' }}>
                                        <p style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b', margin: '0 0 4px 0' }}>{med.name}</p>
                                        <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>{med.dosage} • {med.frequency}</p>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "16px", color: "#667085", fontSize: "14px" }}>
                                        No active medications
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECURITY SHIELD */}
                        <div style={{ background: '#ECFDF3', borderRadius: '24px', padding: '24px', display: 'flex', gap: '16px', border: '1px solid #D1FADF' }}>
                            <ShieldCheck color="#12B76A" />
                            <div>
                                <p style={{ fontSize: '13px', fontWeight: '900', color: '#067647', margin: '0 0 4px 0' }}>HIPAA COMPLIANT</p>
                                <p style={{ fontSize: '12px', color: '#067647', margin: 0, opacity: 0.8 }}>Your medical records are encrypted and securely stored.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

// Add these to global CSS or layout if needed
const style = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;