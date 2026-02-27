import AdminLayout from "../../layouts/AdminLayout";
import {
    ChevronLeft,
    Save,
    Check,
    Plus
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/patients.css";

export default function AddStaff() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(isEdit ? "Staff member updated successfully!" : "Staff member registered successfully!");
        navigate("/admin/staff");
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => navigate("/admin/staff")}>
                        <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
                    </div>
                    <div className="page-title" style={{ marginBottom: 0 }}>
                        <h1>{isEdit ? "Edit Staff" : "Add New Staff"}</h1>
                        <p>{isEdit ? "Update staff information" : "Register a new staff member"}</p>
                    </div>
                </div>

                <div className="form-card" style={{ maxWidth: '800px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">

                            <div className="form-group">
                                <label>First Name *</label>
                                <input type="text" placeholder="Enter first name" required />
                            </div>

                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" placeholder="Enter last name" required />
                            </div>

                            <div className="form-group">
                                <label>Role *</label>
                                <select required>
                                    <option value="">Select role</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Lab Technician">Lab Technician</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Administrator">Administrator</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Shift *</label>
                                <select required>
                                    <option value="">Select shift</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Night">Night</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" placeholder="+1 234-567-8900" required />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" placeholder="staff@example.com" required />
                            </div>

                        </div>

                        <div className="form-actions" style={{ marginTop: '40px' }}>
                            <button type="submit" className="save-btn" style={{ background: '#0fb48c' }}>
                                <Save size={18} />
                                <span>{isEdit ? "Update Staff" : "Save Staff"}</span>
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/staff")} style={{ borderRadius: '30px', padding: '12px 40px' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
