import { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronDown, Clock } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function BookAppointment() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        doctorId: "",
        date: "",
        time: "",
        reason: ""
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await API.get("/users/doctors");
                if (res.data.success) {
                    setDoctors(res.data.data);
                }
            } catch (error) {
                toast.error("Failed to load doctors list");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Booking your appointment...");
        try {
            const data = {
                ...formData,
                patientId: user.id
            };
            const res = await API.post("/appointments", data);
            if (res.data.success) {
                toast.success("Appointment booked successfully!", { id: loadToast });
                navigate("/user/appointments");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed", { id: loadToast });
        }
    };

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Link to="/user/dashboard" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Book Appointment</h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '15px', marginLeft: '28px' }}>Schedule your visit</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                                Select Doctor <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    required
                                    value={formData.doctorId}
                                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', appearance: 'none', background: '#f8fafc' }}
                                >
                                    <option value="" disabled>{loading ? "Loading doctors..." : "Choose a doctor"}</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name} - {doc.Doctor?.specialization}</option>
                                    ))}
                                </select>
                                <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                                    Preferred Date <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="date" 
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', background: '#f8fafc' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                                    Preferred Time <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select 
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', appearance: 'none', background: '#f8fafc' }}
                                    >
                                        <option value="">Select time slot</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                    </select>
                                    <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                                Reason for Visit
                            </label>
                            <textarea 
                                rows="4" 
                                placeholder="Describe your symptoms or reason for visit..." 
                                value={formData.reason}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', background: '#f8fafc', resize: 'none' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                            <button type="submit" style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0fb48c', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <Calendar size={20} />
                                Confirm Booking
                            </button>
                            <Link to="/user/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#64748b', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: '600' }}>
                                Back
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
