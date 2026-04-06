import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Check, ChevronLeft, FileText, Loader2, Plus, Trash2, Calendar as CalendarIcon, MapPin, RefreshCw, Activity, Heart, Thermometer, Scale, Clock, User as UserIcon, Sandwich } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Examination() {
    const navigate = useNavigate();
    const { appointmentId: paramAppointmentId } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [appointment, setAppointment] = useState(null);
    const [allAppointments, setAllAppointments] = useState([]);
    const [selectedId, setSelectedId] = useState(paramAppointmentId || "");

    const [bloodPressure, setBloodPressure] = useState("");
    const [temperature, setTemperature] = useState("");
    const [pulseRate, setPulseRate] = useState("");
    const [weight, setWeight] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [treatmentPlan, setTreatmentPlan] = useState("");
    const [clinicLocation, setClinicLocation] = useState("Main Branch");
    const [medicines, setMedicines] = useState([]);
    const [nextFollowUp, setNextFollowUp] = useState("");

    const fetchAppointments = async (silent = false) => {
        if (!user.id) return;
        if (!silent) setLoading(true);
        try {
            const res = await API.get(`/appointments/doctor/${user.id}`);
            if (res.data.success) {
                setAllAppointments(res.data.data || []);
                const currentId = selectedId || paramAppointmentId;
                if (currentId) {
                    const found = res.data.data.find(a => a.id === currentId);
                    if (found) setAppointment(found);
                }
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchAppointments(); }, [user.id, paramAppointmentId]);

    const handleSelect = (e) => {
        const id = e.target.value;
        setSelectedId(id);
        const found = allAppointments.find(a => a.id === id);
        setAppointment(found || null);
        if (found) toast.success(`Active Session: ${found.Patient?.name}`);
    };

    const buildVitals = () => ({ bloodPressure, temperature, pulseRate, weight });

    const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", frequency: "1-0-1", duration: "5 Days", timing: "After Food" }]);
    const removeMedicine = (index) => setMedicines(medicines.filter((_, i) => i !== index));
    const updateMedicine = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const handleCreatePrescription = async () => {
        const currentAptId = selectedId || paramAppointmentId;
        if (!currentAptId) return toast.error("Select appointment first.");
        if (!diagnosis || medicines.length === 0) return toast.error("Missing diagnosis or medicines.");
        
        setCreating(true);
        try {
            await API.post("/prescriptions/create", {
                appointmentId: currentAptId,
                doctorId: user.id,
                patientId: appointment?.patientId,
                vitals: buildVitals(),
                diagnosis,
                advice: treatmentPlan,
                medicines, // Includes 'timing' now
                nextFollowUp,
                symptoms,
                clinicLocation
            });
            toast.success("Medical record finalized!");
            navigate("/doctor/prescriptions");
        } catch (err) { toast.error("Error finalizing report."); }
        finally { setCreating(false); }
    };

    // Options
    const freqOptions = ["1-0-1", "1-1-1", "1-0-0", "0-0-1", "SOS", "As needed"];
    const timingOptions = ["After Food", "Before Food", "Empty Stomach", "With Food", "At Night"];
    const branches = ["Main Branch", "North Wing", "Tele-Health"];

    const inputStyle = { padding: '12px 14px', borderRadius: '14px', border: '1px solid #eaecf0', background: '#f9fafb', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' };
    const labelStyle = { fontSize: '11px', fontWeight: '850', color: '#667085', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };

    return (
        <DoctorLayout panelTitle="Consulting Wizard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: '#fff', border: '1px solid #eaecf0', padding: '12px', borderRadius: '16px', cursor: 'pointer' }}><ChevronLeft color="#667085" /></button>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', margin: 0 }}>Clinical Examination</h1>
                        <p style={{ color: '#667085', margin: 0 }}>Consulting: {appointment?.Patient?.name || "Awaiting Selection"}</p>
                    </div>
                </div>
                <button onClick={() => fetchAppointments(true)} style={{ background: '#f5faff', border: '1px solid #d1e9ff', color: '#175cd3', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={18} /> Refresh Token Queue
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* APPOINTMENT ENGINE */}
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #eaecf0', boxShadow: 'var(--shadow-sm)' }}>
                        <label style={labelStyle}>Patient Entry Token *</label>
                        <select value={selectedId} onChange={handleSelect} style={{ ...inputStyle, height: '56px', fontSize: '16px', fontWeight: '700' }}>
                            <option value="">— Select an Active Entry —</option>
                            {allAppointments.map(apt => (
                                <option key={apt.id} value={apt.id}>Token #{apt.tokenNumber} • {apt.Patient?.name} ({apt.status})</option>
                            ))}
                        </select>
                    </div>

                    {/* CLINICAL DATA */}
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #eaecf0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                            <div><label style={labelStyle}>BP</label><input placeholder="120/80" value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} style={inputStyle} /></div>
                            <div><label style={labelStyle}>TEMP</label><input placeholder="98.6" value={temperature} onChange={e => setTemperature(e.target.value)} style={inputStyle} /></div>
                            <div><label style={labelStyle}>PULSE</label><input placeholder="72" value={pulseRate} onChange={e => setPulseRate(e.target.value)} style={inputStyle} /></div>
                            <div><label style={labelStyle}>WEIGHT</label><input placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle} /></div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div><label style={labelStyle}>Subjective Symptoms</label><textarea placeholder="Reported symptoms..." value={symptoms} onChange={e => setSymptoms(e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} /></div>
                            <div><label style={labelStyle}>Final Diagnosis *</label><textarea placeholder="Clinical diagnosis..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} style={{ ...inputStyle, minHeight: '80px', fontWeight: '700' }} /></div>
                        </div>
                    </div>

                    {/* MEDICATION PROTOCOL WITH TIMING */}
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #eaecf0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>Treatment Protocol</h3>
                            <button onClick={addMedicine} style={{ background: '#0fb48c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={18}/> New Drug</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {medicines.map((med, index) => (
                                <div key={index} style={{ padding: '24px', background: '#f9fafb', borderRadius: '24px', border: '1px solid #eaecf0' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '16px', marginBottom: '16px' }}>
                                        <div><label style={labelStyle}>Medicine Name</label><input placeholder="Search Drug..." value={med.name} onChange={e => updateMedicine(index, 'name', e.target.value)} style={{ ...inputStyle, background: '#fff' }} /></div>
                                        <div><label style={labelStyle}>Frequency</label><select value={med.frequency} onChange={e => updateMedicine(index, 'frequency', e.target.value)} style={{ ...inputStyle, background: '#fff' }}>{freqOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                                        <div>
                                            <label style={labelStyle}>Food Timing *</label>
                                            <select value={med.timing} onChange={e => updateMedicine(index, 'timing', e.target.value)} style={{ ...inputStyle, background: '#fff', fontWeight: '700' }}>
                                                {timingOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 44px', gap: '16px', alignItems: 'flex-end' }}>
                                        <div><label style={labelStyle}>Special Instructions</label><input placeholder="e.g. Swallow with water..." value={med.dosage} onChange={e => updateMedicine(index, 'dosage', e.target.value)} style={{ ...inputStyle, background: '#fff' }} /></div>
                                        <div><label style={labelStyle}>Duration</label><input placeholder="e.g. 5 days" value={med.duration} onChange={e => updateMedicine(index, 'duration', e.target.value)} style={{ ...inputStyle, background: '#fff' }} /></div>
                                        <button onClick={() => removeMedicine(index)} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: '#fee4e2', color: '#f04438', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={20}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #eaecf0', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Clinical Facility</label>
                            <select value={clinicLocation} onChange={e => setClinicLocation(e.target.value)} style={{ ...inputStyle, fontWeight: '700', color: '#175cd3' }}>
                                {branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Ref / Clinical Advice</label>
                            <textarea placeholder="General advisory notes..." value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)} style={{ ...inputStyle, minHeight: '100px' }} />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={labelStyle}>Planned Follow-up</label>
                            <input type="date" value={nextFollowUp} onChange={e => setNextFollowUp(e.target.value)} style={{ ...inputStyle, background: '#fffbeb' }} />
                        </div>
                        <button onClick={handleCreatePrescription} disabled={creating} style={{ width: '100%', padding: '20px', borderRadius: '16px', border: 'none', background: '#0fb48c', color: '#fff', fontWeight: '900', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            {creating ? <Loader2 className="animate-spin" /> : <Check size={24}/>} Close Consultation
                        </button>
                    </div>
                </div>
            </div>
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DoctorLayout>
    );
}
