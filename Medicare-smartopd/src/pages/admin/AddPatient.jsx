import AdminLayout from "../../layouts/AdminLayout";
import {
    ChevronLeft,
    Save,
    X,
    User,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ClipboardList
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/patients.css";

export default function AddPatient() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(isEdit ? "Patient updated successfully!" : "Patient registered successfully!");
        navigate("/admin/patients");
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <Link to="/admin/patients" className="back-link">
                    <ChevronLeft size={20} />
                    <span>Back</span>
                </Link>

                <div className="page-header">
                    <div className="page-title">
                        <h1>{isEdit ? "Edit Patient" : "Add New Patient"}</h1>
                        <p>{isEdit ? "Update patient information" : "Register a new patient"}</p>
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
                                <label>Date of Birth *</label>
                                <input type="date" required />
                            </div>

                            <div className="form-group">
                                <label>Gender *</label>
                                <select required>
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Blood Group</label>
                                <select>
                                    <option value="">Select blood group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" placeholder="+1 234-567-8900" required />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="patient@example.com" />
                            </div>

                            <div className="form-group full-width">
                                <label>Address</label>
                                <textarea placeholder="Enter full address" rows="3"></textarea>
                            </div>

                            <div className="form-group full-width">
                                <label>Medical History</label>
                                <textarea placeholder="Any previous medical conditions..." rows="4"></textarea>
                            </div>

                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                <Save size={18} />
                                <span>{isEdit ? "Update Patient" : "Save Patient"}</span>
                            </button>
                            <Link to="/admin/patients" className="cancel-btn">
                                <span>Cancel</span>
                            </Link>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
