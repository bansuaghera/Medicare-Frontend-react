import React, { useState, useEffect } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, CheckCircle, Edit2, Shield, Loader2 } from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import ProfilePictureUpload from "../../components/common/ProfilePictureUpload";
import { useAuth } from "../../context/useAuth";

export default function Profile() {
    const { user: currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

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
                        id: userData.id,
                        name: userData.name || "",
                        email: userData.email || "",
                        role: userData.role,
                        phone: userData.Staff?.phone || userData.phone || "Not set",
                        department: userData.Staff?.department || "General",
                        staffRole: userData.Staff?.staffRole || "Staff",
                        shift: userData.Staff?.shift || "Morning",
                        joinDate: userData.createdAt?.split("T")[0] || "N/A",
                        profilePhoto: userData.profilePhoto || null
                    });
                }
            } catch (err) {
                console.error("Failed to load staff profile:", err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentUser?.id]);

    const handlePhotoSave = async (newPhoto) => {
        setProfile(prev => ({ ...prev, profilePhoto: newPhoto }));
        try {
            await API.put(`/users/${currentUser.id}`, { profilePhoto: newPhoto });
            toast.success("Profile photo updated successfully");
        } catch (err) {
            toast.error("Failed to save profile photo");
        }
    };

    const handleSave = async () => {
        try {
            await API.put(`/users/${currentUser.id}`, { 
                name: profile.name, 
                email: profile.email 
            });
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <Loader2 className="animate-spin" style={{ margin: '0 auto 16px', color: '#0fb48c' }} />
                <p>Loading your profile...</p>
            </div>
        </StaffLayout>
    );

    if (!profile) return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <p>Unable to load profile data.</p>
            </div>
        </StaffLayout>
    );

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>My Profile</h1>
                    <p style={{ color: "#666", fontSize: "14px" }}>Manage your personal and employment information</p>
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
                        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222', marginBottom: '4px' }}>{profile.name}</h2>
                        <p style={{ color: '#0fb48c', fontWeight: '500', marginBottom: '16px' }}>{profile.staffRole} ({profile.department})</p>

                        <div style={{ width: '100%', height: '1px', background: '#eee', marginBottom: '24px' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555', fontSize: '14px' }}>
                                <Mail size={18} color="#999" /> {profile.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555', fontSize: '14px' }}>
                                <Phone size={18} color="#999" /> {profile.phone}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} color="#0fb48c" /> Personal Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Full Name</label>
                                <input type="text" value={profile.name} disabled={!isEditing} onChange={(e) => setProfile({...profile, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Email</label>
                                <input type="email" value={profile.email} disabled={!isEditing} onChange={(e) => setProfile({...profile, email: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Briefcase size={20} color="#0fb48c" /> Employment Details
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                            <div><label style={{ fontSize: '13px', color: '#888' }}>Staff Role</label><p style={{fontWeight: 600}}>{profile.staffRole}</p></div>
                            <div><label style={{ fontSize: '13px', color: '#888' }}>Department</label><p style={{fontWeight: 600}}>{profile.department}</p></div>
                            <div><label style={{ fontSize: '13px', color: '#888' }}>Shift</label><p style={{fontWeight: 600}}>{profile.shift}</p></div>
                            <div><label style={{ fontSize: '13px', color: '#888' }}>Member Since</label><p style={{fontWeight: 600}}>{profile.joinDate}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
