import { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronDown, Clock, Search, User, Stethoscope, ArrowRight, Star } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function BookAppointment() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [doctors, setDoctors] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        time: "",
        reason: "",
        isEmergency: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [docsRes, apptsRes] = await Promise.all([
                    API.get("/users/doctors"),
                    API.get("/appointments")
                ]);
                
                if (docsRes.data.success) setDoctors(docsRes.data.data);
                if (apptsRes.data.success) setAllAppointments(apptsRes.data.data || []);
            } catch (error) {
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getDoctorAppointmentCount = (docId) => {
        const today = new Date().toISOString().split("T")[0];
        return allAppointments.filter(a => a.doctorId === docId && a.date === today && a.status !== 'cancelled').length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Booking your appointment...");
        try {
            let timeValue = formData.time;
            const data = {
                patientId: user.id,
                doctorId: selectedDoctor.id,
                date: formData.date,
                time: timeValue,
                reason: formData.reason,
                isEmergency: formData.isEmergency
            };
            const res = await API.post("/appointments/book", data);
            if (res.data.success) {
                toast.success(`Booked! Your token: #${res.data.token}`, { id: loadToast, duration: 4000 });
                navigate("/user/appointments");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed", { id: loadToast });
        }
    };

    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (doc.Doctor?.specialization || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!selectedDoctor) {
        return (
            <UserLayout panelTitle="User Panel">
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>Select Your Doctor</h1>
                        <p style={{ color: '#64748b', fontSize: '16px' }}>Choose a specialist to book your session</p>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '40px', maxWidth: '500px' }}>
                        <Search size={22} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Find by name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>Discovering doctors...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                            {filteredDoctors.map(doc => {
                                const count = getDoctorAppointmentCount(doc.id);
                                return (
                                    <div key={doc.id} style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0fb48c' }}>
                                                <User size={32} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Dr. {doc.name}</h3>
                                                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>{doc.Doctor?.specialization || "Physician"}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '4px' }}>ROOM NO</p>
                                                <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>10{Math.floor(Math.random() * 9) + 1}</p>
                                            </div>
                                            <div style={{ width: '1px', background: '#e2e8f0' }} />
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '4px' }}>TODAY'S PKTS</p>
                                                <p style={{ fontSize: '15px', fontWeight: '700', color: '#0fb48c' }}>{count}</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => setSelectedDoctor(doc)}
                                            style={{ width: '100%', background: 'linear-gradient(135deg, #0fb48c, #0d9488)', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                        >
                                            Book Appointment <ArrowRight size={18} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <button onClick={() => setSelectedDoctor(null)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1e293b', margin: 0 }}>Consult Dr. {selectedDoctor.name}</h1>
                            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{selectedDoctor.Doctor?.specialization}</p>
                        </div>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '40px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>Select Consultation Date</label>
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', background: '#f8fafc' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>Select Time Slot</label>
                                <div style={{ position: 'relative' }}>
                                    <select 
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', appearance: 'none', background: '#f8fafc' }}
                                    >
                                        <option value="">Choose your time</option>
                                        <option value="09:00:00">09:00 AM</option>
                                        <option value="10:00:00">10:00 AM</option>
                                        <option value="11:00:00">11:00 AM</option>
                                        <option value="12:00:00">12:00 PM</option>
                                        <option value="14:00:00">02:00 PM</option>
                                        <option value="15:00:00">03:00 PM</option>
                                        <option value="16:00:00">04:00 PM</option>
                                    </select>
                                    <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>Reason for Consultation</label>
                            <textarea 
                                rows="4" 
                                placeholder="Tell us about your health concerns..." 
                                value={formData.reason}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', background: '#f8fafc', resize: 'none' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fef2f2', padding: '20px', borderRadius: '16px', border: '1px solid #fecaca' }}>
                            <input 
                                type="checkbox" 
                                id="isEmergency"
                                checked={formData.isEmergency}
                                onChange={(e) => setFormData({...formData, isEmergency: e.target.checked})}
                                style={{ width: '22px', height: '22px', accentColor: '#ef4444', cursor: 'pointer' }}
                            />
                            <div style={{ flex: 1 }}>
                                <label htmlFor="isEmergency" style={{ fontSize: '16px', fontWeight: '800', color: '#b91c1c', cursor: 'pointer', display: 'block', marginBottom: '2px' }}>
                                    Emergency Case
                                </label>
                                <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }}>This will move your token to highest priority.</p>
                            </div>
                        </div>

                        <button type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, #0fb48c, #0d9488)', color: '#fff', padding: '18px', borderRadius: '16px', border: 'none', fontSize: '18px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15,180,140,0.3)' }}>
                            <Calendar size={22} />
                            Complete Booking
                        </button>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
