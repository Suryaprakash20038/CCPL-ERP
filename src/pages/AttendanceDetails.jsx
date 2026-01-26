import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttendanceLogs, getEntriesForLog } from '../utils/attendanceStore';
import { formatAadhaar } from '../utils/manpowerStore';

const AttendanceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [log, setLog] = useState(null);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const allLogs = getAttendanceLogs();
        const foundLog = allLogs.find(l => l.attendanceId === id);

        if (foundLog) {
            setLog(foundLog);
            setEntries(getEntriesForLog(id));
        }
    }, [id]);

    if (!log) return (
        <div className="p-20 text-center animate-pulse">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-slate-500 font-bold uppercase tracking-widest">Loading Report Details...</p>
        </div>
    );

    const supervisors = entries.filter(e => e.role === 'Supervisor');
    const labours = entries.filter(e => e.role === 'Labour');

    const DetailsTable = ({ data, title, color }) => (
        <div className="bg-white border border-slate-200 rounded-sm mb-10 overflow-hidden shadow-sm">
            <div className={`bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center gap-2`}>
                <div className={`w-1.5 h-4 bg-${color}-600 rounded-full`}></div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest m-0">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white text-slate-400 border-b border-slate-100">
                            <th className="px-8 py-3 font-semibold text-[10px] uppercase tracking-wider">Worker Name</th>
                            {title.includes('Labour') && <th className="px-8 py-3 font-semibold text-[10px] uppercase tracking-wider">Skill</th>}
                            <th className="px-8 py-3 font-semibold text-[10px] uppercase tracking-wider">Aadhaar (ID)</th>
                            <th className="px-8 py-3 font-semibold text-[10px] uppercase tracking-wider text-center">Status</th>
                            <th className="px-8 py-3 font-semibold text-[10px] uppercase tracking-wider">Timing</th>
                            <th className="px-8 py-3 font-semibold text-[10px] uppercase tracking-wider">Site Engineer Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map(e => (
                            <tr key={e.personId} className="hover:bg-slate-50/50">
                                <td className="px-8 py-4 font-bold text-slate-900">{e.name}</td>
                                {title.includes('Labour') && <td className="px-8 py-4 text-slate-500 font-medium">{e.skillType}</td>}
                                <td className="px-8 py-4 font-mono text-xs text-slate-300">{formatAadhaar(e.aadhaarNumber)}</td>
                                <td className="px-8 py-4 text-center">
                                    <span className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${e.status === 'Present' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                            e.status === 'Absent' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                                                'bg-amber-50 border-amber-100 text-amber-700'
                                        }`}>
                                        {e.status}
                                    </span>
                                </td>
                                <td className="px-8 py-4 font-semibold text-slate-600">
                                    {e.status === 'Absent' ? '-- : --' : `${e.inTime} to ${e.outTime}`}
                                </td>
                                <td className="px-8 py-4 text-slate-500 italic max-w-xs truncate">
                                    {e.remarks || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-full font-sans bg-slate-50 min-h-screen animate-in fade-in duration-500 pb-20">
            {/* Header / Breadcrumb */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/attendance-records')}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <i className="fas fa-arrow-left text-slate-400 text-xs"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Attendance Detailed Report</h1>
                    <p className="text-slate-500 text-sm font-medium">Batch ID: {log.attendanceId} | Generated on {new Date(log.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Overview Card */}
            <div className="bg-white border border-slate-200 rounded-sm p-8 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Report Context</p>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Project Name</p>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{log.projectName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Attendance Date</p>
                            <p className="text-base font-bold text-slate-800">{new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Submission Meta</p>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Site Engineer</p>
                            <p className="text-base font-bold text-slate-800">{log.siteEngineerName}</p>
                            <p className="text-[10px] text-slate-400 font-bold">ID: {log.siteEngineerId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Submission Time</p>
                            <p className="text-sm font-bold text-slate-600">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Workforce Summary</p>
                    <div className="flex gap-4 pt-2">
                        <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 rounded-sm">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase">Present</p>
                            <p className="text-2xl font-bold text-emerald-700">{log.summary.present}</p>
                        </div>
                        <div className="flex-1 bg-rose-50 border border-rose-100 p-4 rounded-sm">
                            <p className="text-[9px] font-bold text-rose-600 uppercase">Absent</p>
                            <p className="text-2xl font-bold text-rose-700">{log.summary.absent}</p>
                        </div>
                        <div className="flex-1 bg-amber-50 border border-amber-100 p-4 rounded-sm">
                            <p className="text-[9px] font-bold text-amber-600 uppercase">Half Day</p>
                            <p className="text-2xl font-bold text-amber-700">{log.summary.halfDay}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual Lists */}
            <DetailsTable data={supervisors} title="Supervisors attendance Log" color="blue" />
            <DetailsTable data={labours} title="Labours attendance Log" color="slate" />
        </div>
    );
};

export default AttendanceDetails;
