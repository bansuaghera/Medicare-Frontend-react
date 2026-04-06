import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Mic, SkipForward, RotateCcw, AlertCircle, RefreshCw, User, Stethoscope, Clock } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function CallToken() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentCalling, setCurrentCalling] = useState(null);

    const fetchQueue = async () => {
        try {
            setLoading(true);
            const res = await API.get("/appointments");
            if (res.data.success) {
                const all = res.data.data || [];
                setQueue(all.filter(a => a.status === 'pending'));
                setCurrentCalling(all.find(a => a.status === 'in-progress'));
            }
        } catch (err) {
            toast.error("Failed to load queue");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleCallNext = async () => {
        if (queue.length === 0) {
            toast.error("No patients matching 'Waiting' status");
            return;
        }
        
        const next = queue[0];
        const loadToast = toast.loading(`Calling Token #${next.tokenNumber}...`);
        try {
            // Update status to in-progress (which triggers the user notification)
            await API.put(`/appointments/${next.id}/status`, { status: "in-progress" });
            toast.success(`Token #${next.tokenNumber} (${next.Patient?.name}) called!`, { id: loadToast });
            fetchQueue();
        } catch {
            toast.error("Failed to call token", { id: loadToast });
        }
    };

    const handleRepeatCall = () => {
        if (!currentCalling) {
            toast.error("No patient currently being called");
            return;
        }
        toast.success(`Repeating call for Token #${currentCalling.tokenNumber}...`, { icon: <Mic size={18} /> });
    };

    const handleSkip = async () => {
        if (!currentCalling) return;
        try {
            await API.put(`/appointments/${currentCalling.id}/status`, { status: 'cancelled' });
            toast.success(`Skipped Token #${currentCalling.tokenNumber}`);
            fetchQueue();
        } catch {
            toast.error("Skip failed");
        }
    }

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>Call Patient Token</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Manage active room entries and calls</p>
                </div>
                <button onClick={fetchQueue} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '700px', margin: '0 auto' }}>

                {/* Current Calling Display */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0fb48c, #4589f5)' }} />
                    
                    <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {currentCalling ? "Currently at the Consulting Room" : "No active call"}
                    </p>

                    <div style={{ background: '#f8fafc', border: `3px solid ${currentCalling ? '#0fb48c' : '#e2e8f0'}`, borderRadius: '24px', padding: '48px', marginBottom: '32px', transition: 'all 0.3s' }}>
                        <h2 style={{ fontSize: '72px', fontWeight: '900', color: currentCalling ? '#0fb48c' : '#94a3b8', margin: 0 }}>
                            {currentCalling ? `#${currentCalling.tokenNumber}` : "--"}
                        </h2>
                    </div>

                    {currentCalling ? (
                        <div style={{ marginBottom: '40px animate-bounce' }}>
                            <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{currentCalling.Patient?.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#64748b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={16} /><span>Dr. {currentCalling.Doctor?.name}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /><span>{currentCalling.time}</span></div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '40px', color: '#94a3b8' }}>
                            <p style={{ fontSize: '18px', fontWeight: '600' }}>Ready to call next patient</p>
                        </div>
                    )}

                    <button 
                        onClick={handleCallNext}
                        style={{ width: '100%', background: 'linear-gradient(135deg, #0fb48c, #0d9488)', color: '#fff', border: 'none', padding: '20px', borderRadius: '16px', fontWeight: '800', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(15,180,140,0.3)' }}
                    >
                        <Mic size={24} /> {currentCalling ? "Call Next Token" : "Start Calling Queue"}
                    </button>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button onClick={handleRepeatCall} style={{ flex: 1, background: '#fff', color: '#475569', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <RotateCcw size={18} /> Repeat Call
                        </button>
                        <button onClick={handleSkip} style={{ flex: 1, background: '#fff', color: '#ef4444', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <SkipForward size={18} /> Skip / Absent
                        </button>
                    </div>
                </div>

                {/* Queue Preview */}
                <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={20} color="#0fb48c" /> Next Up in Queue
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {queue.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>The waiting area is currently empty.</div>
                        ) : queue.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '18px', background: item.isEmergency ? '#fef2f2' : '#f8fafc', borderRadius: '12px', border: item.isEmergency ? '1px solid #fecaca' : '1px solid #f1f5f9' }}>
                                <div style={{ background: '#0fb48c', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '16px', fontWeight: '900' }}>
                                    #{item.tokenNumber}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>{item.Patient?.name}</h4>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>Consultation with Dr. {item.Doctor?.name}</p>
                                </div>
                                {item.isEmergency && <span style={{ background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>EMERGENCY</span>}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </StaffLayout>
    );
}
