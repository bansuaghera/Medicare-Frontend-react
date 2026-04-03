import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Check, ChevronLeft, FileText, Loader2, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Examination() {
    const navigate = useNavigate();
    const { appointmentId: paramAppointmentId } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [appointment, setAppointment] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(paramAppointmentId || "");

    // Form state
    const [bloodPressure, setBloodPressure] = useState("");
    const [temperature, setTemperature] = useState("");
    const [pulseRate, setPulseRate] = useState("");
    const [weight, setWeight] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [treatmentPlan, setTreatmentPlan] = useState("");

    // Fetch today's appointments for the dropdown
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user.id) return;
            setLoading(true);
            try {
                const res = await API.get(`/appointments/doctor/${user.id}`);
                if (res.data.success) {
                    setTodayAppointments(res.data.data);
                    // If appointmentId came from URL, find and set that appointment
                    if (paramAppointmentId) {
                        const apt = res.data.data.find(a => a.id === paramAppointmentId);
                        if (apt) setAppointment(apt);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch appointments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [user.id, paramAppointmentId]);

    // When dropdown selection changes
    const handleAppointmentChange = (e) => {
        const id = e.target.value;
        setSelectedAppointmentId(id);
        const apt = todayAppointments.find(a => a.id === id);
        setAppointment(apt || null);
    };

    const activeAppointmentId = selectedAppointmentId || paramAppointmentId;

    const buildVitals = () => ({
        bloodPressure,
        temperature,
        pulseRate,
        weight
    });

    // Save Notes handler
    const handleSaveNotes = async () => {
        if (!activeAppointmentId) {
            toast.error("Please select an appointment first");
            return;
        }
        if (!symptoms && !diagnosis && !treatmentPlan && !bloodPressure) {
            toast.error("Please fill in at least one field");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                appointmentId: activeAppointmentId,
                doctorId: user.id,
                patientId: appointment?.patientId || null,
                vitals: buildVitals(),
                symptoms,
                diagnosis,
                treatmentPlan
            };

            const res = await API.post("/prescriptions/save-notes", payload);
            if (res.data.success) {
                toast.success("Examination notes saved!");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save notes");
        } finally {
            setSaving(false);
        }
    };

    // Create Prescription handler
    const handleCreatePrescription = async () => {
        if (!activeAppointmentId) {
            toast.error("Please select an appointment first");
            return;
        }
        if (!diagnosis) {
            toast.error("Diagnosis is required to create a prescription");
            return;
        }

        setCreating(true);
        try {
            const payload = {
                appointmentId: activeAppointmentId,
                doctorId: user.id,
                patientId: appointment?.patientId || null,
                vitals: buildVitals(),
                diagnosis,
                advice: treatmentPlan,
                medicines: [],
                nextFollowUp: null
            };

            const res = await API.post("/prescriptions/create", payload);
            if (res.data.success) {
                toast.success("Prescription created successfully!");
                navigate("/doctor/prescriptions");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create prescription");
        } finally {
            setCreating(false);
        }
    };

    const inputStyle = {
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        background: '#fafafa',
        outline: 'none',
        fontSize: '15px',
        transition: 'border-color 0.2s',
        width: '100%',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333'
    };

    const activePatients = todayAppointments.filter(a => a.status !== 'cancelled');

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                    <ChevronLeft size={24} color="#333" />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Examination Notes</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        {appointment
                            ? `Patient: ${appointment.Patient?.name || 'Unknown'} — Token #${appointment.tokenNumber}`
                            : 'Select a patient appointment below'}
                    </p>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Appointment Selector — always visible if no paramAppointmentId */}
                    {!paramAppointmentId && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: '#f0faf6', borderRadius: '10px', border: '1px solid #d0ece3' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#0fb48c' }}>Select Appointment *</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={selectedAppointmentId}
                                    onChange={handleAppointmentChange}
                                    style={{
                                        ...inputStyle,
                                        background: '#fff',
                                        appearance: 'none',
                                        paddingRight: '40px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    <option value="">— Choose a patient appointment —</option>
                                    {activePatients.map(apt => (
                                        <option key={apt.id} value={apt.id}>
                                            {apt.date} | Token #{apt.tokenNumber} — {apt.Patient?.name || 'Unknown'} ({apt.status})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} />
                            </div>
                            {activePatients.length === 0 && !loading && (
                                <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>No appointments found. Please book an appointment from the Staff panel first.</p>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={labelStyle}>Blood Pressure</label>
                            <input
                                type="text"
                                value={bloodPressure}
                                onChange={e => setBloodPressure(e.target.value)}
                                placeholder="e.g. 120/80"
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={labelStyle}>Temperature (°F)</label>
                            <input
                                type="text"
                                value={temperature}
                                onChange={e => setTemperature(e.target.value)}
                                placeholder="e.g. 98.6"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={labelStyle}>Pulse Rate</label>
                            <input
                                type="text"
                                value={pulseRate}
                                onChange={e => setPulseRate(e.target.value)}
                                placeholder="e.g. 72"
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={labelStyle}>Weight (kg)</label>
                            <input
                                type="text"
                                value={weight}
                                onChange={e => setWeight(e.target.value)}
                                placeholder="e.g. 65"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={labelStyle}>Symptoms</label>
                        <textarea
                            value={symptoms}
                            onChange={e => setSymptoms(e.target.value)}
                            placeholder="Describe the patient's symptoms..."
                            style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={labelStyle}>Diagnosis</label>
                        <textarea
                            value={diagnosis}
                            onChange={e => setDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis..."
                            style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={labelStyle}>Treatment Plan</label>
                        <textarea
                            value={treatmentPlan}
                            onChange={e => setTreatmentPlan(e.target.value)}
                            placeholder="Describe the treatment plan..."
                            style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={handleSaveNotes}
                            disabled={saving || !activeAppointmentId}
                            style={{
                                background: saving ? '#a0d8c8' : !activeAppointmentId ? '#ccc' : '#0fb48c',
                                color: '#fff',
                                border: 'none',
                                padding: '14px 28px',
                                borderRadius: '8px',
                                fontWeight: '500',
                                fontSize: '15px',
                                cursor: saving || !activeAppointmentId ? 'not-allowed' : 'pointer',
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                opacity: saving ? 0.7 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={18} />}
                            {saving ? 'Saving...' : 'Save Notes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCreatePrescription}
                            disabled={creating || !activeAppointmentId}
                            style={{
                                background: creating ? '#f0f0f0' : '#fff',
                                color: !activeAppointmentId ? '#bbb' : '#444',
                                border: '1px solid #ddd',
                                padding: '14px 28px',
                                borderRadius: '8px',
                                fontWeight: '500',
                                fontSize: '15px',
                                cursor: creating || !activeAppointmentId ? 'not-allowed' : 'pointer',
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                opacity: creating ? 0.7 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {creating ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <FileText size={18} />}
                            {creating ? 'Creating...' : 'Create Prescription'}
                        </button>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </DoctorLayout>
    );
}
