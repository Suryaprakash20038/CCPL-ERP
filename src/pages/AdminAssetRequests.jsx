import React, { useState, useEffect } from 'react';
import { getRequestsStore, updateRequestStatus } from '../utils/assetStore';

const AdminAssetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setRequests(getRequestsStore());
    };

    const handleApprove = (reqId) => {
        if (window.confirm('Are you sure you want to approve this asset requirement? This will update the project inventory.')) {
            updateRequestStatus(reqId, 'Approved');
            loadData();
            // Trigger a custom event for sidebar badge update if needed, but sidebar uses interval so it's fine
        }
    };

    const handleOpenRejection = (req) => {
        setSelectedReq(req);
        setIsRejectionModalOpen(true);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        const reason = new FormData(e.target).get('rejectionReason');
        updateRequestStatus(selectedReq.id, 'Rejected', reason);
        setIsRejectionModalOpen(false);
        loadData();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Asset Requirements</h1>
                <p className="text-gray-500 font-medium">Review and process resource requests from Site Engineers</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-60">Source / Project</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-60">Asset Information</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-60">Requested Qty</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-60">Justification</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-60">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest opacity-60 text-center">Decision</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-gray-900">{req.requestedBy}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">{req.projectName}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-gray-800">{req.assetName}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">Current Inventory: {req.alreadyProvided} {req.unit}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-gray-900">+{req.requestedQty}</span>
                                            <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">{req.unit}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs">
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium italic group-hover:text-gray-700 transition-colors" title={req.reason}>
                                            "{req.reason}"
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {req.status === 'Pending' ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2"
                                                >
                                                    <i className="fas fa-check text-[10px]"></i> APPROVE
                                                </button>
                                                <button
                                                    onClick={() => handleOpenRejection(req)}
                                                    className="px-5 py-2.5 bg-white border-2 border-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-2"
                                                >
                                                    <i className="fas fa-times text-[10px]"></i> REJECT
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Processed</p>
                                                <p className="text-[11px] font-bold text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-4xl">
                                                <i className="fas fa-inbox"></i>
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-black text-lg">No pending requirements</p>
                                                <p className="text-gray-400 text-sm font-medium">All site requests have been processed.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal */}
            {isRejectionModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsRejectionModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm relative z-10 animate-in zoom-in-95 overflow-hidden">
                        <div className="bg-red-600 p-8 text-white relative">
                            <h2 className="text-2xl font-black tracking-tight">Reject Request</h2>
                            <p className="text-red-100 text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">Feedback Required</p>
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="p-8 pb-10 space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Reason for Rejection *</label>
                                <textarea
                                    name="rejectionReason"
                                    required
                                    rows="4"
                                    placeholder="Explain why this request is being rejected (e.g. inventory constraint, incorrect project map)..."
                                    className="w-full border-2 border-gray-100 rounded-3xl px-5 py-4 text-sm focus:border-red-500 outline-none transition-colors bg-gray-50/50 resize-none font-medium leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsRejectionModalOpen(false)}
                                    className="grow py-4 rounded-2xl font-black text-xs text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="grow py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs shadow-xl shadow-red-100 transition-all active:scale-95 uppercase tracking-widest"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAssetRequests;
