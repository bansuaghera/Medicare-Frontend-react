import React, { useState } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { ArrowLeft, UserPlus, Save, X, Phone, Mail, Calendar as CalIcon, User, Info, CheckCircle2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function RegisterPatient() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        address: "",
        medicalHistory: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.gender) {
            toast.error("Please provide all required clinical fields.");
            return;
        }

        const email = formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}${Math.floor(100+Math.random()*900)}@medicare-patient.com`;
        
        setLoading(true);
        const loadToast = toast.loading("Enrolling patient into registry...");
        
        try {
            const res = await API.post("/users/register", {
                name: `${formData.firstName} ${formData.lastName}`,
                email: email,
                role: "user", // 'user' role is 'patient' in this system
                phone: formData.phone,
                dob: formData.dob,
                gender: formData.gender,
                bloodGroup: formData.bloodGroup,
                address: formData.address,
                medicalHistory: formData.medicalHistory
            });

            if (res.data.success) {
                toast.success("Patient successfully enrolled in SmartOPD registry!", { id: loadToast });
                if (res.data.autoPassword) {
                    toast(`Auto-generated Password: ${res.data.autoPassword}`, { duration: 6000, icon: '🔑' });
                }
                navigate("/staff/patients");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed. Record may already exist.", { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <StaffLayout panelTitle="Patient Enrollment">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: '#fff', border: '1px solid #eaecf0', cursor: 'pointer', padding: '12px', borderRadius: '14px', color: '#667085', boxShadow: 'var(--shadow-sm)' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '950', color: '#101828', marginBottom: '4px' }}>New Patient Registry</h1>
                        <p style={{ color: '#667085', fontSize: '16px', margin: 0 }}>Create a centralized clinical profile for OPD consultation.</p>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '32px', padding: '40px', border: '1px solid #eaecf0', boxShadow: 'var(--shadow-sm)' }}>
                    <form onSubmit={handleSubmit}>
                        
                        {/* SECTION: BASIC IDENTITY */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #f2f4f7' }}>
                            <User size={18} color="#0fb48c" />
                            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#101828', margin: 0 }}>Identity Roster</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>First Name *</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="e.g. Rahul" required style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Last Name *</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="e.g. Verma" required style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Date of Birth *</label>
                                <div style={{ position: 'relative' }}>
                                    <input name="dob" value={formData.dob} onChange={handleChange} type="date" required style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Clinical Gender *</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', backgroundColor: '#f9fafb', color: '#444', fontWeight: '600' }}>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Blood Group</label>
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', backgroundColor: '#f9fafb', color: '#444', fontWeight: '600' }}>
                                    <option value="">Unknown</option>
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* SECTION: CONTACT CHANNELS */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #f2f4f7' }}>
                            <Phone size={18} color="#0fb48c" />
                            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#101828', margin: 0 }}>Communication Channels</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Mobile Number *</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91 XXXX-XXXXXX" required style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Email Address (Opt-in for e-Prescription)</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="patient@cloud.com" style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION: CLINICAL HISTORY */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #f2f4f7' }}>
                            <Info size={18} color="#0fb48c" />
                            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#101828', margin: 0 }}>Medical Context</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Residential Address</label>
                                <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Street, Building, City, Zip" style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '850', color: '#344054' }}>Known Allergies / Pre-existing Conditions</label>
                                <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} placeholder="e.g. Penicillin allergy, Type 2 Diabetes, Hypertension..." rows={3} style={{ padding: '14px', borderRadius: '16px', border: '1px solid #d0d5dd', outline: 'none', background: '#f9fafb', fontFamily: 'inherit', resize: 'none' }} />
                            </div>
                        </div>

                        <div style={{ background: '#f9fafb', padding: '32px', borderRadius: '24px', border: '1px solid #eaecf0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <ShieldCheck size={32} color="#0fb48c" />
                                <div>
                                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#101828' }}>Data Encryption Enabled</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#667085', fontWeight: '600' }}>Patient personal data is protected by hospital SOC2 compliance.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button type="button" onClick={() => navigate(-1)} style={{ background: '#fff', color: '#475467', border: '1px solid #d0d5dd', padding: '14px 32px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer' }}>Discard</button>
                                <button type="submit" disabled={loading} style={{ background: '#0fb48c', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: '16px', fontWeight: '950', cursor: 'pointer', display: "flex", alignItems: "center", gap: "10px", boxShadow: '0 4px 12px rgba(15,180,140,0.2)' }}>
                                    <Save size={18} /> {loading ? "ENROLLING..." : "COMMIT TO REGISTRY"}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
