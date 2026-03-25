import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { User, Mail, ChevronDown, Calendar, Save } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();

    const handleSave = (e) => {
        e.preventDefault();
        alert("Profile updated successfully!");
        navigate("/user/dashboard");
    };

    return (
        <UserLayout panelTitle="User Panel">
            <div className="dashboard-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Profile Settings</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Manage your personal information</p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--pill-success-text)', color: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={40} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>Rahul Verma</h2>
                            <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>Patient ID: 12345</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>First Name</label>
                                <input type="text" defaultValue="Rahul" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Last Name</label>
                                <input type="text" defaultValue="Verma" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input type="email" defaultValue="rahul.v@example.com" style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Phone</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '14px' }}>+91</span>
                                    <input type="tel" defaultValue="98765-43210" style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Date of Birth</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input type="text" defaultValue="15/01/1979" style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Gender</label>
                                <div style={{ position: 'relative' }}>
                                    <select defaultValue="Male" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)', appearance: 'none' }}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Blood Group</label>
                                <div style={{ position: 'relative' }}>
                                    <select defaultValue="O+" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-input)', fontSize: '15px', color: 'var(--text-primary)', appearance: 'none' }}>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                    <ChevronDown size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                            <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--pill-success-text)', color: 'var(--bg-secondary)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                                <Save size={18} />
                                Save Changes
                            </button>
                            <button type="button" onClick={() => navigate('/user/dashboard')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-quaternary)', color: 'var(--text-tertiary)', padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
