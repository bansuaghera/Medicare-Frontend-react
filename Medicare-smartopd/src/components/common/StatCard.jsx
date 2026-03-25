import React from "react";

export default function StatCard({ title, value, icon: Icon, iconBg, iconColor }) {
    return (
        <div className="stat-card" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>{title}</p>
                <h3 style={{ fontSize: "28px", fontWeight: "700" }}>{value}</h3>
            </div>
            <div style={{ background: iconBg, padding: "12px", borderRadius: "10px", color: iconColor }}>
                {Icon && <Icon size={24} />}
            </div>
        </div>
    );
}
