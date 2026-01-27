import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Vendors = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Stats
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter(v => v.status === 'Active').length;
    const totalPurchaseValue = vendors.reduce((sum, v) => sum + (v.totalPurchaseValue || 0), 0);
    const avgRating = totalVendors > 0 ? (vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / totalVendors).toFixed(1) : 0;

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/vendors', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setVendors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateVendor = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Structure the data to match backend expectation
        const payload = {
            name: data.name,
            code: data.code,
            category: data.category,
            address: data.address,
            contact: {
                mobile: data.mobile,
                email: data.email
            },
            status: 'Active'
        };

        try {
            await fetch('http://localhost:5000/api/vendors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });
            setShowForm(false);
            fetchVendors();
        } catch (error) {
            alert('Failed to create vendor');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Total Vendors</div>
                    <div className="text-2xl font-bold text-gray-800 mt-1">{totalVendors}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Active Vendors</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">{activeVendors}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Avg Rating</div>
                    <div className="text-2xl font-bold text-yellow-500 mt-1 flex items-center gap-1">
                        {avgRating} <i className="fas fa-star text-sm"></i>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Total Purchase Value</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">₹{totalPurchaseValue.toLocaleString()}</div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <input className="px-4 py-2 border rounded-lg w-64 text-sm" placeholder="Search vendors..." />
                    <button className="px-4 py-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-50"><i className="fas fa-filter"></i></button>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> Add New Vendor
                </button>
            </div>

            {/* Modal / Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[600px] shadow-2xl">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-xl">Add Vendor</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-500"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleCreateVendor} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Vendor Name</label><input name="name" required className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Vendor Code</label><input name="code" required className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                                    <select name="category" className="w-full p-2 border rounded">
                                        <option>Cement</option><option>Steel</option><option>Hardware</option><option>Electrical</option><option>Plumbing</option><option>Aggregates</option>
                                    </select>
                                </div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Mobile</label><input name="mobile" required className="w-full p-2 border rounded" /></div>
                                <div className="col-span-2"><label className="block text-xs font-bold text-gray-700 mb-1">Email</label><input name="email" type="email" required className="w-full p-2 border rounded" /></div>
                                <div className="col-span-2"><label className="block text-xs font-bold text-gray-700 mb-1">Address</label><textarea name="address" required className="w-full p-2 border rounded" rows="2" /></div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold mt-4">Save Vendor</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Vendor List */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Vendor Name</th>
                            <th className="p-4 font-semibold text-gray-600">Code</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Total Purchase</th>
                            <th className="p-4 font-semibold text-gray-600">Rating</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {vendors.map(vendor => (
                            <tr key={vendor._id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-800">{vendor.name}</td>
                                <td className="p-4 text-gray-500">{vendor.code}</td>
                                <td className="p-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{vendor.category}</span>
                                </td>
                                <td className="p-4 font-medium">₹{(vendor.totalPurchaseValue || 0).toLocaleString()}</td>
                                <td className="p-4 text-yellow-500"><i className="fas fa-star"></i> {vendor.rating || 0}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${vendor.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {vendor.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => navigate(`/vendors/${vendor._id}`)}
                                        className="text-blue-600 hover:text-blue-800 text-center w-full"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Vendors;
