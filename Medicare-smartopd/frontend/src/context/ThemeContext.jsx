import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(() => localStorage.getItem("themeMode") || "original");
    const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem("primaryColor") || "#0fb48c");

    const [fontFamily, setFontFamily] = useState(() => localStorage.getItem("fontFamily") || "'Inter', sans-serif");
    const [lastSyncedUserId, setLastSyncedUserId] = useState(null);

    // Sync theme with the logged-in user's database settings
    const syncWithUser = (user) => {
        if (!user || user.id === lastSyncedUserId) return;
        
        const settings = user.settings || {};
        if (settings.theme) setThemeMode(settings.theme);
        if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
        if (settings.fontFamily) setFontFamily(settings.fontFamily);
        
        setLastSyncedUserId(user.id);
    };

    useEffect(() => {
        applyTheme(themeMode, primaryColor, fontFamily);
    }, [themeMode, primaryColor, fontFamily]);

    const applyTheme = (mode, color, font) => {
        const root = document.documentElement;
        
        // 1. Resolve Mode for Attribute
        let effectiveMode = mode;
        if (mode === 'system') {
            effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else if (mode === 'original') {
            effectiveMode = 'light';
        }

        root.setAttribute("data-theme", effectiveMode);
        localStorage.setItem("themeMode", mode);

        // 2. Apply Custom Primary Color
        root.style.setProperty('--primary-color', color);
        root.style.setProperty('--primary-color-light', `${color}22`); 
        localStorage.setItem("primaryColor", color);

        // 3. Apply Font Family
        root.style.setProperty('--font-main', font);
        localStorage.setItem("fontFamily", font);
    };

    const toggleTheme = () => {
        const nextMode = themeMode === 'dark' ? 'original' : 'dark';
        setThemeMode(nextMode);
    };

    const isDarkModeComputed = ['dark', 'charcoal', 'ocean'].includes(themeMode) || 
                              (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <ThemeContext.Provider value={{ 
            themeMode, 
            setThemeMode, 
            primaryColor, 
            setPrimaryColor, 
            fontFamily,
            setFontFamily,
            toggleTheme, 
            syncWithUser,
            isDarkMode: isDarkModeComputed 
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
