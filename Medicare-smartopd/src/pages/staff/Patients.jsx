import React, { useState } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Patients() {
    const [searchTerm, setSearchTerm] = useState("");

    const patients = [
        { id: "1", name: "John Smith", age: 45, gender: "Male", phone: "+1 234-567-8900", lastVisit: "2024-02-10", status: "Active" },
        { id: "2", name: "Sarah Johnson", age: 32, gender: "Female", phone: "+1 234-567-8901", lastVisit: "2024-02-09", status: "Active" },
        { id: "3", name: "Michael Chen", age: 58, gender: "Male", phone: "+1 234-567-8902", lastVisit: "2024-01-28", status: "Inactive" },
        { id: "4", name: "Emily Davis", age: 28, gender: "Female", phone: "+1 234-567-8903", lastVisit: "2024-02-11", status: "Active" },
        { id: "5", name: "Robert Wilson", age: 41, gender: "Male", phone: "+1 234-567-8904", lastVisit: "2024-02-06", status: "Active" },
    ];

    return (
        <StaffLayout panelTitle="Staff Panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Patients</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Manage patient records</p>
                </div>
                <Link to="/staff/register-patient" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0fb48c', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '500' }}>
                    <Plus size={18} /> Add Patient
                </Link>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

                <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '16px 16px 16px 0', color: '#666', fontWeight: '500', fontSize: '14px' }}>ID</th>
                            <th style={{ padding: '16px', color: '#666', fontWeight: '500', fontSize: '14px' }}>Patient Name</th>
                            <th style={{ padding: '16px', color: '#666', fontWeight: '500', fontSize: '14px' }}>Age</th>
                            <th style={{ padding: '16px', color: '#666', fontWeight: '500', fontSize: '14px' }}>Gender</th>
                            <th style={{ padding: '16px', color: '#666', fontWeight: '500', fontSize: '14px' }}>Phone</th>
                            <th style={{ padding: '16px', color: '#666', fontWeight: '500', fontSize: '14px' }}>Last Visit</th>
                            <th style={{ padding: '16px', color: '#666', fontWeight: '500', fontSize: '14px' }}>Status</th>
                            <th style={{ padding: '16px 0 16px 16px', color: '#666', fontWeight: '500', fontSize: '14px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td style={{ padding: '16px 16px 16px 0', fontSize: '14px', color: '#333' }}>{patient.id}</td>
                                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500', color: '#333' }}>{patient.name}</td>
                                <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>{patient.age}</td>
                                <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>{patient.gender}</td>
                                <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>{patient.phone}</td>
                                <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>{patient.lastVisit}</td>
                                <td style={{ padding: '16px', fontSize: '14px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        background: patient.status === 'Active' ? '#e8fdf5' : '#f5f5f5',
                                        color: patient.status === 'Active' ? '#0fb48c' : '#666'
                                    }}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 0 16px 16px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', color: '#666' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><Eye size={18} /></button>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><Edit size={18} /></button>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Showing {patients.length} results</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>Previous</button>
                        <button style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>Next</button>
                    </div>
                </div>

            </div>
        </StaffLayout>
    );
}
