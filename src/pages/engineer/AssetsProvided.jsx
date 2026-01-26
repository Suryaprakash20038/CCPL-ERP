import React, { useState, useEffect } from 'react';
import { getAssetsStore, getRequestsStore, saveAssetRequest } from '../../utils/assetStore';

const AssetsProvided = () => {
    const [assets, setAssets] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isNewAssetRequest, setIsNewAssetRequest] = useState(false);
    const [activeTab, setActiveTab] = useState('provided'); // 'provided' | 'requests'

    const allAssetTypes = [
        { name: "Tower Crane", category: "Heavy Machinery", unit: "Unit" },
        { name: "Dump Truck", category: "Vehicles", unit: "Unit" },
        { name: "Concrete Pump", category: "Machinery", unit: "Unit" },
        { name: "Excavator", category: "Heavy Machinery", unit: "Unit" },
        { name: "Safety Helmets", category: "Safety", unit: "Sets" },
        { name: "Scaffolding", category: "Support", unit: "MT" },
        { name: "Leveling Instrument", category: "Precision", unit: "Set" }
    ];

    // Mock engineer data - in a real app this comes from auth context
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{"name": "Mike Wilson", "role": "engineer"}');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setAssets(getAssetsStore());
        setRequests(getRequestsStore().filter(r => r.requestedBy === currentUser.name));
    };

    const handleRequestClick = (asset, isNew = false) => {
        setSelectedAsset(asset);
        setIsNewAssetRequest(isNew);
        setIsModalOpen(true);
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const requestedQty = formData.get('requestedQty');
        const reason = formData.get('reason');
        const requiredDate = formData.get('requiredDate');

        let assetDetails = selectedAsset;
        if (isNewAssetRequest) {
            const selectedName = formData.get('assetName');
            const masterAsset = allAssetTypes.find(a => a.name === selectedName);
            assetDetails = {
                id: 'NEW-' + Date.now(),
                name: masterAsset?.name || selectedName,
                projectName: 'Skyline Residential Complex', // Fallback for demo
                providedQty: 0,
                unit: masterAsset?.unit || 'Units'
            };
        }

        if (!requestedQty || requestedQty <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        const request = {
            projectId: 'PROJ-001',
            projectName: assetDetails.projectName,
            assetId: assetDetails.id,
            assetName: assetDetails.name,
            requestedQty: parseInt(requestedQty),
            alreadyProvided: assetDetails.providedQty,
            unit: assetDetails.unit,
            reason: reason,
            requiredDate: requiredDate,
            requestedBy: currentUser.name,
            role: "Engineer"
        };

        saveAssetRequest(request);
        setIsModalOpen(false);
        loadData();
        alert('Asset request submitted to Admin!');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Project Assets</h1>
                    <p className="text-gray-500 mt-1">Manage and request resources for {activeTab === 'provided' ? 'your site' : 'approval'}</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl items-center gap-2">
                    <button
                        onClick={() => setActiveTab('provided')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'provided' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Assets Provided
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Request Status
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-1"></div>
                    <button
                        onClick={() => handleRequestClick(null, true)}
                        className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i> REQUEST NEW ASSET
                    </button>
                </div>
            </div>

            {activeTab === 'provided' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map((asset) => (
                        <div key={asset.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>

                            <div className="flex justify-between items-start mb-4 relative">
                                <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
                                    <i className="fas fa-tools text-xl"></i>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${asset.status === 'Operational' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {asset.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1">{asset.name}</h3>
                            <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-tighter">{asset.category}</p>

                            <div className="flex items-end justify-between border-t border-gray-50 pt-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Provided Quantity</p>
                                    <p className="text-2xl font-black text-gray-900">{asset.providedQty} <span className="text-sm font-bold text-gray-400">{asset.unit}</span></p>
                                </div>
                                <button
                                    onClick={() => handleRequestClick(asset)}
                                    className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
                                    title="Request Extra"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Requested Qty</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{req.assetName}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">ID: {req.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-blue-600">+{req.requestedQty}</span> <span className="text-xs text-gray-400">{req.unit}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 italic max-w-xs truncate">
                                            {req.status === 'Rejected' ? req.rejectionReason : req.reason}
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic text-sm">No requests found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Request Modal */}
            {isModalOpen && (selectedAsset || isNewAssetRequest) && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    {isNewAssetRequest ? 'Request New Resource' : 'Request Extra Units'}
                                </h2>
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Resource Requirement</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleRequestSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {!isNewAssetRequest ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Project Name</label>
                                            <input type="text" value={selectedAsset.projectName} readOnly className="w-full bg-gray-50 border-none px-0 py-1 font-bold text-gray-800 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Asset Name</label>
                                            <input type="text" value={selectedAsset.name} readOnly className="w-full bg-gray-50 border-none px-0 py-1 font-bold text-gray-800 outline-none" />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Select Asset Type *</label>
                                        <select
                                            name="assetName"
                                            required
                                            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-colors bg-gray-50/50 appearance-none"
                                        >
                                            <option value="">Choose an equipment...</option>
                                            {allAssetTypes.map((a, i) => (
                                                <option key={i} value={a.name}>{a.name} ({a.category})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Current Quantity</p>
                                    <p className="text-xl font-black text-gray-800">
                                        {isNewAssetRequest ? '0' : selectedAsset.providedQty}
                                        <span className="text-xs font-bold text-gray-400 ml-1">
                                            {isNewAssetRequest ? 'Units' : selectedAsset.unit}
                                        </span>
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <label className="block text-[10px] font-black text-blue-600 uppercase mb-1">Quantity Required *</label>
                                    <input
                                        name="requestedQty"
                                        type="number"
                                        min="1"
                                        autoFocus
                                        required
                                        className="w-full bg-transparent border-none p-0 text-xl font-black text-blue-700 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Required By Date *</label>
                                <input
                                    type="date"
                                    name="requiredDate"
                                    required
                                    className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-colors bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Justification / Reason *</label>
                                <textarea
                                    name="reason"
                                    required
                                    rows="3"
                                    placeholder="Explain why these extra units are needed on site..."
                                    className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors bg-gray-50/50 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-paper-plane text-xs"></i>
                                SEND REQUIREMENT
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetsProvided;
