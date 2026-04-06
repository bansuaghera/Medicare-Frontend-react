import React from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Clock } from "lucide-react";

export default function UserQuickActions() {
    return (
        <div style={{ background: 'var(--bg-secondary, #fff)', borderRadius: '20px', border: '1px solid var(--border-color, #e5e7eb)', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary, #111827)', marginBottom: '20px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/user/book-appointment" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0fb48c', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', transition: 'transform 0.2s' }}>
                    <Plus size={20} />
                    Book Appointment
                </Link>
                <Link to="/user/doctors" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--bg-primary, #fff)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600' }}>
                    <Search size={20} />
                    Find Doctor
                </Link>
                <Link to="/user/token-status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--bg-primary, #fff)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600' }}>
                    <Clock size={20} />
                    Check Token
                </Link>
            </div>
        </div>
    );
}
