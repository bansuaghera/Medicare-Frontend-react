import AdminLayout from "../../layouts/AdminLayout";
import {
    Download,
    Printer,
    FileText,
    ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/prescription.css";
import "../../styles/patients.css";

export default function PrescriptionDetail() {
    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <Link to="/admin/prescriptions" className="back-link">
                    <ChevronLeft size={20} />
                    <span>Back</span>
                </Link>

                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '10px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <FileText size={24} />
                        </div>
                        <div className="page-title" style={{ marginBottom: 0 }}>
                            <h1>Prescription</h1>
                            <p>Prescription #1</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="page-btn" style={{ padding: '10px 24px', fontWeight: 600 }}>
                            Download
                        </button>
                        <button className="add-btn" style={{ background: '#0fb48c', padding: '10px 24px', fontWeight: 600 }}>
                            <Printer size={18} style={{ marginRight: '8px' }} />
                            Print
                        </button>
                    </div>
                </div>

                <div className="prescription-view">
                    <div className="pres-header">
                        <div className="clinic-info">
                            <h2>MediCare Smart OPD</h2>
                            <p>123 Medical Center, Healthcare City</p>
                            <p>Phone: +1 234-567-8900</p>
                        </div>
                        <div className="pres-date">
                            <label>Date</label>
                            <span>2024-02-12</span>
                        </div>
                    </div>

                    <div className="info-grid">
                        <div className="info-block">
                            <label>Patient</label>
                            <h4>John Smith</h4>
                            <span>ID: 12345</span>
                        </div>
                        <div className="info-block">
                            <label>Doctor</label>
                            <h4>Dr. Sarah Johnson</h4>
                        </div>
                    </div>

                    <div className="diagnosis-box">
                        <label>Diagnosis</label>
                        <p>Hypertension</p>
                    </div>

                    <div className="diagnosis-box">
                        <label style={{ marginBottom: '20px' }}>Medicines</label>
                        <div className="pres-med-list">
                            <div className="med-item">
                                <div className="med-details">
                                    <h4>Amlodipine 5mg</h4>
                                    <p>Dosage: 1 tablet</p>
                                </div>
                                <div className="dosage-info">
                                    <div className="freq">Once daily</div>
                                    <div className="duration">30 days</div>
                                </div>
                            </div>
                            <div className="med-item">
                                <div className="med-details">
                                    <h4>Metformin 500mg</h4>
                                    <p>Dosage: 1 tablet</p>
                                </div>
                                <div className="dosage-info">
                                    <div className="freq">Twice daily</div>
                                    <div className="duration">30 days</div>
                                </div>
                            </div>
                            <div className="med-item">
                                <div className="med-details">
                                    <h4>Vitamin D3</h4>
                                    <p>Dosage: 1 capsule</p>
                                </div>
                                <div className="dosage-info">
                                    <div className="freq">Once daily</div>
                                    <div className="duration">30 days</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="diagnosis-box" style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '30px' }}>
                        <label>Notes</label>
                        <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#64748b' }}>
                            Take medicines after meals. Follow up after 30 days.
                        </p>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
