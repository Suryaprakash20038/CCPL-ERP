import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatePurchase = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [items, setItems] = useState([
        { materialName: '', unit: '', quantity: 0, unitPrice: 0, discount: 0, gstPercent: 18, baseAmount: 0, gstAmount: 0, totalAmount: 0 }
    ]);
    const [grandTotal, setGrandTotal] = useState(0);

    // Form fields
    const [projectId, setProjectId] = useState('');
    const [vendorId, setVendorId] = useState('');

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        const res = await fetch('http://localhost:5000/api/vendors', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        setVendors(Array.isArray(data) ? data : []);
    };

    const handleVendorChange = (e) => {
        const vId = e.target.value;
        setVendorId(vId);
        const vendor = vendors.find(v => v._id === vId);
        setSelectedVendor(vendor);
        // Reset items possibly, or try to match if keeping
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        // Auto Calc
        if (selectedVendor && field === 'materialName') {
            // Auto fill unit and price
            const mat = selectedVendor.materials.find(m => m.name === value);
            if (mat) {
                newItems[index].unit = mat.unit;
                newItems[index].unitPrice = mat.pricePerUnit;
                newItems[index].gstPercent = mat.gst;
            }
        }

        // Logic
        const qty = parseFloat(newItems[index].quantity) || 0;
        const price = parseFloat(newItems[index].unitPrice) || 0;
        const disc = parseFloat(newItems[index].discount) || 0;
        const gstP = parseFloat(newItems[index].gstPercent) || 0;

        const base = qty * price;
        const gstAmt = base * (gstP / 100);
        const total = base + gstAmt - disc;

        newItems[index].baseAmount = base;
        newItems[index].gstAmount = gstAmt;
        newItems[index].totalAmount = total;

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { materialName: '', unit: '', quantity: 0, unitPrice: 0, discount: 0, gstPercent: 18, baseAmount: 0, gstAmount: 0, totalAmount: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Calc Grand Total
    useEffect(() => {
        const total = items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
        setGrandTotal(total);
    }, [items]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            vendorId,
            project: projectId, // Just string for now
            items,
            grandTotal
        };

        try {
            const res = await fetch('http://localhost:5000/api/purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert('Purchase Order Created Successfully!');
                navigate('/vendors');
            } else {
                alert('Error creating PO');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Create Purchase Order</h1>
                <button onClick={() => navigate('/vendors')} className="text-gray-500 hover:text-gray-700">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Select Vendor</label>
                        <select className="w-full p-2 border rounded" value={vendorId} onChange={handleVendorChange} required>
                            <option value="">-- Choose Vendor --</option>
                            {vendors.map(v => <option key={v._id} value={v._id}>{v.name} ({v.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Project / Site Name</label>
                        <input className="w-full p-2 border rounded" value={projectId} onChange={e => setProjectId(e.target.value)} required placeholder="e.g. Skyline Towers" />
                    </div>
                </div>

                {/* Items Table */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Purchase Items</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 w-1/4">Material</th>
                                    <th className="p-2">Unit</th>
                                    <th className="p-2 w-20">Qty</th>
                                    <th className="p-2">Price</th>
                                    <th className="p-2">GST %</th>
                                    <th className="p-2">Base</th>
                                    <th className="p-2">GST Amt</th>
                                    <th className="p-2">Total</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="p-2">
                                            {selectedVendor ? (
                                                <select
                                                    className="w-full p-1 border rounded"
                                                    value={item.materialName}
                                                    onChange={(e) => handleItemChange(idx, 'materialName', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Material</option>
                                                    {selectedVendor.materials.map((m, i) => (
                                                        <option key={i} value={m.name}>{m.name}</option>
                                                    ))}
                                                </select>
                                            ) : <span className="text-gray-400 italic">Select Vendor 1st</span>}
                                        </td>
                                        <td className="p-2 bg-gray-50">{item.unit}</td>
                                        <td className="p-2"><input type="number" className="w-full p-1 border rounded" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} required /></td>
                                        <td className="p-2 bg-gray-50">{item.unitPrice}</td>
                                        <td className="p-2"><input type="number" className="w-full p-1 border rounded" value={item.gstPercent} onChange={(e) => handleItemChange(idx, 'gstPercent', e.target.value)} /></td>
                                        <td className="p-2 text-gray-600">{item.baseAmount.toFixed(2)}</td>
                                        <td className="p-2 text-gray-600">{item.gstAmount.toFixed(2)}</td>
                                        <td className="p-2 font-bold">{item.totalAmount.toFixed(2)}</td>
                                        <td className="p-2 text-center text-red-500 cursor-pointer" onClick={() => removeItem(idx)}><i className="fas fa-trash"></i></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" onClick={addItem} className="mt-2 text-blue-600 text-sm font-semibold hover:underline">+ Add Another Item</button>
                </div>

                {/* Footer Totals */}
                <div className="flex justify-end border-t pt-4">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Grand Total:</span>
                            <span>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition">
                            Generate Purchase Order
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePurchase;
