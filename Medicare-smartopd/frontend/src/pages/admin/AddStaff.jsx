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

export default function AddStaff() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get('mode') === 'edit';

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        role: "Receptionist",
        phone: "",
        email: "",
        shift: "Morning",
        department: "General"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading(isEdit ? "Updating staff..." : "Registering staff...");
        try {
            const res = await API.post("/users/register", {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                role: "staff", // The backend role
                staffRole: formData.role,
                shift: formData.shift,
                department: formData.department,
                phone: formData.phone
            });

            if (res.data.success) {
                toast.success(isEdit ? "Staff updated successfully!" : "Staff registered! Login details sent to email.", { id: loadToast });
                navigate("/admin/staff");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add staff", { id: loadToast });
        }
    };

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <Link to="/admin/staff" className="back-link">
                    <ChevronLeft size={20} />
                    <span>Back</span>
                </Link>

                <div className="page-header">
                    <div className="page-title">
                        <h1>{isEdit ? "Edit Staff Member" : "Add New Staff Member"}</h1>
                        <p>{isEdit ? "Update staff information" : "Register a new staff member"}</p>
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
                                <label>Staff Role *</label>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Lab Technician">Lab Technician</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Accountant">Accountant</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Department *</label>
                                <select 
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="General">General</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="OPD">OPD</option>
                                    <option value="Pharmacy">Pharmacy</option>
                                    <option value="Lab">Lab</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Shift *</label>
                                <select 
                                    name="shift"
                                    value={formData.shift}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Morning">Morning (8 AM - 4 PM)</option>
                                    <option value="Evening">Evening (4 PM - 12 AM)</option>
                                    <option value="Night">Night (12 AM - 8 AM)</option>
                                </select>
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
                                    placeholder="staff@example.com" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                <Check size={18} />
                                <span>{isEdit ? "Update Staff" : "Save Staff"}</span>
                            </button>
                            <Link to="/admin/staff" className="cancel-btn">
                                <span>Cancel</span>
                            </Link>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
