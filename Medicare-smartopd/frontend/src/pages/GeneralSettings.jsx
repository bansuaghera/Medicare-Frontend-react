import React, { useState, useEffect, useRef } from "react";
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
    Check, 
    RefreshCcw, 
    Moon, 
    Sun, 
    Monitor,
    Droplet,
    PencilLine,
    Save,
    Type,
    RotateCcw
} from "lucide-react";

export default function GeneralSettings() {
    const { user, updateUser, loading } = useAuth();
    const { 
        themeMode: globalTheme, 
        setThemeMode, 
        primaryColor: globalColor, 
        setPrimaryColor, 
        fontFamily: globalFont, 
        setFontFamily 
    } = useTheme();
    
    // Store original settings to revert if not saved
    const originalSettings = useRef({
        theme: globalTheme,
        color: globalColor,
        font: globalFont
    });

    const [isSaved, setIsSaved] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
    const [security, setSecurity] = useState({
        twoFactorEnabled: user?.settings?.twoFactorEnabled || false,
        loginAlerts: user?.settings?.loginAlerts || true
    });
    const [isSaving, setIsSaving] = useState(false);

    const Layout = user?.role === 'admin' ? AdminLayout : 
                 user?.role === 'doctor' ? DoctorLayout : 
                 user?.role === 'staff' ? StaffLayout : UserLayout;

    // --- REVERT ON LEAVE (Cleanup) ---
    useEffect(() => {
        return () => {
            // If the user navigates away without clicking SAVE, revert the entire app to original settings
            if (!localStorage.getItem("settings_just_saved")) {
                 const original = originalSettings.current;
                 setThemeMode(original.theme);
                 setPrimaryColor(original.color);
                 setFontFamily(original.font);
            }
            localStorage.removeItem("settings_just_saved");
        };
    }, []);

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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser({
                settings: {
                    ...user.settings,
                    theme: globalTheme,
                    primaryColor: globalColor,
                    fontFamily: globalFont,
                    twoFactorEnabled: security.twoFactorEnabled,
                    loginAlerts: security.loginAlerts
                }
            });
            localStorage.setItem("settings_just_saved", "true");
            originalSettings.current = { theme: globalTheme, color: globalColor, font: globalFont };
            toast.success("Settings saved permanently!");
        } catch (error) {
            toast.error("Failed to sync with cloud.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetToDefault = () => {
        setThemeMode('original');
        setPrimaryColor('#0fb48c');
        setFontFamily("'Inter', sans-serif");
        toast.success("Settings reset to clinic defaults (Previewing)");
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

    const hasChanges = globalTheme !== originalSettings.current.theme || 
                      globalColor !== originalSettings.current.color || 
                      globalFont !== originalSettings.current.font;

    return (
        <Layout panelTitle="Settings">
            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '120px' }}>
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1.5px' }}>Identity & Style</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Customize your real-time visual environment</p>
                    </div>
                </div>

                {/* --- 1. PROFILE SECTION --- */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', padding: '40px', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-color-light))', opacity: 0.1, zIndex: 0, borderRadius: '32px 32px 0 0' }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <ProfilePictureUpload initialImage={profilePhoto} onSave={handlePhotoSave} userName={user.name} />
                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '20px', marginBottom: '2px' }}>{user.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>{user.role} Dashboard</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '32px' }}>
                    
                    {/* --- 2. LIVE THEME SELECTOR --- */}
                    <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                             <Monitor size={22} color="var(--primary-color)" />
                             <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Live Theme Mode</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                            {themes.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setThemeMode(t.id)}
                                    style={{
                                        padding: '24px 12px', borderRadius: '20px', border: globalTheme === t.id ? `3px solid var(--primary-color)` : '1px solid var(--border-color)',
                                        background: globalTheme === t.id ? 'var(--primary-color-light)' : 'var(--bg-primary)',
                                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
                                    }}
                                >
                                    <t.icon size={24} color={globalTheme === t.id ? 'var(--primary-color)' : 'var(--text-secondary)'} />
                                    <span style={{ fontSize: '13px', fontWeight: 800, color: globalTheme === t.id ? 'var(--primary-color)' : 'var(--text-secondary)' }}>{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- 3. LIVE FONT SELECTOR --- */}
                    <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                             <Type size={22} color="var(--primary-color)" />
                             <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Live Typography</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {fonts.map(f => (
                                <button 
                                    key={f.id}
                                    onClick={() => setFontFamily(f.id)}
                                    style={{
                                        padding: '20px', borderRadius: '20px', border: globalFont === f.id ? `3px solid var(--primary-color)` : '1px solid var(--border-color)',
                                        background: globalFont === f.id ? 'var(--primary-color-light)' : 'var(--bg-primary)',
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: globalFont === f.id ? 'var(--primary-color)' : 'var(--text-primary)', fontFamily: f.id, marginBottom: '4px' }}>{f.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{f.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 4. LIVE ACCENT SELECTOR --- */}
                <div style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', marginBottom: '32px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <Palette size={22} color="var(--primary-color)" />
                        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Live Accent Color</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px', alignItems: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                            {colors.map(c => (
                                <button 
                                    key={c.code}
                                    onClick={() => setPrimaryColor(c.code)}
                                    style={{
                                        aspectRatio: '1/1', borderRadius: '16px', background: c.code,
                                        border: globalColor === c.code ? '5px solid var(--bg-secondary)' : 'none',
                                        outline: globalColor === c.code ? `3px solid ${c.code}` : 'none',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '24px', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
                             <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto 16px' }}>
                                <input type="color" value={globalColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                                <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: globalColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '5px solid var(--bg-secondary)' }}>
                                    <PencilLine size={28} />
                                </div>
                             </div>
                             <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>{globalColor.toUpperCase()}</div>
                        </div>
                    </div>
                </div>

                {/* --- 5. STICKY SAVE/RESET FOOTER --- */}
                <div style={{
                    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                    width: '90%', maxWidth: '800px', background: 'var(--bg-secondary)', padding: '20px 40px',
                    borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 20px 30px -10px rgba(0,0,0,0.2)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button 
                            onClick={handleResetToDefault}
                            style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <RotateCcw size={16} /> Reset Default
                        </button>
                        {hasChanges && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s infinite' }}></span>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {hasChanges && (
                            <p style={{ margin: 0, fontSize: '12px', color: '#f59e0b', fontWeight: '800' }}>UNSAVED PREVIEW ACTIVE</p>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                            style={{
                                background: hasChanges ? 'var(--primary-color)' : '#94a3b8', color: '#fff', padding: '14px 40px',
                                borderRadius: '16px', border: 'none', fontSize: '16px', fontWeight: '900',
                                cursor: hasChanges ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                        >
                            {isSaving ? <RefreshCcw className="animate-spin" /> : <Save size={20} />}
                            {isSaving ? 'Saving...' : 'Save Permanently'}
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </Layout>
    );
}
