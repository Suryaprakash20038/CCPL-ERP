import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendanceLogs, deleteAttendanceLog } from '../utils/attendanceStore';

const AdminAttendanceRecords = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterProject, setFilterProject] = useState('All');
    const [searchEngineer, setSearchEngineer] = useState('');

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{"role": "admin"}');

    useEffect(() => {
        setLogs(getAttendanceLogs());
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('PERMANENTLY DELETE this entire attendance group? This action is irreversible.')) {
            deleteAttendanceLog(id);
            setLogs(getAttendanceLogs());
        }
    };

    const filteredLogs = logs.filter(log => {
        const dateMatch = !filterDate || log.date === filterDate;
        const projectMatch = filterProject === 'All' || log.projectName === filterProject;
        const engineerMatch = log.siteEngineerName.toLowerCase().includes(searchEngineer.toLowerCase());
        return dateMatch && projectMatch && engineerMatch;
    });

    const projects = ['All', ...new Set(logs.map(l => l.projectName))];

    return (
        <div className="p-8 max-w-full font-sans bg-slate-50 min-h-screen animate-in slide-in-from-bottom-5 duration-700">
            {/* Page Header & Stats Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Project Attendance Records</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Review and audit daily site attendance submissions by engineers</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white px-6 py-4 border border-slate-200 shadow-sm rounded-sm text-center min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Submissions</p>
                        <p className="text-xl font-bold text-slate-800">{logs.length}</p>
                    </div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm mb-10 flex flex-wrap items-end gap-6">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-0.5">Filter Date</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-sm text-sm font-semibold outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col min-w-[200px]">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-0.5">Project Selection</label>
                    <select
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                        className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-sm text-sm font-semibold outline-none appearance-none"
                    >
                        {projects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="flex flex-col flex-1 min-w-[250px]">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-0.5">Search Engineer</label>
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                        <input
                            type="text"
                            placeholder="Enter Site Engineer Name..."
                            value={searchEngineer}
                            onChange={(e) => setSearchEngineer(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-sm text-sm font-semibold outline-none focus:border-blue-500 placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <button
                    onClick={() => { setFilterDate(''); setFilterProject('All'); setSearchEngineer(''); }}
                    className="px-6 py-2 border border-slate-200 text-slate-400 text-[10px] font-bold uppercase hover:bg-slate-50 transition-colors rounded-sm"
                >
                    Reset
                </button>
            </div>

            {/* Records List */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400">
                            <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest uppercase">Date</th>
                            <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest uppercase">Project Details</th>
                            <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest uppercase">Site Engineer</th>
                            <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest uppercase text-center">Summary (P / A / H)</th>
                            <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLogs.map(log => (
                            <tr
                                key={log.attendanceId}
                                className="group hover:bg-blue-50/20 cursor-pointer transition-colors"
                                onClick={() => navigate(`/admin/attendance/${log.attendanceId}`)}
                            >
                                <td className="px-8 py-6 font-bold text-slate-800">
                                    {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-bold text-blue-600 uppercase text-[11px] tracking-widest m-0">{log.projectName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1">Ref CID: {log.projectId}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                                            {log.siteEngineerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-tight m-0">{log.siteEngineerName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Logged on {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded font-bold text-xs border border-emerald-100 min-w-[32px] text-center">{log.summary.present}</span>
                                        <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded font-bold text-xs border border-rose-100 min-w-[32px] text-center">{log.summary.absent}</span>
                                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded font-bold text-xs border border-amber-100 min-w-[32px] text-center">{log.summary.halfDay}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="text-xs font-bold text-blue-600 uppercase hover:underline"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/attendance/${log.attendanceId}`); }}
                                        >
                                            View Full details
                                        </button>
                                        {currentUser.role === 'superadmin' && (
                                            <button
                                                onClick={(e) => handleDelete(e, log.attendanceId)}
                                                className="w-8 h-8 flex items-center justify-center rounded-sm bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all transform active:scale-95"
                                            >
                                                <i className="fas fa-trash-alt text-xs"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="p-24 text-center">
                        <i className="fas fa-clipboard-list text-slate-100 text-5xl mb-4"></i>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No Attendance Submissions Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAttendanceRecords;
