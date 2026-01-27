import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on load
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const registerAdmin = async (adminData, token) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(adminData),
            });
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const registerSiteEngineer = async (engineerData, token) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/site-engineer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(engineerData),
            });
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        registerAdmin,
        registerSiteEngineer
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
