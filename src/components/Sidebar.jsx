import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('superadmin');

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setRole(JSON.parse(storedUser).role);
        }
    }, []);

    // Define All Menu Items with 'roles' array indicating who can see them
    // If no 'roles' property, everyone sees it.
    const allMenuItems = [
        { header: 'CORE MODULES' },
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Projects', path: '/projects', icon: 'fas fa-project-diagram' },
        { name: 'Task Management', path: '/tasks', icon: 'fas fa-tasks' },
        { name: 'Site Monitoring', path: '/monitoring', icon: 'fas fa-eye' },

        { header: 'RESOURCES' },
        { name: 'Labour Management', path: '/labour', icon: 'fas fa-users' },
        { name: 'Asset Management', path: '/assets', icon: 'fas fa-tools', roles: ['superadmin', 'admin'] },
        { name: 'Inventory', path: '/inventory', icon: 'fas fa-boxes' },

        { header: 'OPERATIONS', roles: ['superadmin', 'admin'] },
        { name: 'Procurement', path: '/procurement', icon: 'fas fa-shopping-cart', roles: ['superadmin', 'admin'] },
        { name: 'Vendors', path: '/vendors', icon: 'fas fa-handshake', roles: ['superadmin', 'admin'] },
        { name: 'Billing', path: '/billing', icon: 'fas fa-file-invoice-dollar', roles: ['superadmin'] },
        { name: 'Expenses', path: '/expenses', icon: 'fas fa-receipt', roles: ['superadmin'] },

        { header: 'SUPPORT' },
        { name: 'Issue Tickets', path: '/tickets', icon: 'fas fa-ticket-alt' },
        { name: 'Reports', path: '/reports', icon: 'fas fa-chart-bar', roles: ['superadmin', 'admin'] },
        { name: 'Documents', path: '/documents', icon: 'fas fa-folder' },

        { header: 'ADMINISTRATION', roles: ['superadmin'] },
        { name: 'User Management', path: '/users', icon: 'fas fa-users-cog', roles: ['superadmin'] },
        { name: 'Notifications', path: '/notifications', icon: 'fas fa-bell', roles: ['superadmin'] },
        { name: 'Settings', path: '/settings', icon: 'fas fa-cog', roles: ['superadmin'] },
    ];

    // Filter Items
    const visibleItems = allMenuItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(role);
    });

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <i className="fas fa-hard-hat text-2xl"></i>
                    <span className="font-bold text-xl tracking-tight">CCPL ERP</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {visibleItems.map((item, index) => {
                    if (item.header) {
                        return (
                            <div key={index} className="nav-section-title mt-4 mb-2">
                                {item.header}
                            </div>
                        );
                    }

                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`nav-link w-full text-left ${isActive ? 'active' : ''}`}
                        >
                            <i className={`${item.icon} w-6 text-center`}></i>
                            <span className="truncate">{item.name}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
