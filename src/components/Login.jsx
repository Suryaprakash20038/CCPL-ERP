import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username, password); // username is email here

        if (result.success) {
            // Navigation happens based on user role which will be checked in App.jsx or redirected here
            // Let's get the user from context? Or handle strictly.
            // Since context updates async, we might need to rely on the returned data or wait.
            // But for now, let's redirect.
            const storedUser = JSON.parse(localStorage.getItem('userInfo'));
            if (storedUser.role === 'SITE_ENGINEER') {
                navigate('/engineer/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    const handleDemoLogin = (role) => {
        if (role === 'superadmin') {
            setUsername('admin@ccpl.com');
            setPassword('admin');
        } else if (role === 'admin') {
            setUsername('admin.manager@ccpl.com'); // Example credential
            setPassword('password123');
            setError('Note: Ensure this Admin user has been created by the Super Admin first.');
        } else if (role === 'engineer') {
            setUsername('site.engineer@ccpl.com'); // Example credential
            setPassword('password123');
            setError('Note: Ensure this Site Engineer user has been created by an Admin first.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="logo-section">
                        <h1><i className="fas fa-hard-hat"></i> CCPL Construction ERP</h1>
                        <p>Enterprise Resource Planning for Construction</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
                        <div className="form-group">
                            <label htmlFor="username">Email ID</label>
                            <input type="email" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pr-10" // Add padding for icon
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full">
                            <i className="fas fa-sign-in-alt"></i> Login
                        </button>

                        <div className="demo-accounts">
                            <h4><i className="fas fa-id-badge text-gray-400"></i> Access</h4>
                            <div className="demo-options flex flex-col gap-2">
                                <button type="button" className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200" onClick={() => handleDemoLogin('superadmin')}>
                                    <i className="fas fa-crown"></i> Fill Super Admin Credentials
                                </button>
                                <button type="button" className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" onClick={() => handleDemoLogin('admin')}>
                                    <i className="fas fa-user-tie"></i> Fill Admin Credentials
                                </button>
                                <button type="button" className="btn btn-outline flex items-center justify-center gap-2 w-full hover:bg-green-50 hover:text-green-700 hover:border-green-200" onClick={() => handleDemoLogin('engineer')}>
                                    <i className="fas fa-hard-hat"></i> Fill Site Engineer Credentials
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
