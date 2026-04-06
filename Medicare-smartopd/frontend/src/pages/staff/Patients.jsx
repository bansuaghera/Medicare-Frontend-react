import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Search, Plus, Eye, Edit, Trash2, CheckSquare, Square, RefreshCw, User, Phone, Calendar, UserCheck, X, ShieldCheck, Mail, MapPin, Activity, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Patients() {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [viewPatient, setViewPatient] = useState(null);
    const [editPatient, setEditPatient] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPatients = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await API.get('/users/patients');
            if (res.data.success) {
                setPatients(res.data.data || []);
            }
        } catch (error) {
            toast.error("Failed to sync clinical registry.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPatients(); }, []);

    const handleSelectToggle = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = () => setSelectedIds(selectedIds.length === filteredPatients.length ? [] : filteredPatients.map(p => p.id));

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently remove this patient profile?")) return;
        try {
            await API.delete(`/users/${id}`);
            toast.success("Patient profile removed.");
            setPatients(patients.filter(p => p.id !== id));
        } catch { toast.error("Removal failed."); }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Permanently remove ${selectedIds.length} profiles?`)) return;
        try {
            await API.post("/users/bulk-delete", { ids: selectedIds }); 
            toast.success("Registry cleaned.");
            setPatients(patients.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        } catch { toast.error("Cleanup failed."); }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await API.put(`/users/${editPatient.id}`, {
                name: editPatient.name,
                email: editPatient.email,
                phone: editPatient.Patient?.phone,
                dob: editPatient.Patient?.dob,
                gender: editPatient.Patient?.gender,
                bloodGroup: editPatient.Patient?.bloodGroup,
                address: editPatient.Patient?.address,
                medicalHistory: editPatient.Patient?.medicalHistory
            });
            if (res.data.success) {
                toast.success("Profile updated successfully.");
                setPatients(patients.map(p => p.id === editPatient.id ? { ...p, ...editPatient } : p));
                setEditPatient(null);
            }
        } catch { toast.error("Update failed."); }
        finally { setIsSaving(false); }
    };

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.Patient?.phone || p.phone || "").includes(searchTerm)
    );

    return (
        <StaffLayout panelTitle="Staff Operational Desk">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#101828', marginBottom: '4px' }}>Patient Registry</h1>
                        <p style={{ color: '#667085', fontSize: '16px' }}>Manage centralized medical profiles and visit records.</p>
                    </div>
                    <Link to="/staff/register-patient" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0fb48c', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '800', boxShadow: '0 4px 12px rgba(15,180,140,0.2)' }}>
                        <Plus size={20} /> New Enrollment
                    </Link>
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #eaecf0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                            <div style={{ position: 'relative', width: '380px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }} />
                                <input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '18px', border: '1px solid #d0d5dd', background: '#f9fafb', outline: 'none' }} />
                            </div>
                            <button onClick={() => fetchPatients(true)} style={{ background: '#fff', border: '1px solid #eaecf0', padding: '12px', borderRadius: '18px', cursor: 'pointer' }}><RefreshCw size={18} className={loading ? 'animate-spin' : ''}/></button>
                        </div>
                        {selectedIds.length > 0 && (
                            <button onClick={handleDeleteSelected} style={{ background: '#fee4e2', color: '#f04438', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Trash2 size={20}/> Wipe Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eaecf0', fontSize: '12px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>
                                        <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {selectedIds.length === filteredPatients.length && filteredPatients.length > 0 ? <CheckSquare size={22} color="#0fb48c" /> : <Square size={22} color="#eaecf0" />}
                                        </button>
                                    </th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Patient Identity</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Communication</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Clinical Info</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '80px', textAlign: 'center' }}>Synchronizing medical records...</td></tr>
                                ) : filteredPatients.length > 0 ? filteredPatients.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb', background: selectedIds.includes(p.id) ? '#f5faff' : 'none', transition: '0.2s' }}>
                                        <td style={{ padding: '24px' }}>
                                            <button onClick={() => handleSelectToggle(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                {selectedIds.includes(p.id) ? <CheckSquare size={22} color="#0fb48c" /> : <Square size={22} color="#eaecf0" />}
                                            </button>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5faff', color: '#175cd3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20}/></div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '800', fontSize: '15px' }}>{p.name}</p>
                                                    <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>ID: REG-{p.id.toString().slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475467', fontWeight: '700' }}><Phone size={14} /> {p.Patient?.phone || p.phone || "---"}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#667085' }}><Mail size={12}/> {p.email}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ fontSize: '13px', fontWeight: '750', color: '#1e293b' }}>{p.Patient?.gender?.toUpperCase() || "---"} / {p.Patient?.bloodGroup || "---"}</div>
                                                <div style={{ fontSize: '11px', color: '#667085', fontWeight: '600' }}>DOB: {p.Patient?.dob || "---"}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => setViewPatient(p)} title="Full Medical Bio" style={{ padding: '10px', borderRadius: '12px', background: '#f5faff', border: '1px solid #d1e9ff', color: '#175cd3', cursor: 'pointer' }}><Eye size={18}/></button>
                                                <button onClick={() => setEditPatient({...p})} title="Modify Record" style={{ padding: '10px', borderRadius: '12px', background: '#fff', border: '1px solid #eaecf0', color: '#475467', cursor: 'pointer' }}><Edit size={18}/></button>
                                                <button onClick={() => handleDelete(p.id)} title="Delete Record" style={{ padding: '10px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#f04438', cursor: 'pointer' }}><Trash2 size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" style={{ padding: '80px', textAlign: 'center', color: '#667085' }}>No clinical profiles matched your search.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* VIEW PATIENT MODAL */}
            {viewPatient && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,24,40,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '32px', width: '100%', maxWidth: '600px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative' }}>
                        <button onClick={() => setViewPatient(null)} style={{ position: 'absolute', right: '24px', top: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24}/></button>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f5faff', color: '#175cd3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={40}/></div>
                            <div>
                                <h2 style={{ fontSize: '28px', fontWeight: '950', color: '#101828', margin: 0 }}>{viewPatient.name}</h2>
                                <p style={{ color: '#0fb48c', fontWeight: '850', fontSize: '14px', margin: '4px 0 0 0' }}>PATIENT ACCESS ACTIVE</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Portal Email</label>
                                <p style={{ margin: 0, fontSize: '15px', fontWeight: '750', color: '#1e293b' }}>{viewPatient.email}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Current Phone</label>
                                <p style={{ margin: 0, fontSize: '15px', fontWeight: '750', color: '#1e293b' }}>{viewPatient.Patient?.phone || "---"}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Gender / Blood</label>
                                <p style={{ margin: 0, fontSize: '15px', fontWeight: '750', color: '#1e293b' }}>{viewPatient.Patient?.gender?.toUpperCase() || "---"} / {viewPatient.Patient?.bloodGroup || "---"}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Birth Date</label>
                                <p style={{ margin: 0, fontSize: '15px', fontWeight: '750', color: '#1e293b' }}>{viewPatient.Patient?.dob || "---"}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Residential Address</label>
                            <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: '#475467', lineHeight: 1.5 }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }}/> {viewPatient.Patient?.address || "No address on record."}</p>
                        </div>

                        <div style={{ background: '#fef2f2', padding: '24px', borderRadius: '24px', border: '1px solid #fee2e2' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#f04438', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16}/> Clinical Notes / History</h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#b91c1c', fontWeight: '600', lineHeight: 1.6 }}>{viewPatient.Patient?.medicalHistory || "Clean medical history reported."}</p>
                        </div>

                        <div style={{ marginTop: '32px', padding: '20px', background: '#f5faff', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #d1e9ff' }}>
                            <ShieldCheck size={24} color="#175cd3" />
                            <p style={{ margin: 0, fontSize: '13px', color: '#175cd3', fontWeight: '800' }}>Patient can login using their email. Random password was shared during enrollment.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT PATIENT MODAL */}
            {editPatient && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,24,40,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '32px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '40px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }}>
                        <button onClick={() => setEditPatient(null)} style={{ position: 'absolute', right: '24px', top: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24}/></button>
                        <h2 style={{ fontSize: '28px', fontWeight: '950', color: '#101828', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>Modify Record <Edit size={24} color="#0fb48c"/></h2>
                        
                        <form onSubmit={handleEditSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Full Name *</label>
                                    <input value={editPatient.name} onChange={e => setEditPatient({...editPatient, name: e.target.value})} type="text" style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Patient Email</label>
                                    <input value={editPatient.email} onChange={e => setEditPatient({...editPatient, email: e.target.value})} type="email" style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Phone *</label>
                                    <input value={editPatient.Patient?.phone || ""} onChange={e => setEditPatient({...editPatient, Patient: {...editPatient.Patient, phone: e.target.value}})} type="text" style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Clinical Gender</label>
                                    <select value={editPatient.Patient?.gender || ""} onChange={e => setEditPatient({...editPatient, Patient: {...editPatient.Patient, gender: e.target.value}})} style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb', color: '#444', fontWeight: '600' }}>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Date of Birth</label>
                                    <input value={editPatient.Patient?.dob || ""} onChange={e => setEditPatient({...editPatient, Patient: {...editPatient.Patient, dob: e.target.value}})} type="date" style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Blood Group</label>
                                    <select value={editPatient.Patient?.bloodGroup || ""} onChange={e => setEditPatient({...editPatient, Patient: {...editPatient.Patient, bloodGroup: e.target.value}})} style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb', color: '#444', fontWeight: '600' }}>
                                        <option value="">Select</option>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Residential Address</label>
                                <input value={editPatient.Patient?.address || ""} onChange={e => setEditPatient({...editPatient, Patient: {...editPatient.Patient, address: e.target.value}})} type="text" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Medical History</label>
                                <textarea value={editPatient.Patient?.medicalHistory || ""} onChange={e => setEditPatient({...editPatient, Patient: {...editPatient.Patient, medicalHistory: e.target.value}})} rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb', fontFamily: 'inherit', resize: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button type="button" onClick={() => setEditPatient(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #d0d5dd', background: '#fff', color: '#475467', fontWeight: '900', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={isSaving} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: '#0fb48c', color: '#fff', fontWeight: '950', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <Save size={20}/> {isSaving ? "Saving..." : "Update Roster"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </StaffLayout>
    );
}
