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

export default function AddPatient() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        phone: "",
        email: "",
        bloodGroup: "",
        address: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading(isEdit ? "Updating patient..." : "Registering patient...");
        try {
            const res = await API.post("/users/register", {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                role: "user", // Patient role is 'user' in backend
                age: 25, // For now, could calculate from dob
                gender: formData.gender,
                phone: formData.phone,
                bloodGroup: formData.bloodGroup,
                address: formData.address
            });

            if (res.data.success) {
                toast.success(isEdit ? "Patient updated successfully!" : "Patient registered! Login credentials sent to email.", { id: loadToast });
                navigate("/admin/patients");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add patient", { id: loadToast });
        }
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
                        <p>{isEdit ? "Update patient records" : "Register a new patient"}</p>
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
                                <label>Gender *</label>
                                <select 
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Date of Birth *</label>
                                <input 
                                    type="date" 
                                    name="dob"
                                    value={formData.dob}
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
                                    placeholder="patient@example.com" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Blood Group</label>
                                <select 
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
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

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Address</label>
                                <textarea 
                                    name="address"
                                    placeholder="Enter full address" 
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                <Check size={18} />
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
