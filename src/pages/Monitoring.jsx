import { useState } from 'react';

const Monitoring = () => {
    const [userRole, setUserRole] = useState('admin'); // 'admin' or 'engineer'
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Mock Data for Feeds
    const [updates, setUpdates] = useState([
        {
            id: 1,
            user: 'Mike Wilson',
            role: 'Site Engineer',
            avatar: 'MW',
            time: '10:30 AM',
            type: 'progress',
            content: 'Foundation pouring for Block A completed smoothly. Concrete quality checks passed.',
            images: ['https://placehold.co/600x400/e2e8f0/64748b?text=Foundation+Pour'],
            site: 'Skyline Complex'
        },
        {
            id: 2,
            user: 'Sarah Johnson',
            role: 'Safety Officer',
            avatar: 'SJ',
            time: '09:15 AM',
            type: 'safety',
            content: 'Safety inspection completed. 2 minor violations found and corrected immediately regarding helmet usage.',
            site: 'Metro Tower'
        },
        {
            id: 3,
            user: 'David Lee',
            role: 'Site Engineer',
            avatar: 'DL',
            time: 'Yesterday',
            type: 'issue',
            content: 'Material delivery delayed by 4 hours due to traffic. Creating backlog in steel reinforcement work.',
            site: 'Green Valley'
        }
    ]);

    const handleAddUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUpdate = {
            id: Date.now(),
            user: 'Current User',
            role: userRole === 'admin' ? 'Project Manager' : 'Site Engineer',
            avatar: userRole === 'admin' ? 'PM' : 'SE',
            time: 'Just Now',
            type: formData.get('type'),
            content: formData.get('content'),
            site: formData.get('site') || 'Assigned Site'
        };
        setUpdates([newUpdate, ...updates]);
        setShowUpdateModal(false);
    };

    return (
        <>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1>Site Monitoring & Live Feed</h1>
                    <p>Real-time updates from construction sites</p>
                </div>

                {/* Role Toggle for Demo */}
                <div className="bg-gray-200 p-1 rounded-lg flex items-center text-sm font-medium">
                    <button
                        onClick={() => setUserRole('admin')}
                        className={`px-4 py-2 rounded-md transition-all ${userRole === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <i className="fas fa-user-tie mr-2"></i> Admin View
                    </button>
                    <button
                        onClick={() => setUserRole('engineer')}
                        className={`px-4 py-2 rounded-md transition-all ${userRole === 'engineer' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <i className="fas fa-hard-hat mr-2"></i> Engineer View
                    </button>
                </div>
            </div>

            {/* Top Stats - Context Aware */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon info">
                        <i className="fas fa-cloud-sun"></i>
                    </div>
                    <div className="stat-content">
                        <h3>28°C</h3>
                        <p>Clear Sky</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{userRole === 'admin' ? '1,240' : '145'}</h3>
                        <p>Active Workers</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <i className="fas fa-truck-monster"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{userRole === 'admin' ? '85%' : '92%'}</h3>
                        <p>Equipment Uptime</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon danger">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="stat-content">
                        <h3>3</h3>
                        <p>Open Incidents</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Live Feed */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Create Post Widget */}
                    <div className="card">
                        <div className="card-body">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${userRole === 'admin' ? 'bg-blue-600' : 'bg-green-600'}`}>
                                    {userRole === 'admin' ? 'PM' : 'SE'}
                                </div>
                                <div className="flex-1">
                                    <button
                                        onClick={() => setShowUpdateModal(true)}
                                        className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full px-6 py-3 transition-colors"
                                    >
                                        {userRole === 'admin' ? 'Broadcast an announcement...' : 'Post a site update or issue...'}
                                    </button>
                                    <div className="flex gap-4 mt-4">
                                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600" onClick={() => setShowUpdateModal(true)}>
                                            <i className="fas fa-camera text-blue-500"></i> Photo
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600" onClick={() => setShowUpdateModal(true)}>
                                            <i className="fas fa-video text-green-500"></i> Video
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600" onClick={() => setShowUpdateModal(true)}>
                                            <i className="fas fa-exclamation-circle text-red-500"></i> Report Issue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feed Filter (Admin Only) */}
                    {userRole === 'admin' && (
                        <div className="flex gap-2 pb-2 overflow-x-auto">
                            <button className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">All Activity</button>
                            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Safety Alerts</button>
                            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Progress Updates</button>
                            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Issues</button>
                        </div>
                    )}

                    {/* Feed Items */}
                    {updates.map(update => (
                        <div key={update.id} className="card animate-in fade-in slide-in-from-bottom-4">
                            <div className="card-body">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {update.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 leading-tight">{update.user}</h4>
                                            <div className="text-xs text-gray-500">{update.role} • {update.site} • {update.time}</div>
                                        </div>
                                    </div>
                                    <span className={`badge ${update.type === 'safety' ? 'badge-danger' :
                                            update.type === 'issue' ? 'badge-warning' : 'badge-success'
                                        }`}>
                                        {update.type.toUpperCase()}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{update.content}</p>

                                {update.images && (
                                    <div className="grid grid-cols-2 gap-2 mb-4 rounded-lg overflow-hidden">
                                        {update.images.map((img, idx) => (
                                            <img key={idx} src={img} alt="Update attachment" className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-6">

                    {/* Critical Alerts (Admin Priority) */}
                    <div className="card border-l-4 border-red-500">
                        <div className="card-header bg-red-50">
                            <h3 className="card-title text-red-700 flex items-center gap-2">
                                <i className="fas fa-shield-alt"></i> Safety Alerts
                            </h3>
                        </div>
                        <div className="card-body p-0">
                            <div className="p-4 border-b border-gray-100 last:border-0 hover:bg-red-50/50 transition-colors cursor-pointer">
                                <div className="text-sm font-bold text-gray-800 mb-1">Helmet Violation (Repeated)</div>
                                <div className="text-xs text-gray-600 mb-2">Block C • Reported by Sarah J.</div>
                                <span className="badge badge-danger text-[10px]">Action Required</span>
                            </div>
                            <div className="p-4 border-b border-gray-100 last:border-0 hover:bg-red-50/50 transition-colors cursor-pointer">
                                <div className="text-sm font-bold text-gray-800 mb-1">Scaffolding Stability Check</div>
                                <div className="text-xs text-gray-600 mb-2">Metro Tower • Due Today</div>
                                <span className="badge badge-warning text-[10px]">Pending</span>
                            </div>
                        </div>
                    </div>

                    {/* Labour Distribution - Kept this, removed Cams */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Workforce Today</h3>
                        </div>
                        <div className="card-body">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Skilled Labor</span>
                                        <span className="font-bold">45/50</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">General Helpers</span>
                                        <span className="font-bold">80/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="text-lg font-bold">Post Site Update</h3>
                            <button onClick={() => setShowUpdateModal(false)}><i className="fas fa-times text-gray-400 hover:text-gray-600"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAddUpdate} className="space-y-4">
                                {userRole === 'admin' && (
                                    <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 mb-4 border border-yellow-200">
                                        <i className="fas fa-info-circle mr-2"></i> You are posting as Admin (Broadcast Mode)
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Update Type</label>
                                    <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                                        <option value="progress">Progress Update</option>
                                        <option value="issue">Report Issue/Delay</option>
                                        <option value="safety">Safety Violation</option>
                                    </select>
                                </div>

                                {userRole === 'admin' && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Site</label>
                                        <select name="site" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                                            <option>All Sites (Broadcast)</option>
                                            <option>Skyline Residential</option>
                                            <option>Metro Commercial</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                    <textarea name="content" rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" placeholder="Describe what's happening..." required></textarea>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                    <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                                    <p className="text-sm text-gray-600 font-medium">Click to upload Photos/Videos</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowUpdateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md">Post Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Monitoring;
