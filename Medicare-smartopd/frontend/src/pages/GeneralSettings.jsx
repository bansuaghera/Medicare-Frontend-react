import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import StaffLayout from "../layouts/StaffLayout";
import UserLayout from "../layouts/UserLayout";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/ThemeContext";
import ProfilePictureUpload from "../components/common/ProfilePictureUpload";
import API from "../api/axiosConfig";
import toast from "react-hot-toast";
import { 
    Palette, 
    Shield, 
    Bell, 
    Check, 
    RefreshCcw, 
    Moon, 
    Sun, 
    Monitor,
    Droplet,
    Lock,
    PencilLine,
    Eye,
    EyeOff
} from "lucide-react";

// General Settings Component - Handled by Antigravity
export default function GeneralSettings() {
    const { user, updateUser, loading } = useAuth();
    const { 
        themeMode, 
        setThemeMode, 
        primaryColor, 
        setPrimaryColor, 
        fontFamily, 
        setFontFamily 
    } = useTheme();
    
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
    const [security, setSecurity] = useState({
        twoFactorEnabled: user?.settings?.twoFactorEnabled || false,
        loginAlerts: user?.settings?.loginAlerts || true
    });

    const Layout = user?.role === 'admin' ? AdminLayout : 
                 user?.role === 'doctor' ? DoctorLayout : 
                 user?.role === 'staff' ? StaffLayout : UserLayout;

    // Handle early loading
    if (loading || !user) {
        return <Layout panelTitle="Settings"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><RefreshCcw className="animate-spin" /></div></Layout>;
    }

    const colors = [
        { name: 'Medicare Green', code: '#0fb48c' },
        { name: 'Navy Blue', code: '#1e3a8a' },
        { name: 'Royal Indigo', code: '#4f46e5' },
        { name: 'Deep Purple', code: '#7c3aed' },
        { name: 'Modern Rose', code: '#e11d48' },
        { name: 'Vibrant Orange', code: '#ea580c' },
        { name: 'Ocean Teal', code: '#0d9488' },
        { name: 'Forest Green', code: '#166534' },
        { name: 'Slate Gray', code: '#475569' },
        { name: 'Golden Amber', code: '#d97706' },
        { name: 'Safe Sky', code: '#0284c7' },
        { name: 'Crimson', code: '#991b1b' }
    ];

    const themes = [
        { id: 'original', name: 'Original', icon: Sun },
        { id: 'dark', name: 'Premium Dark', icon: Moon },
        { id: 'charcoal', name: 'Charcoal Night', icon: Shield },
        { id: 'ocean', name: 'Deep Ocean', icon: Droplet },
        { id: 'system', name: 'System Default', icon: Monitor }
    ];

    const fonts = [
        { id: "'Inter', sans-serif", name: 'Inter', desc: 'Modern & Clean' },
        { id: "'Outfit', sans-serif", name: 'Outfit', desc: 'Geometric & Friendly' },
        { id: "'Poppins', sans-serif", name: 'Poppins', desc: 'Stylish & Soft' },
        { id: "'Roboto', sans-serif", name: 'Roboto', desc: 'Professional & Direct' }
    ];

    // Load existing server settings on mount
    useEffect(() => {
        if (user.settings) {
            if (user.settings.theme) setThemeMode(user.settings.theme);
            if (user.settings.primaryColor) setPrimaryColor(user.settings.primaryColor);
            if (user.settings.fontFamily) setFontFamily(user.settings.fontFamily);
            setSecurity({
                twoFactorEnabled: user.settings.twoFactorEnabled || false,
                loginAlerts: user.settings.loginAlerts || true
            });
        }
    }, [user.id]);

    // Persist visual changes to DB automatically
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveVisualSettings();
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [themeMode, primaryColor, fontFamily]);

    const saveVisualSettings = async () => {
        try {
            await API.put(`/users/${user.id}/settings`, {
                theme: themeMode,
                primaryColor: primaryColor,
                fontFamily: fontFamily
            });
        } catch (error) {
            console.error("Failed to sync settings with server", error);
        }
    };

    const handleSecurityToggle = async (key, value) => {
        const newSecurity = { ...security, [key]: value };
        setSecurity(newSecurity);
        try {
            await API.put(`/users/${user.id}/settings`, {
                [key]: value
            });
            toast.success("Security preference updated");
        } catch (error) {
            toast.error("Failed to update security");
        }
    };

    const handlePhotoSave = async (base64) => {
        setProfilePhoto(base64);
        try {
            await updateUser({ profilePhoto: base64 });
            toast.success("Profile photo updated");
        } catch (error) {
            toast.error("Failed to save photo");
        }
    };

    return (
        <Layout panelTitle="Settings">
            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Settings & Identity</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Manage your profile, visual preferences, and account security</p>
                </div>

                {/* 1. PROFILE SECTION - FRONT & CENTER */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', padding: '40px', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '120px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-color-light))', opacity: 0.15, zIndex: 0 }}></div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ProfilePictureUpload initialImage={profilePhoto} onSave={handlePhotoSave} userName={user.name} />
                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '20px', marginBottom: '4px' }}>{user.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '2px' }}>{user.role} Account</p>
                        
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button 
                                onClick={() => document.querySelector('input[type="file"]').click()}
                                style={{ padding: '12px 32px', borderRadius: '16px', border: 'none', background: 'var(--primary-color)', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 16px var(--primary-color-light)', transition: 'transform 0.2s' }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Change Avatar
                            </button>
                            {profilePhoto && (
                                <button 
                                    onClick={() => handlePhotoSave(null)}
                                    style={{ padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '32px' }}>
                    
                    {/* 2. THEME MODE */}
                    <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--primary-color-light)', color: 'var(--primary-color)' }}>
                                <Monitor size={22} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Interface Style</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                            {themes.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setThemeMode(t.id)}
                                    style={{
                                        padding: '24px 12px',
                                        borderRadius: '20px',
                                        border: themeMode === t.id ? `3px solid var(--primary-color)` : '1px solid var(--border-color)',
                                        background: themeMode === t.id ? 'var(--primary-color-light)' : 'var(--bg-primary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    <t.icon size={24} color={themeMode === t.id ? 'var(--primary-color)' : 'var(--text-secondary)'} />
                                    <span style={{ fontSize: '13px', fontWeight: 800, color: themeMode === t.id ? 'var(--primary-color)' : 'var(--text-secondary)' }}>{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. TYPOGRAPHY */}
                    <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--primary-color-light)', color: 'var(--primary-color)' }}>
                                <Palette size={22} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Typography</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {fonts.map(f => (
                                <button 
                                    key={f.id}
                                    onClick={() => setFontFamily(f.id)}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '20px',
                                        border: fontFamily === f.id ? `3px solid var(--primary-color)` : '1px solid var(--border-color)',
                                        background: fontFamily === f.id ? 'var(--primary-color-light)' : 'var(--bg-primary)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: fontFamily === f.id ? 'var(--primary-color)' : 'var(--text-primary)', fontFamily: f.id, marginBottom: '4px' }}>{f.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{f.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. BRAND COLORS & LAB */}
                <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', marginBottom: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--primary-color-light)', color: 'var(--primary-color)' }}>
                            <RefreshCcw size={22} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Brand Visual Identity</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px', alignItems: 'center' }}>
                        <div>
                            <label style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', display: 'block' }}>Premium Preset Palettes</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                                {colors.map(c => (
                                    <button 
                                        key={c.code}
                                        title={c.name}
                                        onClick={() => setPrimaryColor(c.code)}
                                        style={{
                                            aspectRatio: '1/1',
                                            borderRadius: '16px',
                                            background: c.code,
                                            border: primaryColor === c.code ? '5px solid var(--bg-secondary)' : 'none',
                                            outline: primaryColor === c.code ? `3px solid ${c.code}` : 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: primaryColor === c.code ? '0 12px 24px -8px rgba(0,0,0,0.2)' : 'none'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.15) rotate(5deg)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '24px', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
                             <label style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '16px', display: 'block' }}>Custom Color Lab</label>
                             <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto 16px' }}>
                                <input 
                                    type="color" 
                                    value={primaryColor} 
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                                />
                                <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '5px solid var(--bg-secondary)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                                    <PencilLine size={28} />
                                </div>
                             </div>
                             <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '4px' }}>{primaryColor.toUpperCase()}</div>
                             <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>TAP TO SELECT HEX</div>
                        </div>
                    </div>
                </div>

                {/* 5. PRIVACY & SECURITY */}
                <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                        <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--pill-orange-bg)', color: 'var(--pill-orange-text)' }}>
                            <Shield size={22} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Privacy & Security</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '20px' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>2FA Security</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Two-step verification</div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '54px', height: '28px', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    checked={security.twoFactorEnabled}
                                    onChange={(e) => handleSecurityToggle('twoFactorEnabled', e.target.checked)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: security.twoFactorEnabled ? 'var(--primary-color)' : '#cbd5e1', borderRadius: '34px', transition: '.4s' }}>
                                    <span style={{ position: 'absolute', height: '20px', width: '20px', left: security.twoFactorEnabled ? '30px' : '4px', bottom: '4px', background: '#fff', borderRadius: '50%', transition: '.4s' }}></span>
                                </span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '20px' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Login Alerts</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Notify on login</div>
                            </div>
                             <label style={{ position: 'relative', display: 'inline-block', width: '54px', height: '28px', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    checked={security.loginAlerts}
                                    onChange={(e) => handleSecurityToggle('loginAlerts', e.target.checked)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: security.loginAlerts ? 'var(--primary-color)' : '#cbd5e1', borderRadius: '34px', transition: '.4s' }}>
                                    <span style={{ position: 'absolute', height: '20px', width: '20px', left: security.loginAlerts ? '30px' : '4px', bottom: '4px', background: '#fff', borderRadius: '50%', transition: '.4s' }}></span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
