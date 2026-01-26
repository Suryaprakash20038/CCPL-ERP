import React, { useState } from 'react';

const MaintenanceLogModal = ({ asset, onSave, onCancel }) => {
    const [maintenanceData, setMaintenanceData] = useState({
        date: new Date().toISOString().split('T')[0],
        issueDescription: '',
        serviceCost: '',
        nextServiceDate: '',
        vendor: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMaintenanceData({ ...maintenanceData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(asset.id, maintenanceData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Log Maintenance</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <i className="fas fa-wrench"></i>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{asset.name}</h4>
                            <p className="text-xs text-gray-500">{asset.code}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Date*</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={maintenanceData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        name="serviceCost"
                                        value={maintenanceData.serviceCost}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / Service Provider</label>
                            <input
                                type="text"
                                name="vendor"
                                value={maintenanceData.vendor}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                placeholder="e.g. Authorized Service Center"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue / Service Description*</label>
                            <textarea
                                name="issueDescription"
                                value={maintenanceData.issueDescription}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                rows="3"
                                placeholder="Describe the maintenance work..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Due (Optional)</label>
                            <input
                                type="date"
                                name="nextServiceDate"
                                value={maintenanceData.nextServiceDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bill / Invoice (Optional)</label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50/50">
                                <span className="text-xs text-gray-500"><i className="fas fa-paperclip mr-1"></i> Upload Document</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-md transition-all"
                        >
                            Log Maintenance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceLogModal;
