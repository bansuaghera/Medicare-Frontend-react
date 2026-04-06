import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser || savedUser === "undefined") return null;
        try {
            return JSON.parse(savedUser);
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            return null;
        }
    });

    const [loading, setLoading] = useState(!localStorage.getItem("user"));

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete API.defaults.headers.common["Authorization"];
    };

    const updateUser = async (updatedFields) => {
        try {
            const response = await API.put(`/users/${user.id}`, updatedFields);
            if (response.data.success) {
                const newUser = { ...user, ...response.data.data };
                setUser(newUser);
                localStorage.setItem("user", JSON.stringify(newUser));
                return true;
            }
        } catch (error) {
            console.error("Update user failed", error);
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    const response = await API.get("/users/me");
                    if (response.data.success) {
                        setUser(response.data.data);
                        localStorage.setItem("user", JSON.stringify(response.data.data));
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            login, 
            logout, 
            updateUser,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
