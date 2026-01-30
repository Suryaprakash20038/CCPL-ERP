import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [selectedPO, setSelectedPO] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock Fetch Vendor
                await new Promise(r => setTimeout(r, 300));
                const allVendors = JSON.parse(localStorage.getItem('mock_vendors') || '[]');
                const foundVendor = allVendors.find(v => v._id === id);

                if (foundVendor) {
                    setVendor(foundVendor);
                    setMaterials(foundVendor.materials || []);
                } else {
                    setVendor({
                        _id: id, name: 'Mock Vendor ' + id, code: 'MOCK-001', category: 'General',
                        contact: { mobile: '0000000000', email: 'mock@vendor.com' },
                        address: 'Mock Address', status: 'Active', totalPurchaseValue: 0, rating: 0
                    });
                }

                // Mock Fetch Purchases
                const allPurchases = JSON.parse(localStorage.getItem('mock_purchases') || '[]');
                let vPurchases = allPurchases.filter(p => p.vendorId === id);

                if (vPurchases.length === 0) {
                    // Fallback static data if no custom purchases found
                    vPurchases = [
                        {
                            _id: 'p1', poNumber: 'PO-2023-001', createdAt: new Date().toISOString(),
                            project: 'Skyline Towers', vendorId: id,
                            grandTotal: 50000, status: 'Approved',
                            items: [{ materialName: 'Cement', quantity: 100, unit: 'Bags', unitPrice: 400, baseAmount: 40000, gstAmount: 7200, totalAmount: 47200 }]
                        }
                    ];
                }
                setPurchases(vPurchases);

                setLoading(false);
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, [id]);

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        data.pricePerUnit = parseFloat(data.pricePerUnit);
        data.gst = parseFloat(data.gst);

        // Update local mock data
        const allVendors = JSON.parse(localStorage.getItem('mock_vendors') || '[]');
        const updatedVendors = allVendors.map(v => {
            if (v._id === id) {
                const newMaterials = [...(v.materials || []), data];
                v.materials = newMaterials;
                setMaterials(newMaterials); // Update state
                return v;
            }
            return v;
        });

        localStorage.setItem('mock_vendors', JSON.stringify(updatedVendors));
        setShowMaterialForm(false);
        alert('Material added (Local Mock)');
    };

    // Helper to format items for summary
    const formatItemsSummary = (items) => {
        return items.map(i => `${i.materialName} (${i.quantity} ${i.unit})`).join(', ');
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!vendor) return <div className="p-6">Vendor not found</div>;

    return (
        <div className="p-6">
            <button onClick={() => navigate('/vendors')} className="mb-4 text-gray-500 hover:text-gray-900"><i className="fas fa-arrow-left"></i> Back to Vendors</button>

            {/* Header / Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{vendor.name}</h1>
                    <div className="text-gray-500 mt-1">{vendor.code} • {vendor.category} • <span className={`text-${vendor.status === 'Active' ? 'green' : 'red'}-600`}>{vendor.status}</span></div>
                    <div className="mt-4 flex gap-6 text-sm text-gray-600">
                        <div><i className="fas fa-phone mr-2"></i>{vendor.contact.mobile}</div>
                        <div><i className="fas fa-envelope mr-2"></i>{vendor.contact.email}</div>
                        <div><i className="fas fa-map-marker-alt mr-2"></i>{vendor.address}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600">₹{(vendor.totalPurchaseValue || 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mt-1">Total Lifetime Purchase</div>
                    <div className="mt-2 text-sm font-medium">Rating: {vendor.rating} <i className="fas fa-star text-yellow-500"></i></div>
                </div>
            </div>

            {/* Content Tabs/Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Materials (unchanged) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Supplied Materials</h3>
                            <button onClick={() => setShowMaterialForm(true)} className="text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"><i className="fas fa-plus"></i> Add</button>
                        </div>

                        {showMaterialForm && (
                            <form onSubmit={handleAddMaterial} className="bg-blue-50 p-3 rounded mb-4 text-sm space-y-2">
                                <input name="name" placeholder="Material Name" className="w-full p-1 border rounded" required />
                                <div className="flex gap-2">
                                    <input name="unit" placeholder="Unit (Bag)" className="w-1/2 p-1 border rounded" required />
                                    <input name="pricePerUnit" placeholder="Price" className="w-1/2 p-1 border rounded" required />
                                </div>
                                <div className="flex gap-2">
                                    <input name="gst" defaultValue="18" placeholder="GST %" className="w-1/2 p-1 border rounded" />
                                    <button className="w-1/2 bg-blue-600 text-white rounded">Save</button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {materials.map((m, i) => (
                                <div key={i} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                                    <div>
                                        <div className="font-medium text-gray-800">{m.name}</div>
                                        <div className="text-xs text-gray-500">{m.unit} • GST {m.gst}%</div>
                                    </div>
                                    <div className="font-bold text-gray-700">₹{m.pricePerUnit}</div>
                                </div>
                            ))}
                            {materials.length === 0 && <div className="text-gray-400 text-sm text-center">No materials added.</div>}
                        </div>
                    </div>
                </div>

                {/* Right: Purchase Order History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Purchase History</h3>
                            <button onClick={() => navigate('/vendors/new-purchase')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                                <i className="fas fa-plus mr-1"></i> New Purchase
                            </button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 border-b">
                                <tr>
                                    <th className="p-3">PO Number</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Items (Qty)</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {purchases.map(po => (
                                    <tr key={po._id} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-blue-600">{po.poNumber}</td>
                                        <td className="p-3">{new Date(po.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-gray-600">
                                            {formatItemsSummary(po.items).substring(0, 30)}{formatItemsSummary(po.items).length > 30 ? '...' : ''}
                                        </td>
                                        <td className="p-3 font-bold">₹{po.grandTotal.toLocaleString()}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs ${po.status === 'Draft' ? 'bg-gray-200' :
                                                po.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>{po.status}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => setSelectedPO(po)}
                                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                                                title="View Details"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {purchases.length === 0 && (
                                    <tr><td colSpan="6" className="p-10 text-center text-gray-400">No purchases found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PO Details Modal */}
            {selectedPO && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{selectedPO.poNumber}</h2>
                                <p className="text-sm text-gray-500">Date: {new Date(selectedPO.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedPO(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600 w-10 h-10 flex items-center justify-center">
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Project</div>
                                    <div className="font-bold text-gray-800">{selectedPO.project}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Vendor</div>
                                    <div className="font-bold text-gray-800">{vendor.name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Status</div>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${selectedPO.status === 'Draft' ? 'bg-gray-200 text-gray-700' :
                                        selectedPO.status === 'Approved' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                                        }`}>{selectedPO.status}</span>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Grand Total</div>
                                    <div className="font-bold text-xl text-blue-700">₹{selectedPO.grandTotal.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-600">
                                            <tr>
                                                <th className="p-3">Material</th>
                                                <th className="p-3 text-right">Unit Price</th>
                                                <th className="p-3 text-right">Quantity</th>
                                                <th className="p-3 text-right">Base</th>
                                                <th className="p-3 text-right">GST</th>
                                                <th className="p-3 text-right font-bold">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {selectedPO.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="p-3 font-medium text-gray-800">{item.materialName}</td>
                                                    <td className="p-3 text-right">₹{item.unitPrice}</td>
                                                    <td className="p-3 text-right font-bold">{item.quantity} {item.unit}</td>
                                                    <td className="p-3 text-right text-gray-600">₹{item.baseAmount.toFixed(2)}</td>
                                                    <td className="p-3 text-right text-gray-600">₹{item.gstAmount.toFixed(2)}</td>
                                                    <td className="p-3 text-right font-bold text-blue-600">₹{item.totalAmount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 font-bold text-gray-800">
                                            <tr>
                                                <td colSpan="5" className="p-3 text-right">Total Payable Amount</td>
                                                <td className="p-3 text-right text-lg">₹{selectedPO.grandTotal.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t rounded-b-xl flex justify-end gap-3">
                            <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={() => window.print()}>
                                <i className="fas fa-print mr-2"></i> Print Order
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setSelectedPO(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorDetails;
