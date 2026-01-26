import React, { useState, useEffect } from 'react';
import { getManpowerStore, updateManpowerStatus, deactivateManpower, deleteManpower, formatAadhaar } from '../utils/manpowerStore';

const AdminManpower = () => {
    const [manpower, setManpower] = useState([]);
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedMember, setSelectedMember] = useState(null);
    const [rejectionModal, setRejectionModal] = useState(false);

    // Auth mock
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{"role": "superadmin"}');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setManpower(getManpowerStore());
    };

    const handleAction = (id, status) => {
        if (status === 'Rejected') {
            const member = manpower.find(m => m.id === id);
            setSelectedMember(member);
            setRejectionModal(true);
            return;
        }

        if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this entry?`)) {
            updateManpowerStatus(id, status);
            loadData();
        }
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        const reason = new FormData(e.target).get('reason');
        updateManpowerStatus(selectedMember.id, 'Rejected', reason);
        setRejectionModal(false);
        loadData();
    };

    const handleDeactivate = (id) => {
        if (window.confirm('Deactivate this manpower? They will no longer be active on site.')) {
            deactivateManpower(id);
            loadData();
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('PERMANENTLY DELETE this record? This action cannot be undone.')) {
            deleteManpower(id);
            loadData();
        }
    };

    const filteredData = manpower.filter(m => {
        const roleMatch = filterRole === 'All' || m.role === filterRole;
        const statusMatch = filterStatus === 'All' || m.status === filterStatus;
        return roleMatch && statusMatch;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manpower Directory</h1>
                    <p className="text-gray-500 font-medium">Verify documents and manage workforce across all projects</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    <button onClick={() => setFilterRole('All')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filterRole === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>ALL</button>
                    <button onClick={() => setFilterRole('Supervisor')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filterRole === 'Supervisor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>SUPERVISORS</button>
                    <button onClick={() => setFilterRole('Labour')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filterRole === 'Labour' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>LABOURS</button>
                </div>
            </div>

            {/* Admin Controls */}
            <div className="flex flex-wrap gap-4 mb-8">
                {['All', 'Pending', 'Approved', 'Rejected', 'Inactive'].map(st => (
                    <button
                        key={st}
                        onClick={() => setFilterStatus(st)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${filterStatus === st ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'
                            }`}
                    >
                        {st}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bio / KYC</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Site Assignment</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Aadhaar (Last 4)</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredData.map((m) => (
                                <tr key={m.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${m.role === 'Supervisor' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-tight">{m.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{m.role} • {m.mobile}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{m.projectName}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Ref: {m.addedBy}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-gray-500">
                                            <i className="fas fa-id-card text-[10px] opacity-40"></i>
                                            {formatAadhaar(m.aadhaarNumber)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${m.status === 'Approved' ? 'bg-green-50 border-green-100 text-green-700' :
                                            m.status === 'Rejected' ? 'bg-red-50 border-red-100 text-red-700' :
                                                m.status === 'Inactive' ? 'bg-gray-100 border-gray-200 text-gray-500' :
                                                    'bg-yellow-50 border-yellow-100 text-yellow-700'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {m.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleAction(m.id, 'Approved')} className="p-2 bg-green-600 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-green-100" title="Approve Entry"><i className="fas fa-check"></i></button>
                                                    <button onClick={() => handleAction(m.id, 'Rejected')} className="p-2 bg-red-600 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-red-100" title="Reject"><i className="fas fa-times"></i></button>
                                                </>
                                            )}
                                            {m.status === 'Approved' && (
                                                <button onClick={() => handleDeactivate(m.id)} className="p-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all" title="Deactivate"><i className="fas fa-user-slash"></i></button>
                                            )}
                                            {currentUser.role === 'superadmin' && (
                                                <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Delete Permanent"><i className="fas fa-trash-alt"></i></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-3xl">
                                                <i className="fas fa-users-slash"></i>
                                            </div>
                                            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No manpower records match these filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal */}
            {rejectionModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setRejectionModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm relative z-10 animate-in zoom-in-95 overflow-hidden">
                        <div className="bg-red-600 p-8 text-white">
                            <h2 className="text-2xl font-black tracking-tight">Reject Registration</h2>
                            <p className="text-red-100 text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">Feedback for Engineer</p>
                        </div>
                        <form onSubmit={handleRejectSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Rejection Reason *</label>
                                <textarea name="reason" required rows="4" placeholder="Explain why this entry is invalid (e.g. Blurry Aadhaar, Incorrect wage)..." className="w-full border-2 border-gray-100 rounded-3xl px-5 py-4 text-sm focus:border-red-500 outline-none transition-colors bg-gray-50/50 resize-none font-medium"></textarea>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setRejectionModal(false)} className="grow py-4 rounded-2xl font-black text-xs text-gray-400 uppercase tracking-widest">Cancel</button>
                                <button type="submit" className="grow py-4 bg-red-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest">Reject Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManpower;
