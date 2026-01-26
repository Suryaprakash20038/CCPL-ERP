import React, { useState } from 'react';

const AssetForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: 'Heavy Machinery',
        brand: '',
        purchaseDate: '',
        purchaseCost: '',
        warrantyPeriod: '',
        fuelType: 'Diesel',
        status: 'Active',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Helper for clean input fields
    const InputField = ({ label, name, type = "text", placeholder, required = false, width = "full", icon }) => (
        <div className={`col-span-2 md:col-span-${width === "half" ? "1" : "2"}`}>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {icon && <i className={`fas ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm`}></i>}
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className={`w-full ${icon ? 'pl-9' : 'px-3'} py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all hover:border-gray-300 font-medium`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );

    const SelectField = ({ label, name, options, width = "full" }) => (
        <div className={`col-span-2 md:col-span-${width === "half" ? "1" : "2"}`}>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
            <div className="relative">
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none font-medium hover:border-gray-300"
                >
                    {options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all scale-100 h-auto my-auto border border-gray-100">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Register Asset</h3>
                        <p className="text-sm text-gray-500 mt-1">Add a new equipment or vehicle to the inventory</p>
                    </div>
                    <button onClick={onCancel} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                    {/* Section: Basic Info */}
                    <div className="mb-8">
                        <h4 className="flex items-center text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                            <i className="fas fa-info-circle text-blue-500 mr-2"></i> Basic Information
                        </h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                            <InputField label="Asset Name" name="name" width="half" placeholder="e.g. Excavator EX-200" required />
                            <InputField label="Asset ID / Code" name="code" width="half" placeholder="e.g. EQ-2023-001" required />
                            <SelectField label="Category" name="category" width="half" options={['Heavy Machinery', 'Vehicles', 'Power Tools', 'Hand Tools', 'PPE']} />
                            <InputField label="Brand / Model" name="brand" width="half" placeholder="e.g. CAT 320D" />
                        </div>
                    </div>

                    {/* Section: Operational Info */}
                    <div className="mb-8">
                        <h4 className="flex items-center text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                            <i className="fas fa-cogs text-blue-500 mr-2"></i> Operational Details
                        </h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                            <SelectField label="Initial Status" name="status" width="half" options={['Active', 'In Use', 'Under Maintenance', 'Retired']} />
                            <SelectField label="Fuel Type" name="fuelType" width="half" options={['Diesel', 'Petrol', 'Electric', 'N/A']} />
                        </div>
                    </div>

                    {/* Section: Purchase & Financial */}
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                            <i className="fas fa-receipt text-blue-500 mr-2"></i> Purchase & Financials
                        </h4>
                        <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                            <div className="col-span-1">
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Purchase Date</label>
                                <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700" />
                            </div>
                            <InputField label="Purchase Cost (₹)" name="purchaseCost" width="half" placeholder="0.00" type="number" />

                            <div className="col-span-3 mt-2">
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Documents & Images</label>
                                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/10 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                                        <i className="fas fa-cloud-upload-alt text-xl text-gray-400 group-hover:text-blue-500"></i>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">Click to upload documents</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-white hover:border-gray-400 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                        <i className="fas fa-check mr-2"></i> Save Asset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetForm;
