import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    Edit3,
    Activity,
    Award,
    Clock,
    ChevronLeft,
    Stethoscope,
    Save,
    X
} from "lucide-react";
import ProfilePictureUpload from "../../components/common/ProfilePictureUpload";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import "../../styles/patients.css";

export default function UserProfile() {
    const { user: currentUser } = useAuth();
    const { userId: paramUserId } = useParams();
    const userId = paramUserId || currentUser?.id;
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(searchParams.get('mode') === 'edit');
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    useEffect(() => {
        // Update edit mode based on query parameter
        setIsEditing(searchParams.get('mode') === 'edit');
    }, [searchParams]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/users/${userId}`);
            if (res.data.success) {
                const userData = res.data.data;
                
                // Determine user role based on available data
                let role = "Unknown";
                let profileData = {};

                if (userData.Doctor) {
                    role = "Doctor";
                    profileData = {
                        specialty: userData.Doctor.specialization,
                        phone: userData.Doctor.phone,
                        experienceYears: userData.Doctor.experienceYears,
                        availabilityStatus: userData.Doctor.availabilityStatus
                    };
                } else if (userData.Patient) {
                    role = "Patient";
                    profileData = {
                        age: userData.Patient.age,
                        gender: userData.Patient.gender,
                        phone: userData.Patient.phone,
                        bloodGroup: userData.Patient.bloodGroup
                    };
                } else if (userData.Staff) {
                    role = "Staff";
                    profileData = {
                        designation: userData.Staff.staffRole,
                        phone: userData.Staff.phone,
                        department: userData.Staff.department
                    };
                } else if (userData.role === 'admin') {
                    role = "Administrator";
                    profileData = {
                        phone: userData.phone || "N/A",
                        status: "System Admin"
                    };
                }

                const userObj = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: role,
                    ...profileData,
                    status: "Active",
                    joinDate: userData.createdAt?.split("T")[0] || "N/A",
                    profilePhoto: userData.profilePhoto || null
                };
                setUser(userObj);
                setFormData(userObj);
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError("Failed to load user profile");
            toast.error("Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePhotoSave = async (newPhoto) => {
        setFormData(prev => ({ ...prev, profilePhoto: newPhoto }));
        try {
            await API.put(`/users/${userId}`, { profilePhoto: newPhoto });
            // If viewing self, update local storage
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (currentUser.id === userId) {
                const updatedUser = { ...currentUser, profilePhoto: newPhoto };
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
            toast.success("Profile photo updated successfully");
        } catch (err) {
            toast.error("Failed to save profile photo");
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await API.put(`/users/${userId}`, {
                name: formData.name,
                email: formData.email
            });
            if (res.data.success) {
                setUser(formData);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <AdminLayout panelTitle="Admin Panel">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '16px' }}>Loading...</div>
                        <p style={{ color: '#666' }}>Fetching profile information...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !user) {
        return (
            <AdminLayout panelTitle="Admin Panel">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div style={{ textAlign: 'center', color: '#d32f2f' }}>
                        <div style={{ fontSize: '20px', marginBottom: '16px' }}>Error</div>
                        <p>{error || "No profile data found"}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const displayFormData = Object.keys(formData).length > 0 ? formData : user;

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">
                <button
                    onClick={() => window.history.back()}
                    className="back-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '20px', padding: 0 }}
                >
                    <ChevronLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="page-header">
                    <div className="page-title">
                        <h1>{isEditing ? "Edit Profile" : "Profile Information"}</h1>
                        <p>{isEditing ? "Update user details" : `View detailed information for ${displayFormData.name}`}</p>
                    </div>
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="add-btn"
                        >
                            <Edit3 size={18} />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    background: '#0fb48c', 
                                    color: '#fff', 
                                    border: 'none', 
                                    padding: '10px 20px', 
                                    borderRadius: '8px', 
                                    fontWeight: '500', 
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.7 : 1
                                }}
                            >
                                <Save size={18} />
                                <span>{saving ? "Saving..." : "Save Changes"}</span>
                            </button>
                            <button 
                                onClick={handleCancel}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    background: '#f3f4f6', 
                                    color: '#333', 
                                    border: 'none', 
                                    padding: '10px 20px', 
                                    borderRadius: '8px', 
                                    fontWeight: '500', 
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={18} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>

                    {/* Left Column - Quick Overview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="form-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                            <ProfilePictureUpload 
                                initialImage={displayFormData.profilePhoto} 
                                onSave={handlePhotoSave} 
                                userName={displayFormData.name} 
                            />
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>{displayFormData.name}</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{displayFormData.id}</p>
                            <span style={{
                                background: displayFormData.role === 'Doctor' ? '#f3e5f5' : '#e7f7f3',
                                color: displayFormData.role === 'Doctor' ? '#7c3aed' : '#0fb48c',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700
                            }}>
                                {displayFormData.role}
                            </span>
                        </div>

                        <div className="form-card">
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Engagement Stats</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ padding: '8px', background: '#f0f4ff', color: '#4f46e5', borderRadius: '8px' }}><Activity size={16} /></div>
                                        <span style={{ fontSize: '14px', color: '#64748b' }}>Appointments</span>
                                    </div>
                                    <span style={{ fontWeight: 700 }}>12</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ padding: '8px', background: '#fff7ed', color: '#ea580c', borderRadius: '8px' }}><Clock size={16} /></div>
                                        <span style={{ fontSize: '14px', color: '#64748b' }}>Last Visit</span>
                                    </div>
                                    <span style={{ fontWeight: 700 }}>2 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Personal Information */}
                        <div className="form-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <User size={20} color="#0fb48c" />
                                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Personal Information</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Full Name</label>
                                            <input 
                                                type="text"
                                                value={displayFormData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontWeight: '500', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Email</label>
                                            <input 
                                                type="email"
                                                value={displayFormData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontWeight: '500', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Full Name</label>
                                            <p style={{ fontWeight: 600 }}>{displayFormData.name}</p>
                                        </div>
                                        {displayFormData.role === 'Doctor' && displayFormData.specialty && (
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Specialty</label>
                                                <p style={{ fontWeight: 600 }}>{displayFormData.specialty}</p>
                                            </div>
                                        )}
                                        {displayFormData.role === 'Doctor' && displayFormData.experienceYears && (
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Experience</label>
                                                <p style={{ fontWeight: 600 }}>{displayFormData.experienceYears} years</p>
                                            </div>
                                        )}
                                        {displayFormData.role === 'Patient' && (
                                            <>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Gender</label>
                                                    <p style={{ fontWeight: 600 }}>{displayFormData.gender || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Age</label>
                                                    <p style={{ fontWeight: 600 }}>{displayFormData.age || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Blood Group</label>
                                                    <p style={{ fontWeight: 600 }}>{displayFormData.bloodGroup || 'N/A'}</p>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="form-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <ShieldCheck size={20} color="#0fb48c" />
                                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Contact Details</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px' }}><Mail size={18} color="#64748b" /></div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Email Address</label>
                                        <p style={{ fontWeight: 600 }}>{displayFormData.email}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px' }}><Phone size={18} color="#64748b" /></div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Phone Number</label>
                                        <p style={{ fontWeight: 600 }}>{displayFormData.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Information */}
                        <div className="form-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <Award size={20} color="#0fb48c" />
                                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>System Detail</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Joined Date</label>
                                    <p style={{ fontWeight: 600 }}>{displayFormData.joinDate}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Account Status</label>
                                    <span style={{
                                        background: '#e7f7f3',
                                        color: '#0fb48c',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: 700
                                    }}>
                                        {displayFormData.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
