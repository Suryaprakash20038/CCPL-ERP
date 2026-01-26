/**
 * CCPL Asset Management Store
 * Simulates a persistent backend using localStorage
 */

const INITIAL_ASSETS = [
    { id: 'AST001', name: 'Excavator CAT 320', category: 'Heavy Machinery', providedQty: 2, unit: 'Unit', status: 'Operational', projectName: 'Skyline Residential Complex' },
    { id: 'AST015', name: 'Cement Mixer', category: 'Construction Equipment', providedQty: 4, unit: 'Units', status: 'Operational', projectName: 'Skyline Residential Complex' },
    { id: 'AST022', name: 'Power Generator 50kVA', category: 'Power Source', providedQty: 1, unit: 'Unit', status: 'In Use', projectName: 'Skyline Residential Complex' },
    { id: 'AST033', name: 'Safety Harness sets', category: 'Safety Gear', providedQty: 25, unit: 'Sets', status: 'Operational', projectName: 'Skyline Residential Complex' },
];

export const getAssetsStore = () => {
    const data = localStorage.getItem('ccpl_assets_v2');
    if (!data) {
        localStorage.setItem('ccpl_assets_v2', JSON.stringify(INITIAL_ASSETS));
        return INITIAL_ASSETS;
    }
    return JSON.parse(data);
};

export const getRequestsStore = () => {
    const data = localStorage.getItem('ccpl_asset_requests_v2');
    return data ? JSON.parse(data) : [];
};

export const saveAssetRequest = (request) => {
    const requests = getRequestsStore();
    const newRequest = {
        ...request,
        id: 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    const updated = [newRequest, ...requests];
    localStorage.setItem('ccpl_asset_requests_v2', JSON.stringify(updated));
    return newRequest;
};

export const updateRequestStatus = (requestId, status, rejectionReason = '') => {
    const requests = getRequestsStore();
    const assets = getAssetsStore();

    const updatedRequests = requests.map(req => {
        if (req.id === requestId) {
            const updatedReq = { ...req, status, rejectionReason };

            // If approved, update the asset inventory for that project
            if (status === 'Approved') {
                const updatedAssets = assets.map(asset => {
                    if (asset.id === req.assetId && asset.projectName === req.projectName) {
                        return { ...asset, providedQty: asset.providedQty + parseInt(req.requestedQty) };
                    }
                    return asset;
                });
                localStorage.setItem('ccpl_assets_v2', JSON.stringify(updatedAssets));
            }

            return updatedReq;
        }
        return req;
    });

    localStorage.setItem('ccpl_asset_requests_v2', JSON.stringify(updatedRequests));
};

export const getPendingRequestsCount = () => {
    return getRequestsStore().filter(r => r.status === 'Pending').length;
};
