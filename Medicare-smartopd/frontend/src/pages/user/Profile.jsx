import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { User, Mail, ChevronDown, Calendar, Save, Phone, MapPin, Droplet, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "other",
        bloodGroup: "",
        address: "",
        medicalHistory: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user.id) return;
            try {
                // Fetch user + patient data
                const res = await API.get(`/users/patients`);
                if (res.data.success) {
                    const me = res.data.data.find(u => u.id === user.id);
                    if (me) {
                        setFormData({
                            name: me.name || "",
                            email: me.email || "",
                            phone: me.Patient?.phone || "",
                            dob: me.Patient?.dob || "",
                            gender: me.Patient?.gender || "other",
                            bloodGroup: me.Patient?.bloodGroup || "",
                            address: me.Patient?.address || "",
                            medicalHistory: me.Patient?.medicalHistory || ""
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
                // fallback to localStorage
                setFormData(prev => ({ ...prev, name: user.name || "", email: user.email || "" }));
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user.id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const loadToast = toast.loading("Saving profile...");
        try {
            // Update user name/email
            await API.put(`/users/${user.id}`, {
                name: formData.name,
                email: formData.email
            });

            // Update localStorage
            const updatedUser = { ...user, name: formData.name, email: formData.email };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully!", { id: loadToast });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile", { id: loadToast });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <UserLayout panelTitle="User Panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px', color: '#94a3b8' }}>
                    <Loader size={24} style={{ animation: 'spin 1s linear infinite', marginRight: '10px' }} />
                    Loading profile...
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </UserLayout>
        );
    }

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Profile Settings</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Manage your personal information</p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px' }}>
                    {/* Avatar Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800' }}>
                            {formData.name ? formData.name.charAt(0).toUpperCase() : <User size={40} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{formData.name || "User"}</h2>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>Patient ID: {user.id?.slice(0, 8) || "—"}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Name */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)' }} />
                                </div>
                            </div>
                        </div>

                        {/* Phone & DOB */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Phone</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input type="tel" value={formData.phone} readOnly
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)', background: '#f9fafb' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Date of Birth</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input type="date" value={formData.dob} readOnly
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)', background: '#f9fafb' }} />
                                </div>
                            </div>
                        </div>

                        {/* Gender & Blood Group */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Gender</label>
                                <div style={{ position: 'relative' }}>
                                    <select value={formData.gender} disabled
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)', appearance: 'none', background: '#f9fafb' }}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Blood Group</label>
                                <div style={{ position: 'relative' }}>
                                    <Droplet size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />
                                    <input type="text" value={formData.bloodGroup || "—"} readOnly
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)', background: '#f9fafb' }} />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Address</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#6b7280' }} />
                                <textarea value={formData.address} readOnly rows="2"
                                    style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)', resize: 'none', background: '#f9fafb' }} />
                            </div>
                        </div>

                        {/* Medical History */}
                        {formData.medicalHistory && (
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Medical History</label>
                                <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '14px', color: 'var(--text-primary)', background: '#fffbeb', lineHeight: '1.6' }}>
                                    {formData.medicalHistory}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                            <button type="submit" disabled={saving}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: saving ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button type="button" onClick={() => navigate('/user/dashboard')}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-quaternary)', color: 'var(--text-tertiary)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
