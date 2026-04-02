import AdminLayout from "../../layouts/AdminLayout";
import { ChevronLeft, Save } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/patients.css";

export default function AddMedicine() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">
                <Link to="/admin/medicines" className="back-link">
                    <ChevronLeft size={20} />
                </Link>

                <div className="page-header">
                    <div className="page-title">
                        <h1>{isEdit ? "Edit Medicine" : "Add New Medicine"}</h1>
                        <p>{isEdit ? "Update medicine details" : "Add medicine to inventory"}</p>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Basic Information */}
                    <div className="form-card">
                        <h3 style={{ marginBottom: "24px", fontSize: "17px", fontWeight: 700 }}>Basic Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Medicine Name *</label>
                                <input type="text" placeholder="Enter medicine name" required />
                            </div>
                            <div className="form-group">
                                <label>Generic Name</label>
                                <input type="text" placeholder="Enter generic name" />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select>
                                    <option>Select category</option>
                                    <option>Cardiovascular</option>
                                    <option>Diabetes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Dosage Form</label>
                                <select>
                                    <option>Select form</option>
                                    <option>Tablet</option>
                                    <option>Capsule</option>
                                    <option>Syrup</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Strength/Dosage *</label>
                                <input type="text" placeholder="e.g., 500mg" required />
                            </div>
                            <div className="form-group">
                                <label>Pack Size</label>
                                <input type="text" placeholder="e.g., 10 tablets" />
                            </div>
                        </div>
                    </div>

                    {/* Manufacturer & Supplier */}
                    <div className="form-card">
                        <h3 style={{ marginBottom: "24px", fontSize: "17px", fontWeight: 700 }}>Manufacturer & Supplier</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Manufacturer *</label>
                                <input type="text" placeholder="Enter manufacturer name" required />
                            </div>
                            <div className="form-group">
                                <label>Supplier</label>
                                <input type="text" placeholder="Enter supplier name" />
                            </div>
                        </div>
                    </div>

                    {/* Stock & Inventory */}
                    <div className="form-card">
                        <h3 style={{ marginBottom: "24px", fontSize: "17px", fontWeight: 700 }}>Stock & Inventory</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Current Stock *</label>
                                <input type="number" defaultValue="0" required />
                            </div>
                            <div className="form-group">
                                <label>Reorder Level</label>
                                <input type="number" defaultValue="0" />
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select>
                                    <option>Select unit</option>
                                    <option>Boxes</option>
                                    <option>Strips</option>
                                    <option>Bottles</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="form-card">
                        <h3 style={{ marginBottom: "24px", fontSize: "17px", fontWeight: 700 }}>Pricing Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Purchase Price *</label>
                                <input type="number" placeholder="0.00" step="0.01" required />
                            </div>
                            <div className="form-group">
                                <label>Selling Price *</label>
                                <input type="number" placeholder="0.00" step="0.01" required />
                            </div>
                            <div className="form-group">
                                <label>Tax/GST (%)</label>
                                <input type="number" defaultValue="0" />
                            </div>
                        </div>
                    </div>

                    {/* Expiry & Storage */}
                    <div className="form-card">
                        <h3 style={{ marginBottom: "24px", fontSize: "17px", fontWeight: 700 }}>Expiry & Storage</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Manufacturing Date</label>
                                <input type="date" />
                            </div>
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input type="date" />
                            </div>
                            <div className="form-group">
                                <label>Storage Conditions</label>
                                <select>
                                    <option>Select storage</option>
                                    <option>Cool/Dry Place</option>
                                    <option>Refrigerated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="form-card">
                        <h3 style={{ marginBottom: "24px", fontSize: "17px", fontWeight: 700 }}>Additional Information</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Usage/Indications</label>
                                <textarea rows="3"></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Side Effects</label>
                                <textarea rows="3"></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Special Instructions</label>
                                <textarea rows="3"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Prescription Required</label>
                                <select>
                                    <option>Select option</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="save-btn" onClick={() => navigate("/admin/medicines")}>
                            <Save size={18} />
                            <span>{isEdit ? "Update Medicine" : "Save Medicine"}</span>
                        </button>
                        <button className="cancel-btn" onClick={() => navigate("/admin/medicines")}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
