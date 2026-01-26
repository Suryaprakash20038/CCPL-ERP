import React from 'react';

const AssetCard = ({ asset, onAssign, onMaintenance, onViewHistory }) => {
    // Professional Status Styles
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20';
            case 'In Use': return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/20';
            case 'Under Maintenance': return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20';
            case 'Retired': return 'bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/20';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getProgressColor = (value) => {
        if (value > 50) return 'bg-emerald-500';
        if (value > 20) return 'bg-amber-400';
        return 'bg-rose-500';
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full relative">

            {/* Top Status Bar Decoration */}
            <div className={`h-1 w-full ${asset.status === 'Active' ? 'bg-emerald-500' : asset.status === 'In Use' ? 'bg-blue-500' : asset.status === 'Under Maintenance' ? 'bg-amber-400' : 'bg-slate-300'}`}></div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                            <i className="fas fa-truck-pickup text-lg"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{asset.name}</h3>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">{asset.code}</p>
                        </div>
                    </div>
                    {/* Minimalist Status Badge */}
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ring-1 ring-inset ${getStatusStyle(asset.status)}`}>
                        {asset.status}
                    </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5 p-3 bg-gray-50/50 rounded-lg border border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Category</span>
                        <span className="text-sm font-semibold text-slate-700 truncate">{asset.category}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">{asset.status === 'In Use' ? 'Location' : 'Home Base'}</span>
                        <span className="text-sm font-semibold text-slate-700 truncate" title={asset.site}>{asset.site || 'N/A'}</span>
                    </div>

                    {asset.custodian && (
                        <div className="col-span-2 flex flex-col pt-1 border-t border-gray-100">
                            <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Assigned To</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                    {asset.custodian.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{asset.custodian}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fuel/Usage Bar */}
                {asset.fuelLevel !== undefined && (
                    <div className="mt-auto mb-4">
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[10px] font-medium text-gray-400 uppercase">Fuel Level</span>
                            <span className="text-xs font-bold text-gray-700">{asset.fuelLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(asset.fuelLevel)}`}
                                style={{ width: `${asset.fuelLevel}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action Bar - Clean & Minimal */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => onAssign(asset)}
                        disabled={asset.status === 'Under Maintenance'}
                        className="flex flex-col items-center justify-center gap-1 py-1.5 rounded hover:bg-gray-50 group/btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-user-plus text-gray-400 group-hover/btn:text-blue-600 text-sm"></i>
                        <span className="text-[10px] font-medium text-gray-500 group-hover/btn:text-gray-700">Assign</span>
                    </button>

                    <button
                        onClick={() => onMaintenance(asset)}
                        className="flex flex-col items-center justify-center gap-1 py-1.5 rounded hover:bg-gray-50 group/btn transition-colors"
                    >
                        <i className="fas fa-tools text-gray-400 group-hover/btn:text-amber-500 text-sm"></i>
                        <span className="text-[10px] font-medium text-gray-500 group-hover/btn:text-gray-700">Service</span>
                    </button>

                    <button
                        onClick={() => onViewHistory(asset)}
                        className="flex flex-col items-center justify-center gap-1 py-1.5 rounded hover:bg-gray-50 group/btn transition-colors"
                    >
                        <i className="fas fa-history text-gray-400 group-hover/btn:text-purple-500 text-sm"></i>
                        <span className="text-[10px] font-medium text-gray-500 group-hover/btn:text-gray-700">History</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetCard;
