import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    ChevronLeft,
    Check
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axiosConfig";
import toast from "react-hot-toast";
import "../../styles/patients.css";

export default function AddDoctor() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        specialization: "",
        licenseNumber: "",
        phone: "",
        email: "",
        opdFees: "",
        experienceYears: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading(isEdit ? "Updating doctor..." : "Registering doctor...");
        try {
            const res = await API.post("/users/register", {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                role: "doctor",
                specialization: formData.specialization,
                opdFees: formData.opdFees,
                experienceYears: formData.experienceYears,
                licenseNumber: formData.licenseNumber,
                phone: formData.phone
            });

            if (res.data.success) {
                toast.success(isEdit ? "Doctor updated successfully!" : "Doctor registered! Login password sent to email.", { id: loadToast });
                navigate("/admin/doctors");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add doctor", { id: loadToast });
        }
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
                                <input 
                                    type="text" 
                                    name="firstName"
                                    placeholder="Enter first name" 
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name *</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    placeholder="Enter last name" 
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Specialty *</label>
                                <select 
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                >
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
                                <input 
                                    type="text" 
                                    name="licenseNumber"
                                    placeholder="Enter license number" 
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="+91 98765-43210" 
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="doctor@example.com" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Consultation Fee (₹)</label>
                                <input 
                                    type="number" 
                                    name="opdFees"
                                    placeholder="500" 
                                    value={formData.opdFees}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Experience (years)</label>
                                <input 
                                    type="number" 
                                    name="experienceYears"
                                    placeholder="5" 
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                />
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
