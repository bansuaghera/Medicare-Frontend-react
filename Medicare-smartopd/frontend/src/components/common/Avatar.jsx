import React from 'react';

export default function Avatar({ user, size = 40, fontSize = '14px', style = {} }) {
    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(/\s+/);
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const initials = getInitials(user?.name);

    return (
        <div style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'var(--primary-color-light)',
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: fontSize,
            fontWeight: 700,
            flexShrink: 0,
            ...style
        }}>
            {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                initials || '??'
            )}
        </div>
    );
}
