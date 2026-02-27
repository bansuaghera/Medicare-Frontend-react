import AdminLayout from "../../layouts/AdminLayout";
import {
    ChevronLeft,
    Save,
    Check
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/patients.css";

export default function AddDoctor() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(isEdit ? "Doctor updated successfully!" : "Doctor registered successfully!");
        navigate("/admin/doctors");
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <Link to="/admin/doctors" className="back-link">
                    <ChevronLeft size={20} />
                    <span>Back</span>
                </Link>

                <div className="page-header">
                    <div className="page-title">
                        <h1>{isEdit ? "Edit Doctor" : "Add New Doctor"}</h1>
                        <p>{isEdit ? "Update doctor profile" : "Register a new doctor"}</p>
                    </div>
                </div>

                <div className="form-card">
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
                                <label>Specialty *</label>
                                <select required>
                                    <option value="">Select specialty</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Neurology">Neurology</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>License Number *</label>
                                <input type="text" placeholder="Enter license number" required />
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" placeholder="+1 234-567-8900" required />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" placeholder="doctor@example.com" required />
                            </div>

                            <div className="form-group">
                                <label>Consultation Fee (₹)</label>
                                <input type="number" placeholder="50.00" />
                            </div>

                            <div className="form-group">
                                <label>Experience (years)</label>
                                <input type="number" placeholder="5" />
                            </div>

                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                <Check size={18} />
                                <span>{isEdit ? "Update Doctor" : "Save Doctor"}</span>
                            </button>
                            <Link to="/admin/doctors" className="cancel-btn">
                                <span>Cancel</span>
                            </Link>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
