import React from 'react';

const AssetHistoryModal = ({ asset, onClose }) => {
    // Dummy history data
    const history = [
        { id: 1, type: 'assignment', date: '2023-10-15', title: 'Assigned to Metro Station Project', description: 'For foundation work', user: 'Admin' },
        { id: 2, type: 'maintenance', date: '2023-09-01', title: 'Routine Service', description: 'Oil change and filter replacement', cost: '₹5,000' },
        { id: 3, type: 'purchase', date: '2023-01-10', title: 'Asset Acquired', description: 'Purchased from CAT Dealer', cost: '₹45,00,000' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">Asset History</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            <i className="fas fa-history"></i>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{asset.name}</h4>
                            <p className="text-xs text-gray-500">{asset.code}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                        {history.map((record) => (
                            <div key={record.id} className="relative pl-8">
                                <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${record.type === 'assignment' ? 'bg-blue-500' :
                                    record.type === 'maintenance' ? 'bg-orange-500' : 'bg-green-500'
                                    }`}></span>

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <h4 className="font-semibold text-gray-800 text-sm">{record.title}</h4>
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full mt-1 sm:mt-0 max-w-fit">
                                        {record.date}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                                {record.cost && (
                                    <p className="text-xs font-semibold text-gray-700 mt-1">Cost: {record.cost}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-colors text-sm"
                    >
                        Close History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetHistoryModal;
