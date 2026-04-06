import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { User, Calendar, Search, RefreshCw, ChevronRight, FileText, Activity, Clock } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await API.get("/users/patients");
            if (response.data.success) {
                setPatients(response.data.data);
            }
        } catch (error) {
            console.error("Fetch patients failed", error);
            toast.error("Failed to load patient registry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatientHistory = async (patientId) => {
        setLoadingHistory(true);
        try {
            const response = await API.get(`/appointments/patient/${patientId}`);
            if (response.data.success) {
                // Sort by date descending
                const sorted = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setHistory(sorted);
            }
        } catch (error) {
            console.error("History fetch failed", error);
            toast.error("Failed to load medical history");
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        fetchPatientHistory(patient.id);
    };

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phoneNumber?.includes(searchTerm)
    );

    return (
        <DoctorLayout panelTitle="Patient Registry">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', height: 'calc(100vh - 150px)' }}>
                
                {/* 1. PATIENT LIST SIDEBAR */}
                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #eaecf0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #f2f4f7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#101828', margin: 0 }}>Registered Patients</h2>
                            <button onClick={fetchPatients} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#667085' }}>
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }} />
                            <input 
                                type="text"
                                placeholder="Search by name, phone, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #d0d5dd',
                                    fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                        {loading ? (
                             <div style={{ textAlign: 'center', padding: '40px' }}><RefreshCw className="animate-spin" /></div>
                        ) : filteredPatients.length > 0 ? filteredPatients.map(p => (
                            <div 
                                key={p.id}
                                onClick={() => handleSelectPatient(p)}
                                style={{
                                    padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                                    background: selectedPatient?.id === p.id ? '#f0fdf9' : 'transparent',
                                    border: selectedPatient?.id === p.id ? '1px solid #0fb48c' : '1px solid transparent',
                                    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px'
                                }}
                            >
                                <div style={{ 
                                    width: '48px', height: '48px', borderRadius: '14px', 
                                    background: selectedPatient?.id === p.id ? '#0fb48c' : '#f2f4f7',
                                    color: selectedPatient?.id === p.id ? '#fff' : '#667085',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900'
                                }}>
                                    {p.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#101828' }}>{p.name}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>{p.phoneNumber || 'No phone'}</p>
                                </div>
                                <ChevronRight size={16} color="#98a2b3" />
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#667085' }}>No patients found</div>
                        )}
                    </div>
                </div>

                {/* 2. HISTORY VIEW */}
                <div style={{ overflowY: 'auto' }}>
                    {selectedPatient ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Profile Header */}
                            <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #eaecf0', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#0fb48c1a', color: '#0fb48c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={40} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#101828', margin: 0 }}>{selectedPatient.name}</h2>
                                        <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#f2f4f7', fontSize: '12px', fontWeight: '800', color: '#344054' }}>ID: {selectedPatient.id.toString().slice(-6).toUpperCase()}</span>
                                    </div>
                                    <p style={{ margin: 0, color: '#667085', fontSize: '15px' }}>
                                        {selectedPatient.email} • {selectedPatient.gender || 'Unknown'} • {selectedPatient.bloodGroup || 'B+'}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                     <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#98a2b3', textTransform: 'uppercase' }}>Joined Since</p>
                                     <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>{new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* History Timeline */}
                            <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #eaecf0', padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                                    <Clock size={20} color="#0fb48c" />
                                    <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>Consultation History</h3>
                                </div>

                                {loadingHistory ? (
                                    <div style={{ textAlign: 'center', padding: '60px' }}><RefreshCw className="animate-spin" color="#0fb48c" size={32} /></div>
                                ) : history.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {history.map((visit, idx) => (
                                            <div key={idx} style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid #eaecf0' }}>
                                                <div style={{ 
                                                    position: 'absolute', left: '-9px', top: '0', width: '16px', height: '16px', 
                                                    borderRadius: '50%', background: visit.status === 'completed' ? '#0fb48c' : '#f59e0b',
                                                    border: '4px solid #fff', boxShadow: '0 0 0 1px #eaecf0'
                                                }}></div>
                                                
                                                <div style={{ background: '#f9fafb', borderRadius: '20px', padding: '24px', border: '1px solid #f2f4f7' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <Calendar size={16} color="#667085" />
                                                            <span style={{ fontWeight: '800', fontSize: '15px' }}>{new Date(visit.date).toLocaleDateString()}</span>
                                                            <span style={{ color: '#667085' }}>•</span>
                                                            <span style={{ fontWeight: '600', color: '#667085' }}>{visit.time}</span>
                                                        </div>
                                                        <span style={{ 
                                                            padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '800', 
                                                            background: visit.status === 'completed' ? '#ecfdf3' : '#fff9f0',
                                                            color: visit.status === 'completed' ? '#027a48' : '#b54708',
                                                            textTransform: 'uppercase'
                                                        }}>{visit.status}</span>
                                                    </div>

                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                        <div>
                                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: '#667085', textTransform: 'uppercase' }}>Primary Diagnosis</p>
                                                            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#101828' }}>{visit.diagnosis || "No records"}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: '#667085', textTransform: 'uppercase' }}>Specialist</p>
                                                            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#101828' }}>Dr. {visit.doctor || "N/A"}</p>
                                                        </div>
                                                        <div style={{ gridColumn: 'span 2' }}>
                                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: '#667085', textTransform: 'uppercase' }}>Clinical Notes</p>
                                                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#344054' }}>{visit.treatment || "Routine evaluation and vital tracking performed during visit."}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '24px', border: '1px dashed #eaecf0' }}>
                                        <p style={{ color: '#667085', margin: 0 }}>No previous medical history found for this patient.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ height: '100%', background: '#f9fafb', border: '1px dashed #d0d5dd', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eaecf0' }}>
                                <FileText size={32} color="#98a2b3" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>Patient Records</h3>
                                <p style={{ color: '#667085', margin: 0, maxWidth: '280px' }}>Select a patient from the registry to view their complete journey and history.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </DoctorLayout>
    );
}
