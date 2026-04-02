import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    Search,
    Edit3,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/patients.css";

export default function Medicines() {
    const medicineData = [
        { id: 1, name: "Amlodipine 5mg", category: "Cardiovascular", stock: 500, price: "₹150.00", supplier: "PharmaCorp" },
        { id: 2, name: "Metformin 500mg", category: "Diabetes", stock: 750, price: "₹85.50", supplier: "MediSupply" },
        { id: 3, name: "Amoxicillin 500mg", category: "Antibiotic", stock: 300, price: "₹210.00", supplier: "PharmaCorp" },
        { id: 4, name: "Ibuprofen 400mg", category: "Pain Relief", stock: 1000, price: "₹45.00", supplier: "HealthDist" },
        { id: 5, name: "Omeprazole 20mg", category: "Gastro", stock: 400, price: "₹120.00", supplier: "MediSupply" },
    ];

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>Medicine Master</h1>
                        <p>Manage medicine inventory</p>
                    </div>
                    <Link to="/admin/medicines/add" className="add-btn">
                        <Plus size={20} />
                        <span>Add Medicine</span>
                    </Link>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="inner-search">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search medicines..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Medicine Name</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th>Supplier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicineData.map((med) => (
                                    <tr key={med.id}>
                                        <td>{med.id}</td>
                                        <td className="patient-name">{med.name}</td>
                                        <td>{med.category}</td>
                                        <td style={{ fontWeight: 600 }}>{med.stock}</td>
                                        <td>{med.price}</td>
                                        <td>{med.supplier}</td>
                                        <td>
                                            <div className="actions">
                                                <Link to="/admin/medicines/add?mode=edit" className="action-btn">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button className="action-btn delete"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Showing {medicineData.length} results</span>
                        <div className="pagination-btns">
                            <button className="page-btn">Previous</button>
                            <button className="page-btn">Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
