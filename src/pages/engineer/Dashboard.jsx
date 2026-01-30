import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Users, ClipboardList, AlertTriangle, Package,
    MapPin, Cloud, Sun, CheckCircle, Clock, PlusCircle, FileText
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';

const EngineerDashboard = () => {
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Mock Data
    const taskData = [
        { day: 'Mon', completed: 12, pending: 4 },
        { day: 'Tue', completed: 18, pending: 2 },
        { day: 'Wed', completed: 15, pending: 5 },
        { day: 'Thu', completed: 10, pending: 8 },
        { day: 'Fri', completed: 20, pending: 1 },
        { day: 'Sat', completed: 8, pending: 3 },
    ];

    const upcomingTasks = [
        { time: '10:00 AM', title: 'Site Inspection w/ Architect', loc: 'Block A', status: 'pending' },
        { time: '02:00 PM', title: 'Concrete Pouring Supervision', loc: 'Block C', status: 'pending' },
        { time: '04:30 PM', title: 'Daily Labour Report Submission', loc: 'Office', status: 'done' },
    ];

    const quickActions = [
        { label: "Submit Attendance", icon: Users, color: "bg-blue-600", path: "/engineer/attendance-log" },
        { label: "Add Daily Progress", icon: FileText, color: "bg-green-600", path: "/engineer/updates" },
        { label: "Raise Issue", icon: AlertTriangle, color: "bg-red-600", path: "/engineer/tickets" },
        { label: "Request Material", icon: Package, color: "bg-yellow-500", path: "/engineer/stock" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">

            {/* Hero / Welcome Section */}
            <div className="bg-gradient-to-r from-blue-700 to-navy-900 rounded-2xl p-6 md:p-8 text-white shadow-soft relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-white/20">
                                <MapPin size={12} /> Skyline Complex - Phase 2
                            </span>
                            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-green-400/30">
                                On Schedule
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">Hello, Engineer 👋</h1>
                        <p className="text-blue-100 opacity-90">{today}</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                        <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-300">
                            <Sun size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-none">28°C</p>
                            <p className="text-xs text-blue-100">Sunny • Low Humidity</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-navy-900/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Workers Present" value="42" icon={Users} color="blue" trend="up" trendValue="100%" />
                <StatCard title="Tasks Assigned" value="12" icon={ClipboardList} color="navy" trend="down" trendValue="2" />
                <StatCard title="Issues Reported" value="3" icon={AlertTriangle} color="red" trend="up" trendValue="1" />
                <StatCard title="Material Requests" value="2" icon={Package} color="yellow" trend="up" trendValue="2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Weekly Progress Chart */}
                <ChartCard title="Weekly Task Completion" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={taskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="completed" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} name="Completed" />
                            <Bar dataKey="pending" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={40} name="Pending" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Today's Schedule Timeline */}
                <div className="bg-white rounded-xl shadow-card border border-slate-100 flex flex-col h-full">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Today's Schedule</h3>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">3 Pending</span>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="space-y-0 relative border-l-2 border-slate-100 ml-3">
                            {upcomingTasks.map((task, idx) => (
                                <div key={idx} className="relative pl-8 pb-8 last:pb-0 group">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white transition-all
                                        ${task.status === 'done' ? 'border-green-500 bg-green-500' : 'border-blue-500 group-hover:scale-125'}
                                    `}></div>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-bold text-blue-600">{task.time}</p>
                                        {task.status === 'done' && <CheckCircle size={14} className="text-green-500" />}
                                    </div>
                                    <h4 className={`text-sm font-semibold ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                        {task.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <MapPin size={10} /> {task.loc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                        <button className="text-sm text-blue-600 font-medium hover:underline">View Full Calendar</button>
                    </div>
                </div>
            </div>

            {/* Quick Action Grid */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className="bg-white p-4 rounded-xl shadow-card hover:shadow-lg hover:-translate-y-1 transition-all group text-left border border-slate-100"
                        >
                            <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                                <action.icon size={20} />
                            </div>
                            <span className="block font-semibold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default EngineerDashboard;
