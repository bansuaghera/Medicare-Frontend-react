import React from 'react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: '#fee2e2',
            icon: '#ef4444',
            btn: '#ef4444',
            light: '#fef2f2'
        },
        warning: {
            bg: '#fef3c7',
            icon: '#f59e0b',
            btn: '#f59e0b',
            light: '#fffbeb'
        },
        success: {
            bg: '#d1fae5',
            icon: '#0fb48c',
            btn: '#0fb48c',
            light: '#f0fdf4'
        }
    };

    const activeColor = colors[type] || colors.danger;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                width: '100%',
                maxWidth: '450px',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'modalSlideIn 0.3s ease-out'
            }}>
                {/* Header/Icon */}
                <div style={{ 
                    padding: '32px 32px 16px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        backgroundColor: activeColor.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        {type === 'danger' ? <ShieldAlert size={32} color={activeColor.icon} /> : <AlertCircle size={32} color={activeColor.icon} />}
                    </div>
                    
                    <h3 style={{ 
                        fontSize: '22px', 
                        fontWeight: '800', 
                        margin: '0 0 12px 0',
                        color: 'var(--text-primary)' 
                    }}>
                        {title}
                    </h3>
                    
                    <p style={{ 
                        fontSize: '15px', 
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        margin: 0 
                    }}>
                        {message}
                    </p>
                </div>

                {/* Footer Actions */}
                <div style={{ 
                    padding: '24px 32px 32px',
                    display: 'flex',
                    gap: '12px'
                }}>
                    <button 
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-secondary)',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={18} />
                        Cancel
                    </button>
                    
                    <button 
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: activeColor.btn,
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: `0 8px 16px -4px ${activeColor.btn}44`,
                            transition: 'all 0.2s'
                        }}
                    >
                        Confirm Action
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes modalSlideIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}} />
        </div>
    );
}
