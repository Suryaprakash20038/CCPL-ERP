import { useState } from 'react';
import AssetCard from '../components/assets/AssetCard';
import AssetFilters from '../components/assets/AssetFilters';
import AssetForm from '../components/assets/AssetForm';
import AssetAssignmentModal from '../components/assets/AssetAssignmentModal';
import MaintenanceLogModal from '../components/assets/MaintenanceLogModal';
import AssetHistoryModal from '../components/assets/AssetHistoryModal';

const Assets = () => {
    // Dummy Data
    const [assets, setAssets] = useState([
        { id: 1, name: 'Excavator EX-200', code: 'EQ-2023-001', category: 'Heavy Machinery', status: 'Active', fuelLevel: 75, brand: 'Hitachi', site: 'Metro Station Project' },
        { id: 2, name: 'Dump Truck DT-40', code: 'VH-2023-012', category: 'Vehicles', status: 'In Use', fuelLevel: 45, brand: 'Tata', custodian: 'John Driver' },
        { id: 3, name: 'Concrete Mixer', code: 'EQ-2023-005', category: 'Heavy Machinery', status: 'Under Maintenance', fuelLevel: 0, brand: 'Winget' },
        { id: 4, name: 'Drill Machine Pro', code: 'PT-2023-089', category: 'Power Tools', status: 'Active', brand: 'Bosch', site: 'Warehouse' },
        { id: 5, name: 'Safety Helmets (Batch A)', code: 'PPE-2023-100', category: 'PPE', status: 'In Use', brand: 'Karam', site: 'Highway Project' },
        { id: 6, name: 'JCB 3DX', code: 'EQ-2023-002', category: 'Heavy Machinery', status: 'Active', fuelLevel: 90, brand: 'JCB', site: 'Yard' },
    ]);

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Filter Logic
    const filteredAssets = assets.filter(asset => {
        const matchesCategory = activeFilter === 'All' || asset.category === activeFilter;
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Stats Calculation
    const stats = {
        total: assets.length,
        inUse: assets.filter(a => a.status === 'In Use').length,
        active: assets.filter(a => a.status === 'Active').length,
        maintenance: assets.filter(a => a.status === 'Under Maintenance').length
    };

    const StatCard = ({ label, value, icon, color }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-lg`}>
                <i className={`fas ${icon}`}></i>
            </div>
        </div>
    );

    // Handlers
    const handleRegisterAsset = (newAsset) => {
        setAssets([...assets, { ...newAsset, id: assets.length + 1, fuelLevel: 100, site: 'Yard' }]);
        setShowRegisterModal(false);
    };

    const handleAssignAsset = (assetId, assignmentDetails) => {
        setAssets(assets.map(a =>
            a.id === assetId
                ? { ...a, status: 'In Use', site: assignmentDetails.targetLocation, custodian: assignmentDetails.assignToType === 'User' ? assignmentDetails.targetLocation : null }
                : a
        ));
        setShowAssignmentModal(false);
        setSelectedAsset(null);
    };

    const handleLogMaintenance = (assetId, maintenanceDetails) => {
        setAssets(assets.map(a =>
            a.id === assetId ? { ...a, status: 'Under Maintenance' } : a
        ));
        setShowMaintenanceModal(false);
        setSelectedAsset(null);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50/50 p-2">

            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assets Management</h1>
                    <p className="text-gray-500 mt-1">Monitor fleet health, assignments, and utilization</p>
                </div>
                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-lg flex items-center shadow-lg shadow-gray-900/10 transition-all font-medium"
                >
                    <i className="fas fa-plus mr-2"></i> Register New Asset
                </button>
            </div>

            {/* Dashboard Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Assets" value={stats.total} icon="fa-cubes" color="bg-blue-50 text-blue-600" />
                <StatCard label="In Operation" value={stats.inUse} icon="fa-truck-moving" color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Available" value={stats.active} icon="fa-check-circle" color="bg-indigo-50 text-indigo-600" />
                <StatCard label="In Maintenance" value={stats.maintenance} icon="fa-wrench" color="bg-amber-50 text-amber-600" />
            </div>

            <AssetFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                onSearch={setSearchQuery}
            />

            {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                    {filteredAssets.map(asset => (
                        <AssetCard
                            key={asset.id}
                            asset={asset}
                            onAssign={(asset) => {
                                setSelectedAsset(asset);
                                setShowAssignmentModal(true);
                            }}
                            onMaintenance={(asset) => {
                                setSelectedAsset(asset);
                                setShowMaintenanceModal(true);
                            }}
                            onViewHistory={(asset) => {
                                setSelectedAsset(asset);
                                setShowHistoryModal(true);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="text-gray-300 text-6xl mb-4"><i className="fas fa-search"></i></div>
                    <h3 className="text-lg font-medium text-gray-500">No assets found</h3>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query</p>
                </div>
            )}

            {/* Modals */}
            {showRegisterModal && (
                <AssetForm
                    onSubmit={handleRegisterAsset}
                    onCancel={() => setShowRegisterModal(false)}
                />
            )}

            {showAssignmentModal && selectedAsset && (
                <AssetAssignmentModal
                    asset={selectedAsset}
                    onAssign={handleAssignAsset}
                    onCancel={() => {
                        setShowAssignmentModal(false);
                        setSelectedAsset(null);
                    }}
                />
            )}

            {showMaintenanceModal && selectedAsset && (
                <MaintenanceLogModal
                    asset={selectedAsset}
                    onSave={handleLogMaintenance}
                    onCancel={() => {
                        setShowMaintenanceModal(false);
                        setSelectedAsset(null);
                    }}
                />
            )}

            {showHistoryModal && selectedAsset && (
                <AssetHistoryModal
                    asset={selectedAsset}
                    onClose={() => {
                        setShowHistoryModal(false);
                        setSelectedAsset(null);
                    }}
                />
            )}
        </div>
    );
};

export default Assets;
