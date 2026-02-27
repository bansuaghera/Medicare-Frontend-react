import React, { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { User, Mail, Phone, MapPin, Award, Clock, BookOpen, Edit2, Shield } from "lucide-react";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <DoctorLayout panelTitle="Doctor Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>My Profile</h1>
                    <p style={{ color: "#666", fontSize: "14px" }}>Manage your personal and professional information</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0fb48c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
                >
                    <Edit2 size={16} />
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '24px' }}>

                {/* Left Column - Profile Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#e8fdf5', color: '#0fb48c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '48px', fontWeight: '700' }}>
                            SJ
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222', marginBottom: '4px' }}>Dr. Sarah Johnson</h2>
                        <p style={{ color: '#0fb48c', fontWeight: '500', marginBottom: '16px' }}>Senior Cardiologist</p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <span style={{ padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>MBBS</span>
                            <span style={{ padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>MD (Cardiology)</span>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: '#eee', marginBottom: '24px' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555', fontSize: '14px' }}>
                                <Mail size={18} color="#999" /> sarah.johnson@medicare.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555', fontSize: '14px' }}>
                                <Phone size={18} color="#999" /> +1 (555) 123-4567
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#555', fontSize: '14px' }}>
                                <MapPin size={18} color="#999" /> Room 101, Main Wing
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} color="#0fb48c" /> Personal Information
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>First Name</label>
                                <input type="text" value="Sarah" disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Last Name</label>
                                <input type="text" value="Johnson" disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Date of Birth</label>
                                <input type="text" value="1982-05-14" disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Gender</label>
                                <select disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }}>
                                    <option>Female</option>
                                    <option>Male</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
                            <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Bio</label>
                            <textarea disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none', height: '100px', resize: 'none' }} value="Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management."></textarea>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Shield size={20} color="#0fb48c" /> Professional Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Medical License Number</label>
                                <input type="text" value="MD-987654321" disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Years of Experience</label>
                                <input type="text" value="15 Years" disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Consultation Fee</label>
                                <input type="text" value="$150.00" disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Hospital Affiliation</label>
                                <input type="text" value="MediCare General Hospital" disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: isEditing ? '#fff' : '#fcfcfc', color: '#333', fontSize: '15px', outline: 'none' }} />
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </DoctorLayout>
    );
}
