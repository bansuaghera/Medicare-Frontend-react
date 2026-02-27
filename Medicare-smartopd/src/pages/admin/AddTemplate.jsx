import AdminLayout from "../../layouts/AdminLayout";
import {
    ChevronLeft,
    Info,
    Lightbulb,
    Layout
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/patients.css";
import "../../styles/prescription.css";

export default function AddTemplate() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">
                <Link to="/admin/templates" className="back-link">
                    <ChevronLeft size={20} />
                    <span>{isEdit ? "Edit Template" : "Add New Template"}</span>
                </Link>
                <p style={{ color: '#64748b', fontSize: '14px', marginLeft: '45px', marginTop: '-15px', marginBottom: '30px' }}>
                    Create a reusable prescription template
                </p>

                <div className="template-form-container">

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Template Information */}
                        <div className="form-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#0fb48c' }}>
                                <Layout size={20} />
                                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Template Information</h3>
                            </div>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Template Name *</label>
                                    <input type="text" placeholder="e.g., Common Cold Treatment" required />
                                </div>
                                <div className="form-group">
                                    <label>Template Type *</label>
                                    <select required>
                                        <option>Select type</option>
                                        <option>Standard</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select required>
                                        <option>Select category</option>
                                        <option>General</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Specialty/Department</label>
                                    <select>
                                        <option>Select specialty</option>
                                        <option>Cardiology</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis & Symptoms */}
                        <div className="form-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#0fb48c' }}>
                                <Info size={20} />
                                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Diagnosis & Symptoms</h3>
                            </div>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Chief Complaint/Diagnosis *</label>
                                    <input type="text" placeholder="e.g., Upper Respiratory Tract Infection (URTI)" required />
                                </div>
                                <div className="form-group full-width">
                                    <label>Common Symptoms</label>
                                    <textarea rows="2" placeholder="List common symptoms for this condition..."></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <label>Clinical Findings</label>
                                    <textarea rows="2" placeholder="Expected examination findings..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Medications */}
                        <div className="form-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#0fb48c' }}>
                                <Layout size={20} />
                                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Medications</h3>
                            </div>
                            <div className="form-group full-width" style={{ marginBottom: '20px' }}>
                                <label>Prescription Details *</label>
                                <textarea rows="4" placeholder="Example: Tab. Paracetamol 500mg -- 1-0-1 -- After food -- 5 days; Tab. Azithromycin 500mg -- 1-0-0 -- After food -- 3 days"></textarea>
                            </div>

                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '10px', display: 'block' }}>Quick Add Common Medicines</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {['Paracetamol 500mg', 'Amoxicillin 500mg', 'Ibuprofen 400mg', 'Omeprazole 20mg', 'Cetirizine 10mg'].map(med => (
                                    <div key={med} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                        <input type="checkbox" /> {med}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            <button className="add-btn" style={{ padding: '12px 30px' }} onClick={() => navigate("/admin/templates")}>
                                {isEdit ? "Update Template" : "Create Template"}
                            </button>
                            <button className="cancel-btn" onClick={() => navigate("/admin/templates")}>Cancel</button>
                        </div>

                    </div>

                    {/* Right Sidebar */}
                    <div className="sidebar-content">
                        <div className="sidebar-stats-card">
                            <div className="stat-row">
                                <h4 style={{ color: '#0fb48c' }}>48</h4>
                                <p>Total Templates Active (System)</p>
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '15px 0' }} />
                            <div className="stat-row">
                                <h4 style={{ color: '#4f46e5' }}>Common Cold</h4>
                                <p>Most Used (240 times this month)</p>
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '15px 0' }} />
                            <div className="stat-row">
                                <h4 style={{ color: '#7c3aed' }}>~5 min</h4>
                                <p>Time Saved Per Prescription</p>
                            </div>
                        </div>

                        <div className="sidebar-stats-card" style={{ background: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#0fb48c' }}>
                                <Lightbulb size={18} />
                                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Tips</h4>
                            </div>
                            <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li>Use a clear, descriptive template name</li>
                                <li>Include standard dosing but allow easy modifications</li>
                                <li>Add common investigations</li>
                            </ul>
                        </div>

                        <div className="sidebar-stats-card">
                            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '15px' }}>Popular Templates</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ fontSize: '13px', padding: '10px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>Hypertension Follow-up</div>
                                <div style={{ fontSize: '13px', padding: '10px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>Diabetes Screening</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
