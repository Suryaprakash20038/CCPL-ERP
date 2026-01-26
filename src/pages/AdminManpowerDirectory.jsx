import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getManpowerStore } from '../utils/manpowerStore';

/**
 * AdminManpowerDirectory
 * A project-wise summary of manpower counts.
 * Design matched to the high-end CCPL Admin UI.
 */
const AdminManpowerDirectory = () => {
    const [summaries, setSummaries] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        loadSummaries();
    }, []);

    const loadSummaries = () => {
        const manpower = getManpowerStore();

        // Group by Project
        const projectGroups = manpower.reduce((acc, curr) => {
            const pid = curr.projectId || 'UNKNOWN';
            if (!acc[pid]) {
                acc[pid] = {
                    projectId: pid,
                    projectName: curr.projectName || 'Unnamed Project',
                    projectRefId: pid,
                    siteEngineerName: curr.addedBy || 'Not Assigned',
                    supervisorsCount: 0,
                    laboursCount: 0,
                    lastUpdatedAt: curr.createdAt,
                    status: 'ACTIVE' // Default for summary
                };
            }

            if (curr.role === 'Supervisor') acc[pid].supervisorsCount++;
            if (curr.role === 'Labour') acc[pid].laboursCount++;

            if (new Date(curr.createdAt) > new Date(acc[pid].lastUpdatedAt)) {
                acc[pid].lastUpdatedAt = curr.createdAt;
                acc[pid].siteEngineerName = curr.addedBy;
            }

            return acc;
        }, {});

        setSummaries(Object.values(projectGroups));
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto bg-[#f8f9fa] min-h-screen font-sans animate-in fade-in duration-500">
            {/* Upper Navigation / Filters (Matched to Image) */}
            <div className="flex gap-4 mb-12 ml-4">
                {['ALL', 'ACTIVE', 'COMPLETED', 'ON HOLD'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-8 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all duration-300 ${activeFilter === tab
                                ? 'bg-[#1a1c23] text-white shadow-xl shadow-gray-200'
                                : 'bg-white text-gray-400 hover:text-gray-600 shadow-sm border border-gray-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Container (Matched to Image's large rounded white card) */}
            <div className="bg-white rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-300">
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Project Identity</th>
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Site Assignment</th>
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">Supervisors</th>
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">Labour Count</th>
                                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {summaries.map((proj) => (
                                <tr key={proj.projectId} className="group hover:bg-gray-50/40 transition-all duration-300">
                                    {/* BIO/KYC Style for Project Name */}
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg font-black shadow-sm group-hover:scale-105 transition-transform">
                                                {proj.projectName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-base leading-tight">{proj.projectName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1 opacity-70">
                                                    REF-ID • {proj.projectRefId}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SITE ASSIGNMENT Style for Engineer */}
                                    <td className="px-10 py-10">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-[#4451fe] text-xs uppercase tracking-wider">{proj.siteEngineerName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 opacity-60">REF: Site Execution Head</p>
                                        </div>
                                    </td>

                                    {/* AADHAAR Card Style for Supervisor count */}
                                    <td className="px-10 py-10 text-center">
                                        <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100/50">
                                            <i className="fas fa-user-tie text-[10px] text-gray-300"></i>
                                            <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                                COUNT: {proj.supervisorsCount}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ENTRY STATUS Style for Labour count */}
                                    <td className="px-10 py-10 text-center">
                                        <span className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${proj.laboursCount > 0
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {proj.laboursCount} LABOURS
                                        </span>
                                    </td>

                                    {/* ACTIONS Style */}
                                    <td className="px-10 py-10 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                <i className="fas fa-external-link-alt text-[10px]"></i>
                                            </button>
                                            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                <i className="fas fa-file-download text-[10px]"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {summaries.length === 0 && (
                        <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-20">
                            <i className="fas fa-folder-open text-6xl text-gray-400"></i>
                            <p className="text-sm font-black uppercase tracking-[0.5em]">No Project Data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Branding */}
            <div className="py-16 flex justify-between items-center px-10 opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-400">CCPL Infrastructure Dynamics v2.4</p>
                <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminManpowerDirectory;
