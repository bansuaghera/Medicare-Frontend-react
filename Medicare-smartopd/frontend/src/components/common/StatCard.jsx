import React from "react";

export default function StatCard({ title, value, icon: Icon, iconBg, iconColor }) {
    return (
        <div className="stat-card" style={{ background: "var(--bg-secondary)", padding: "24px", borderRadius: "20px", border: '1px solid var(--border-color)', boxShadow: "var(--shadow-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{title}</p>
                <h3 style={{ fontSize: "28px", fontWeight: "800", color: 'var(--text-primary)' }}>{value}</h3>
            </div>
            <div style={{ background: iconBg, padding: "14px", borderRadius: "14px", color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon && <Icon size={26} />}
            </div>
        </div>
    );
}
