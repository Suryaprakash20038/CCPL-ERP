import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getManpowerStore } from '../utils/manpowerStore';

/**
 * ManpowerSummary
 * Project-wise summary of manpower counts (Supervisors & Labours).
 * Restricted to Admin and Super Admin roles.
 */
const ManpowerSummary = () => {
    const [summaries, setSummaries] = useState([]);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    // Access Control
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
                    siteEngineerName: curr.addedBy || 'System',
                    supervisorsCount: 0,
                    laboursCount: 0
                };
            }

            if (curr.role === 'Supervisor') acc[pid].supervisorsCount++;
            if (curr.role === 'Labour') acc[pid].laboursCount++;

            return acc;
        }, {});

        setSummaries(Object.values(projectGroups));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen font-sans animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manpower Summary</h1>
                <p className="text-slate-500 text-sm mt-1">Project-wise workforce headcount at a glance</p>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Project Name</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Site Engineer</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Supervisors Count</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Labours Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {summaries.map((proj) => (
                                <tr key={proj.projectId} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-semibold text-slate-800 text-base">{proj.projectName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">ID: {proj.projectId}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-medium text-slate-700">{proj.siteEngineerName}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                            {proj.supervisorsCount}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                            {proj.laboursCount}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {summaries.length === 0 && (
                        <div className="py-20 text-center">
                            <i className="fas fa-users-slash text-slate-200 text-5xl mb-4"></i>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">No project data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Minimal Footer Summary */}
            <div className="mt-8 flex justify-end gap-10 px-4">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Projects</p>
                    <p className="text-xl font-bold text-slate-800">{summaries.length}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Active Workforce</p>
                    <p className="text-xl font-bold text-blue-600">
                        {summaries.reduce((acc, curr) => acc + curr.supervisorsCount + curr.laboursCount, 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManpowerSummary;
