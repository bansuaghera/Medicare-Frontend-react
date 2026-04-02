import AdminLayout from "../../layouts/AdminLayout";
import {
    Plus,
    Copy,
    Edit3,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/prescription.css";

export default function Templates() {
    const templates = [
        { title: "Hypertension Follow-up", meds: 3, used: 45, date: "2024-02-10" },
        { title: "Diabetes Management", meds: 4, used: 38, date: "2024-02-11" },
        { title: "Common Cold", meds: 5, used: 92, date: "2024-02-12" },
        { title: "Post-Surgery Care", meds: 6, used: 12, date: "2024-02-09" },
    ];

    return (
        <AdminLayout panelTitle="Admin Panel">
            <div className="patients-page">

                <div className="page-header">
                    <div className="page-title">
                        <h1>Prescription Templates</h1>
                        <p>Manage prescription templates</p>
                    </div>
                    <Link to="/admin/templates/add" className="add-btn">
                        <Plus size={20} />
                        <span>New Template</span>
                    </Link>
                </div>

                <div className="templates-grid">
                    {templates.map((tpl, i) => (
                        <div className="template-card" key={i}>
                            <div className="card-actions">
                                <button title="Duplicate"><Copy size={16} /></button>
                                <Link to="/admin/templates/add?mode=edit" title="Edit"><Edit3 size={16} /></Link>
                                <button title="Delete" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                            </div>
                            <h3>{tpl.title}</h3>
                            <div className="template-meta">
                                <div>{tpl.meds} medicines</div>
                                <div>Used {tpl.used} times</div>
                            </div>
                            <div className="template-footer">
                                <span>{tpl.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </AdminLayout>
    );
}
