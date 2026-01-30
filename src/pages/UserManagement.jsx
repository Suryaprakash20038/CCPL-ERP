import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { user, registerAdmin, registerSiteEngineer } = useAuth();
    if (!user) return <div>Access Denied</div>;

    const [activeTab, setActiveTab] = useState(user.role === 'SUPER_ADMIN' ? 'admins' : 'engineers');
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user.role === 'SUPER_ADMIN' && activeTab === 'admins') {
            fetchAdmins();
        } else if (user.role === 'ADMIN' && activeTab === 'engineers') {
            fetchEngineers();
        }
    }, [user, activeTab]);

    const fetchAdmins = async () => {
        setLoading(true);
        // Mock fetch
        const stored = JSON.parse(localStorage.getItem('mock_admins') || '[]');
        if (stored.length === 0) {
            const initial = [{ _id: 'a1', name: 'Default Admin', email: 'admin@ccpl.com', role: 'ADMIN', status: 'Active' }];
            localStorage.setItem('mock_admins', JSON.stringify(initial));
            setUsers(initial);
        } else {
            setUsers(stored);
        }
        setLoading(false);
    };

    const fetchEngineers = async () => {
        setLoading(true);
        // Mock fetch
        const stored = JSON.parse(localStorage.getItem('mock_engineers') || '[]');
        if (stored.length === 0) {
            const initial = [{ _id: 'e1', name: 'Site Eng 1', email: 'eng1@ccpl.com', role: 'SITE_ENGINEER', status: 'Active' }];
            localStorage.setItem('mock_engineers', JSON.stringify(initial));
            setUsers(initial);
        } else {
            setUsers(stored);
        }
        setLoading(false);
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const res = await registerAdmin(data, user.token);
        if (res.success) {
            // Mock: Add to LS
            const newAdmin = { ...data, _id: 'a' + Date.now(), role: 'ADMIN', status: 'Active' };
            const admins = JSON.parse(localStorage.getItem('mock_admins') || '[]');
            localStorage.setItem('mock_admins', JSON.stringify([...admins, newAdmin]));

            setMessage('Admin created successfully!');
            setShowForm(false);
            fetchAdmins();
        } else {
            setMessage('Error: ' + res.message);
        }
    };

    const handleEngineerSubmit = async (e) => {
        e.preventDefault();
        // Construct complex object
        const form = e.target;
        const formData = new FormData(form);
        const raw = Object.fromEntries(formData.entries());

        // Nested objects
        const fullData = {
            ...raw,
            address: {
                current: raw.currentAddress,
                permanent: raw.permanentAddress
            },
            permissions: {
                attendanceSubmit: form.attendanceSubmit.checked,
                dailyProgressUpdate: form.dailyProgressUpdate.checked,
                materialRequest: form.materialRequest.checked,
                issueReporting: form.issueReporting.checked
            },
            attendanceConfig: {
                type: raw.attendanceType,
                allowedSites: raw.allowedSites.split(',').map(s => s.trim()), // Basic implementation
                workingDays: raw.workingDays.split(',').map(d => d.trim()),
                overtimeApplicable: raw.overtimeApplicable === 'Yes'
            },
            documents: {
                idProof: raw.idProof, // Assuming URL input for now, real file upload requires handling
                qualificationCertificate: raw.qualificationCertificate,
                experienceCertificate: raw.experienceCertificate,
                joiningLetter: raw.joiningLetter
            },
            bankDetails: {
                bankName: raw.bankName,
                accountNumber: raw.accountNumber,
                ifscCode: raw.ifscCode,
                upiId: raw.upiId
            }
        };

        const res = await registerSiteEngineer(fullData, user.token);
        if (res.success) {
            // Mock: Add to LS
            const newEng = { ...fullData, _id: 'e' + Date.now(), name: fullData.name, email: fullData.email, role: 'SITE_ENGINEER', status: 'Active' };
            const engs = JSON.parse(localStorage.getItem('mock_engineers') || '[]');
            localStorage.setItem('mock_engineers', JSON.stringify([...engs, newEng]));

            setMessage('Site Engineer created successfully!');
            setShowForm(false);
            fetchEngineers();
        } else {
            setMessage('Error: ' + res.message);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            {message && <div className="p-3 mb-4 bg-blue-100 text-blue-700 rounded">{message}</div>}

            <div className="flex gap-4 mb-6">
                {user.role === 'SUPER_ADMIN' && (
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'admins' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => { setActiveTab('admins'); setShowForm(false); }}
                    >
                        Admins
                    </button>
                )}
                {user.role === 'ADMIN' && (
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'engineers' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => { setActiveTab('engineers'); setShowForm(false); }}
                    >
                        Site Engineers
                    </button>
                )}
            </div>

            {!showForm ? (
                <div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mb-4 bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i> Add New {activeTab === 'admins' ? 'Admin' : 'Engineer'}
                    </button>

                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-t">
                                        <td className="p-4">{u.name}</td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">{u.role}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan="4" className="p-4 text-center">No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-semibold">Create New {activeTab === 'admins' ? 'Admin' : 'Site Engineer'}</h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>

                    {activeTab === 'admins' ? (
                        <form onSubmit={handleAdminSubmit} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium mb-1">Admin Name</label>
                                <input name="name" type="text" required className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email ID</label>
                                <input name="email" type="email" required className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full p-2 border rounded pr-10"
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
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Admin</button>
                        </form>
                    ) : (
                        <form onSubmit={handleEngineerSubmit} className="space-y-6">
                            {/* Basic Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <h3 className="col-span-2 font-semibold text-gray-700 border-b pb-2">Basic Details</h3>
                                <div><label className="block text-sm mb-1">Full Name</label><input name="name" required className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Employee ID</label><input name="empId" required className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Gender</label>
                                    <select name="gender" className="w-full p-2 border rounded">
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm mb-1">Date of Birth</label><input name="dob" type="date" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Mobile</label><input name="mobile" required className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Email ID</label><input name="email" type="email" required className="w-full p-2 border rounded" /></div>
                                <div className="col-span-2"><label className="block text-sm mb-1">Current Address</label><textarea name="currentAddress" className="w-full p-2 border rounded" rows="2" /></div>
                                <div className="col-span-2"><label className="block text-sm mb-1">Permanent Address</label><textarea name="permanentAddress" className="w-full p-2 border rounded" rows="2" /></div>
                            </div>

                            {/* Job Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <h3 className="col-span-2 font-semibold text-gray-700 border-b pb-2">Job Details</h3>
                                <div><label className="block text-sm mb-1">Designation</label><input name="designation" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Department</label><input name="department" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Site Location</label><input name="siteLocation" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Joining Date</label><input name="joiningDate" type="date" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Shift Timing</label><input name="shiftTiming" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Work Type</label>
                                    <select name="workType" className="w-full p-2 border rounded">
                                        <option>Full-time</option><option>Contract</option>
                                    </select>
                                </div>
                            </div>

                            {/* Login */}
                            <div className="grid grid-cols-2 gap-4">
                                <h3 className="col-span-2 font-semibold text-gray-700 border-b pb-2">Login Credentials</h3>
                                <div>
                                    <label className="block text-sm mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full p-2 border rounded pr-10"
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
                            </div>

                            {/* Permissions */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-700 border-b pb-2">Access Permissions</h3>
                                <div className="flex gap-4">
                                    <label><input type="checkbox" name="attendanceSubmit" /> Attendance Submit</label>
                                    <label><input type="checkbox" name="dailyProgressUpdate" /> Daily Progress</label>
                                    <label><input type="checkbox" name="materialRequest" /> Material Request</label>
                                    <label><input type="checkbox" name="issueReporting" /> Issue Reporting</label>
                                </div>
                            </div>

                            {/* Attendance Config */}
                            <div className="grid grid-cols-2 gap-4">
                                <h3 className="col-span-2 font-semibold text-gray-700 border-b pb-2">Attendance Configuration</h3>
                                <div><label className="block text-sm mb-1">Attendance Type</label>
                                    <select name="attendanceType" className="w-full p-2 border rounded">
                                        <option>Manual</option><option>GPS</option><option>Biometric</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm mb-1">Allowed Sites (comma sep)</label><input name="allowedSites" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Working Days (comma sep)</label><input name="workingDays" defaultValue="Mon, Tue, Wed, Thu, Fri, Sat" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Overtime Applicable</label>
                                    <select name="overtimeApplicable" className="w-full p-2 border rounded">
                                        <option>No</option><option>Yes</option>
                                    </select>
                                </div>
                            </div>

                            {/* Documents (For demo, just text inputs for URLs) */}
                            <div className="grid grid-cols-2 gap-4">
                                <h3 className="col-span-2 font-semibold text-gray-700 border-b pb-2">Documents (URL)</h3>
                                <div><label className="block text-sm mb-1">ID Proof</label><input name="idProof" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Qualification Cert</label><input name="qualificationCertificate" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Experience Cert</label><input name="experienceCertificate" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Joining Letter</label><input name="joiningLetter" className="w-full p-2 border rounded" /></div>
                            </div>

                            {/* Bank Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <h3 className="col-span-2 font-semibold text-gray-700 border-b pb-2">Bank Details</h3>
                                <div><label className="block text-sm mb-1">Bank Name</label><input name="bankName" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">Account Number</label><input name="accountNumber" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">IFSC Code</label><input name="ifscCode" className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-sm mb-1">UPI ID</label><input name="upiId" className="w-full p-2 border rounded" /></div>
                            </div>

                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded text-lg w-full">Create Site Engineer</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
