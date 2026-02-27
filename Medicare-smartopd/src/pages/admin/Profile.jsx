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
    ChevronLeft
} from "lucide-react";
import "../../styles/patients.css";

export default function UserProfile() {
    // Mock data for a versatile profile view
    const user = {
        name: "John Smith",
        role: "Patient",
        email: "john.smith@example.com",
        phone: "+1 234 567 8900",
        address: "123 Medical Center, Healthcare City",
        dob: "1990-05-15",
        joinDate: "2023-10-12",
        id: "MED-90210",
        gender: "Male",
        bloodGroup: "O+",
        status: "Active"
    };

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
                        <p>View detailed information for {user.name}</p>
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
                                background: '#e7f7f3',
                                color: '#0fb48c',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '48px',
                                fontWeight: 800,
                                margin: '0 auto 20px'
                            }}>
                                {user.name.charAt(0)}
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>{user.name}</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{user.id}</p>
                            <span style={{
                                background: '#e7f7f3',
                                color: '#0fb48c',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700
                            }}>
                                {user.role}
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
                                    <p style={{ fontWeight: 600 }}>{user.name}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Gender</label>
                                    <p style={{ fontWeight: 600 }}>{user.gender}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Date of Birth</label>
                                    <p style={{ fontWeight: 600 }}>{user.dob}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Blood Group</label>
                                    <p style={{ fontWeight: 600 }}>{user.bloodGroup}</p>
                                </div>
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
                                        <p style={{ fontWeight: 600 }}>{user.email}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px' }}><Phone size={18} color="#64748b" /></div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Phone Number</label>
                                        <p style={{ fontWeight: 600 }}>{user.phone}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', gridColumn: 'span 2' }}>
                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px' }}><MapPin size={18} color="#64748b" /></div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Residential Address</label>
                                        <p style={{ fontWeight: 600 }}>{user.address}</p>
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
                                    <p style={{ fontWeight: 600 }}>{user.joinDate}</p>
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
                                        {user.status}
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
