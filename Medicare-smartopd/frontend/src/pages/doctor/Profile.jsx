import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { User, Mail, Phone, MapPin, Award, Clock, BookOpen, Edit2, Shield, Loader2 } from "lucide-react";
import ProfilePictureUpload from "../../components/common/ProfilePictureUpload";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";

export default function Profile() {
    const { user: currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.id) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/users/${currentUser.id}`);
                if (res.data.success) {
                    const userData = res.data.data;
                    setProfile({
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: userData.Doctor?.phone || userData.phone || "",
                        address: userData.Doctor?.address || "MediCare General Hospital",
                        specialization: userData.Doctor?.specialization || "General Medicine",
                        experienceYears: userData.Doctor?.experienceYears ? String(userData.Doctor.experienceYears) : "0",
                        licenseNumber: userData.Doctor?.licenseNumber || "N/A",
                        opdFees: userData.Doctor?.opdFees ? String(userData.Doctor.opdFees) : "500",
                        biography: userData.Doctor?.biography || "",
                        profilePhoto: userData.profilePhoto || null,
                        availabilityStatus: userData.Doctor?.availabilityStatus || "active"
                    });
                }
            } catch (err) {
                console.error("Failed to load doctor profile:", err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentUser?.id]);

    const handleInputChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!currentUser?.id) return;
        try {
            await API.put(`/users/${currentUser.id}`, {
                name: profile.name,
                email: profile.email
            });
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error("Unable to save profile");
        }
    };

    const handlePhotoSave = async (newPhoto) => {
        setProfile(prev => ({ ...prev, profilePhoto: newPhoto }));
        try {
            await API.put(`/users/${currentUser.id}`, { profilePhoto: newPhoto });
            toast.success("Profile photo updated successfully");
        } catch (err) {
            toast.error("Failed to save profile photo");
        }
    };

    if (loading) {
        return (
            <DoctorLayout panelTitle="Doctor Panel">
                <div style={{ padding: '60px', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" style={{ margin: '0 auto 16px', color: '#0fb48c' }} />
                    <p>Loading your profile...</p>
                </div>
            </DoctorLayout>
        );
    }

    if (!profile) return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <p>Unable to load doctor profile.</p>
            </div>
        </DoctorLayout>
    );

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>My Profile</h1>
                    <p style={{ color: "#666", fontSize: "14px" }}>Manage your personal and professional information</p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0fb48c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
                >
                    <Edit2 size={16} />
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ProfilePictureUpload initialImage={profile.profilePhoto} onSave={handlePhotoSave} userName={profile.name} />
                        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222', marginBottom: '4px' }}>Dr. {profile.name}</h2>
                        <p style={{ color: '#0fb48c', fontWeight: '500', marginBottom: '16px' }}>{profile.specialization}</p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <span style={{ padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>Exp: {profile.experienceYears}y</span>
                            <span style={{ padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>Status: {profile.availabilityStatus}</span>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: '#eee', marginBottom: '24px' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555', fontSize: '14px' }}>
                                <Mail size={18} color="#999" /> {profile.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555', fontSize: '14px' }}>
                                <Phone size={18} color="#999" /> {profile.phone || 'Phone not set'}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} color="#0fb48c" /> Personal & Professional Info
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Full Name</label>
                                <input type="text" value={profile.name} disabled={!isEditing} onChange={(e) => handleInputChange('name', e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', fontSize: '15px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Email</label>
                                <input type="email" value={profile.email} disabled={!isEditing} onChange={(e) => handleInputChange('email', e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', fontSize: '15px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', marginTop: '24px' }}>
                            <div><label style={{ fontSize: '13px', color: '#888' }}>Medical License</label><p style={{fontWeight: 600}}>{profile.licenseNumber}</p></div>
                            <div><label style={{ fontSize: '13px', color: '#888' }}>OPD Fees (₹)</label><p style={{fontWeight: 600}}>{profile.opdFees}</p></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
                            <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Biography</label>
                            <textarea value={profile.biography} disabled style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: '#fcfcfc', fontSize: '15px', height: '100px', resize: 'none' }} />
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
