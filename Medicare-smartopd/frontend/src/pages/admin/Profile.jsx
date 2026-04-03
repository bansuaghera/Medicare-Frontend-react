import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    Stethoscope
} from "lucide-react";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";

export default function UserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(userId ? true : false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

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
                        designation: userData.Staff.designation,
                        phone: userData.Staff.phone
                    };
                }

                setUser({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: role,
                    ...profileData,
                    status: "Active",
                    joinDate: userData.createdAt?.split("T")[0] || "N/A"
                });
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError("Failed to load user profile");
            toast.error("Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    // Mock data for demonstration when no userId is provided
    const defaultUser = {
        name: "Rahul Verma",
        role: "Patient",
        email: "rahul.v@example.com",
        phone: "+91 98765 00001",
        address: "123 Swasthya Kendra, New Delhi",
        dob: "1990-05-15",
        joinDate: "2023-10-12",
        id: "MED-90210",
        gender: "Male",
        bloodGroup: "O+",
        status: "Active",
        specialty: null,
        experienceYears: null,
        age: null
    };

    const displayUser = user || defaultUser;

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

    if (error && userId) {
        return (
            <AdminLayout panelTitle="Admin Panel">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div style={{ textAlign: 'center', color: '#d32f2f' }}>
                        <div style={{ fontSize: '20px', marginBottom: '16px' }}>Error</div>
                        <p>{error}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

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
                        <h1>Profile Information</h1>
                        <p>View detailed information for {displayUser.name}</p>
                    </div>
                    <button className="add-btn">
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>

                    {/* Left Column - Quick Overview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="form-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                background: displayUser.role === 'Doctor' ? '#f3e5f5' : '#e7f7f3',
                                color: displayUser.role === 'Doctor' ? '#7c3aed' : '#0fb48c',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '48px',
                                fontWeight: 800,
                                margin: '0 auto 20px'
                            }}>
                                {displayUser.role === 'Doctor' ? <Stethoscope size={48} /> : displayUser.name.charAt(0)}
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>{displayUser.name}</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{displayUser.id}</p>
                            <span style={{
                                background: displayUser.role === 'Doctor' ? '#f3e5f5' : '#e7f7f3',
                                color: displayUser.role === 'Doctor' ? '#7c3aed' : '#0fb48c',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700
                            }}>
                                {displayUser.role}
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
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Full Name</label>
                                    <p style={{ fontWeight: 600 }}>{displayUser.name}</p>
                                </div>
                                {displayUser.role === 'Doctor' && displayUser.specialty && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Specialty</label>
                                        <p style={{ fontWeight: 600 }}>{displayUser.specialty}</p>
                                    </div>
                                )}
                                {displayUser.role === 'Doctor' && displayUser.experienceYears && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Experience</label>
                                        <p style={{ fontWeight: 600 }}>{displayUser.experienceYears} years</p>
                                    </div>
                                )}
                                {displayUser.role === 'Patient' && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Gender</label>
                                            <p style={{ fontWeight: 600 }}>{displayUser.gender || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Age</label>
                                            <p style={{ fontWeight: 600 }}>{displayUser.age || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Blood Group</label>
                                            <p style={{ fontWeight: 600 }}>{displayUser.bloodGroup || 'N/A'}</p>
                                        </div>
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
                                        <p style={{ fontWeight: 600 }}>{displayUser.email}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px' }}><Phone size={18} color="#64748b" /></div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Phone Number</label>
                                        <p style={{ fontWeight: 600 }}>{displayUser.phone || 'N/A'}</p>
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
                                    <p style={{ fontWeight: 600 }}>{displayUser.joinDate}</p>
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
                                        {displayUser.status}
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
