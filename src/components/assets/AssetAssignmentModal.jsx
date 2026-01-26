import React, { useState } from 'react';

const AssetAssignmentModal = ({ asset, onAssign, onCancel }) => {
    const [assignmentData, setAssignmentData] = useState({
        assignToType: 'Site', // Site or User
        targetLocation: '', // Site Name or User Name
        assignmentDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        purpose: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData({ ...assignmentData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAssign(asset.id, assignmentData);
    };

    const SelectionCard = ({ type, icon, label, selected }) => (
        <div
            onClick={() => setAssignmentData({ ...assignmentData, assignToType: type })}
            className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-200 ${selected
                ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
        >
            <i className={`fas ${icon} text-xl mb-2 ${selected ? 'text-blue-500' : 'text-gray-400'}`}></i>
            <span className="text-sm font-semibold">{label}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <h3 className="text-lg font-bold text-gray-900">Assign Asset</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Asset Summary */}
                <div className="px-6 py-4 bg-blue-50/30 border-b border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <i className="fas fa-truck-pickup text-xl"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{asset.name}</h4>
                        <span className="inline-block px-2 py-0.5 bg-white border border-blue-100 rounded text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                            {asset.code}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Assignment Type</label>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <SelectionCard type="Site" icon="fa-building" label="Project Site" selected={assignmentData.assignToType === 'Site'} />
                        <SelectionCard type="User" icon="fa-user" label="Individual User" selected={assignmentData.assignToType === 'User'} />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                {assignmentData.assignToType === 'Site' ? 'Select Project Site' : 'Select User'}
                            </label>
                            <select
                                name="targetLocation"
                                value={assignmentData.targetLocation}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all"
                            >
                                <option value="">Select Target...</option>
                                {assignmentData.assignToType === 'Site' ? (
                                    <>
                                        <option>Metro Station Project</option>
                                        <option>Highway Expansion</option>
                                        <option>City Mall Construction</option>
                                    </>
                                ) : (
                                    <>
                                        <option>John Doe (Site Engineer)</option>
                                        <option>Jane Smith (Supervisor)</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Date</label>
                                <input
                                    type="date"
                                    name="assignmentDate"
                                    value={assignmentData.assignmentDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Return Date (Est)</label>
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={assignmentData.returnDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Purpose / Task</label>
                            <textarea
                                name="purpose"
                                value={assignmentData.purpose}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                                rows="2"
                                placeholder="Brief description of usage..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm"
                        >
                            Confirm Assignment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetAssignmentModal;
