import UserLayout from "../../layouts/UserLayout";
import { User, Stethoscope, Clock, Download, Eye } from "lucide-react";

export default function TokenStatus() {
    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Token Status</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Check your live queue status</p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px', maxWidth: '440px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>Your Token Number</p>
                    
                    <div style={{ background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', padding: '24px', textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#059669', margin: 0 }}>A-045</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <User size={18} />
                                <span style={{ fontSize: '14px' }}>Patient</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Rahul Verma</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Stethoscope size={18} />
                                <span style={{ fontSize: '14px' }}>Doctor</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Dr. Ramesh Sharma</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Clock size={18} />
                                <span style={{ fontSize: '14px' }}>Est. Wait Time</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--pill-success-text)' }}>~15 minutes</span>
                        </div>
                    </div>

                    <div style={{ background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', padding: '20px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#059669', margin: '0 0 8px 0' }}>Status: Waiting</h3>
                        <p style={{ fontSize: '14px', color: '#059669', margin: 0 }}>4 patients ahead of you</p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
