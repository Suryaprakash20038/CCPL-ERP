import React from 'react';

const AssetFilters = ({ activeFilter, setActiveFilter, onSearch }) => {
    const filters = [
        { id: 'All', label: 'All Assets' },
        { id: 'Heavy Machinery', label: 'Machinery' },
        { id: 'Vehicles', label: 'Vehicles' },
        { id: 'Power Tools', label: 'Power Tools' },
        { id: 'Hand Tools', label: 'Hand Tools' },
        { id: 'PPE', label: 'PPE' }
    ];

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            {/* Clean Segmented Tabs */}
            <div className="flex overflow-x-auto w-full sm:w-auto p-1 bg-gray-50/50 rounded-lg no-scrollbar">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeFilter === filter.id
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50 ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Integrated Search */}
            <div className="relative w-full sm:w-72 group">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                <input
                    type="text"
                    placeholder="Search by name, code or brand..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
            </div>
        </div>
    );
};

export default AssetFilters;
