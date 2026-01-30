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
        // Mock login
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    _id: 'mock_user_id',
                    name: 'Demo Admin',
                    email: email,
                    role: 'admin',
                    token: 'mock_jwt_token'
                };
                localStorage.setItem('userInfo', JSON.stringify(mockUser));
                setUser(mockUser);
                resolve({ success: true });
            }, 500);
        });
    };

    const loginAsRole = async (role) => {
        return new Promise((resolve) => {
            let mockUser = {};
            // Use consistent role strings as expected by App.jsx or other components
            // App.jsx checks: user.role === 'SUPER_ADMIN', 'ADMIN', 'SITE_ENGINEER' (based on UserManagement previously seen)
            // Let's verify what the rest of the app expects.
            // UserManagement.jsx uses 'SUPER_ADMIN', 'ADMIN', 'SITE_ENGINEER'.
            // Dashboard checks might be vague, but let's stick to these.

            if (role === 'SUPER_ADMIN') {
                mockUser = { _id: 'sa1', name: 'Super Admin', email: 'superadmin@ccpl.com', role: 'SUPER_ADMIN', token: 'mock_sa_token' };
            } else if (role === 'ADMIN') {
                mockUser = { _id: 'a1', name: 'Admin Manager', email: 'admin@ccpl.com', role: 'ADMIN', token: 'mock_admin_token' };
            } else if (role === 'SITE_ENGINEER') {
                mockUser = { _id: 'se1', name: 'Site Engineer', email: 'engineer@ccpl.com', role: 'SITE_ENGINEER', token: 'mock_se_token' };
            }

            localStorage.setItem('userInfo', JSON.stringify(mockUser));
            setUser(mockUser);
            resolve({ success: true, role: mockUser.role });
        });
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const registerAdmin = async (adminData, token) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: { ...adminData, _id: 'new_admin_id' } });
            }, 500);
        });
    };

    const registerSiteEngineer = async (engineerData, token) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: { ...engineerData, _id: 'new_engineer_id' } });
            }, 500);
        });
    };

    const value = {
        user,
        loading,
        login,
        loginAsRole,
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
