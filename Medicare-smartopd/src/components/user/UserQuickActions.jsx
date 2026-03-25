import React from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Clock } from "lucide-react";

export default function UserQuickActions() {
    return (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Link to="/user/book-appointment" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#10b981', color: '#fff', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    <Plus size={20} />
                    Book Appointment
                </Link>
                <Link to="/user/doctors" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    <Search size={20} />
                    Find Doctor
                </Link>
                <Link to="/user/token-status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    <Clock size={20} />
                    Token Status
                </Link>
            </div>
        </div>
    );
}
