/**
 * CCPL Manpower Management Store
 * Handles persistence for supervisors and labours
 */

const INITIAL_MANPOWER = [
    {
        id: 'MP-001',
        projectId: 'PROJ-SKYL',
        projectName: 'Skyline Residential Complex',
        role: "Supervisor",
        name: "Rajesh Kumar",
        mobile: "9876543210",
        aadhaarNumber: "123456789012",
        aadhaarFrontImage: null,
        aadhaarBackImage: null,
        address: "123, MG Road, Bangalore",
        department: "Civil",
        experience: "5",
        status: "Approved",
        addedBy: "Mike Wilson",
        createdAt: new Date().toISOString()
    },
    {
        id: 'MP-002',
        projectId: 'PROJ-SKYL',
        projectName: 'Skyline Residential Complex',
        role: "Labour",
        name: "Somu Yadav",
        mobile: "9988776655",
        aadhaarNumber: "987654321098",
        aadhaarFrontImage: null,
        aadhaarBackImage: null,
        address: "Labour Colony, Site A",
        skillType: "Mason",
        dailyWage: "800",
        shift: "Day",
        status: "Pending",
        addedBy: "Mike Wilson",
        createdAt: new Date().toISOString()
    }
];

export const getManpowerStore = () => {
    const data = localStorage.getItem('ccpl_manpower');
    if (!data) {
        localStorage.setItem('ccpl_manpower', JSON.stringify(INITIAL_MANPOWER));
        return INITIAL_MANPOWER;
    }
    return JSON.parse(data);
};

export const saveManpower = (member) => {
    const manpower = getManpowerStore();
    const newMember = {
        ...member,
        id: 'MP-' + Date.now(),
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    const updated = [newMember, ...manpower];
    localStorage.setItem('ccpl_manpower', JSON.stringify(updated));
    return newMember;
};

export const updateManpowerStatus = (memberId, status, rejectionReason = '') => {
    const manpower = getManpowerStore();
    const updated = manpower.map(m => {
        if (m.id === memberId) {
            return { ...m, status, rejectionReason };
        }
        return m;
    });
    localStorage.setItem('ccpl_manpower', JSON.stringify(updated));
};

export const deactivateManpower = (memberId) => {
    const manpower = getManpowerStore();
    const updated = manpower.map(m => {
        if (m.id === memberId) {
            return { ...m, status: 'Inactive' };
        }
        return m;
    });
    localStorage.setItem('ccpl_manpower', JSON.stringify(updated));
};

export const deleteManpower = (memberId) => {
    const manpower = getManpowerStore();
    const updated = manpower.filter(m => m.id !== memberId);
    localStorage.setItem('ccpl_manpower', JSON.stringify(updated));
};

export const formatAadhaar = (num) => {
    if (!num) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${num.slice(-4)}`;
};
