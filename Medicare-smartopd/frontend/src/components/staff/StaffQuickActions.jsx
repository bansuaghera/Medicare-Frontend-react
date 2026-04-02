import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, Calendar, FileText } from "lucide-react";

export default function StaffQuickActions() {
    return (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link to="/staff/register-patient" style={{ textDecoration: 'none' }}>
                    <button style={{ width: "100%", padding: "16px", background: "#0fb48c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                        <UserPlus size={18} /> Register Patient
                    </button>
                </Link>

                <Link to="/staff/appointments" style={{ textDecoration: 'none' }}>
                    <button style={{ width: "100%", padding: "16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                        <Calendar size={18} /> Book Appointment
                    </button>
                </Link>

                <Link to="/staff/tokens" style={{ textDecoration: 'none' }}>
                    <button style={{ width: "100%", padding: "16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                        <FileText size={18} /> Generate Token
                    </button>
                </Link>
            </div>
        </div>
    );
}
