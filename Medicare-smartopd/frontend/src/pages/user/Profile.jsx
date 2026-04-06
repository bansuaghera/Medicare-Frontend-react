import React, { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { User, Mail, Phone, MapPin, Droplet, Edit2, Shield, Calendar, Activity, Loader } from "lucide-react";
import ProfilePictureUpload from "../../components/common/ProfilePictureUpload";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "other",
        bloodGroup: "",
        address: "",
        medicalHistory: "",
        profilePhoto: null
    });
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                const res = await API.get(`/users/${user.id}`);
                if (res.data.success) {
                    const me = res.data.data;
                    if (me) {
                        setFormData({
                            name: me.name || "",
                            email: me.email || "",
                            phone: me.Patient?.phone || me.phone || "",
                            dob: me.Patient?.dob || "",
                            gender: me.Patient?.gender || "other",
                            bloodGroup: me.Patient?.bloodGroup || "",
                            address: me.Patient?.address || "",
                            medicalHistory: me.Patient?.medicalHistory || "",
                            profilePhoto: me.profilePhoto || null
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to load patient profile:", err);
                toast.error("Failed to load profile");
                setFormData(prev => ({ ...prev, name: user.name || "", email: user.email || "", profilePhoto: user.profilePhoto || null }));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]);

    const handlePhotoSave = async (newPhoto) => {
        setFormData(prev => ({ ...prev, profilePhoto: newPhoto }));
        try {
            await API.put(`/users/${user.id}`, { profilePhoto: newPhoto });
            // Update local storage so header/other components update
            const updatedUser = { ...user, profilePhoto: newPhoto };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("Profile photo updated successfully");
        } catch (err) {
            toast.error("Failed to save profile photo");
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!user?.id) return;
        const loadToast = toast.loading("Saving profile...");
        try {
            await API.put(`/users/${user.id}`, {
                ...formData
            });
            const updatedUser = { ...user, name: formData.name, email: formData.email };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("Profile updated successfully", { id: loadToast });
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
            toast.error(err.response?.data?.message || "Unable to save profile", { id: loadToast });
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

    const nameParts = formData.name.split(" ");
    const initials = nameParts.length > 1 ? nameParts[0][0] + nameParts[1][0] : (formData.name.slice(0, 2).toUpperCase() || "US");

    return (
        <UserLayout panelTitle="User Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", color: 'var(--text-primary)' }}>My Profile</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>Manage your personal and health information</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0fb48c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <Edit2 size={16} />
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-quaternary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0fb48c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
                        >
                            <Edit2 size={16} />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '24px' }}>

                {/* Left Column - Profile Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '32px 24px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ProfilePictureUpload initialImage={formData.profilePhoto} onSave={handlePhotoSave} userName={formData.name} />
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>{formData.name || 'User'}</h2>
                        <p style={{ color: '#0fb48c', fontWeight: '600', marginBottom: '16px' }}>Patient</p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <span style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>ID: {user?.id?.slice(0, 8) || 'N/A'}</span>
                            <span style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Blood: {formData.bloodGroup || 'Not set'}</span>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', marginBottom: '24px' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500' }}>
                                <Mail size={18} /> <span style={{ color: 'var(--text-primary)' }}>{formData.email || 'Email not set'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500' }}>
                                <Phone size={18} /> <span style={{ color: 'var(--text-primary)' }}>{formData.phone || 'Phone not set'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500' }}>
                                <MapPin size={18} /> <span style={{ color: 'var(--text-primary)' }}>{formData.address || 'Address not set'}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} color="#0fb48c" /> Personal Information
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.dob}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Gender</label>
                                <select
                                    value={formData.gender || 'other'}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                >
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Address</label>
                                <input
                                    type="text"
                                    value={formData.address || ''}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={20} color="#ef4444" /> Health Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Blood Group</label>
                                <input
                                    type="text"
                                    value={formData.bloodGroup}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                                    placeholder={isEditing ? 'e.g. O+, A-' : ''}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Patient ID</label>
                                <input
                                    type="text"
                                    value={user?.id || ''}
                                    disabled={true}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                            
                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Medical History</label>
                                <textarea
                                    value={formData.medicalHistory}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                                    placeholder={isEditing ? 'Any past conditions, allergies, or surgeries' : 'No medical history reported'}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-input)', background: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </UserLayout>
    );
}
