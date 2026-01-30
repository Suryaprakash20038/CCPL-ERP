import { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import {
    Users, Building2, ShoppingCart, AlertTriangle,
    TrendingUp, Download, Plus, Search, Filter, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import DashboardTable from '../components/dashboard/DashboardTable';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Mock Data
    const attendanceData = [
        { name: 'Mon', present: 145, absent: 12 },
        { name: 'Tue', present: 150, absent: 8 },
        { name: 'Wed', present: 142, absent: 15 },
        { name: 'Thu', present: 148, absent: 9 },
        { name: 'Fri', present: 155, absent: 2 },
        { name: 'Sat', present: 130, absent: 25 },
        { name: 'Sun', present: 45, absent: 110 },
    ];

    const vendorSplitData = [
        { name: 'Cement', value: 45, color: '#2563EB' },
        { name: 'Steel', value: 25, color: '#0F172A' },
        { name: 'Bricks', value: 15, color: '#64748b' },
        { name: 'Other', value: 15, color: '#F59E0B' },
    ];

    const purchases = [
        { id: 'PO-2024-001', vendor: 'UltraTech Cement', amount: '₹1,24,000', status: 'Approved', date: 'Today, 10:30 AM' },
        { id: 'PO-2024-002', vendor: 'Tata Steel', amount: '₹3,50,000', status: 'Pending', date: 'Yesterday' },
        { id: 'PO-2024-003', vendor: 'Local Bricks Co', amount: '₹45,000', status: 'Rejected', date: '23 Jan 2026' },
        { id: 'PO-2024-004', vendor: 'Asian Paints', amount: '₹28,500', status: 'Approved', date: '22 Jan 2026' },
    ];

    const updates = [
        { id: 1, site: 'Skyline Towers', engineer: 'Rajesh Kumar', message: 'Foundation work completed ahead of schedule.', type: 'progress' },
        { id: 2, site: 'Metro Phase 2', engineer: 'Amit Singh', message: 'Urgent requirement for 500 bags of cement.', type: 'material' },
        { id: 3, site: 'Green Valley', engineer: 'Suresh P', message: 'Labor strike resolved, work resumed.', type: 'issue' },
    ];

    const purchaseColumns = [
        { header: 'PO ID', accessor: 'id' },
        { header: 'Vendor', accessor: 'vendor' },
        { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-semibold text-slate-800">{row.amount}</span> },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
            {/* Header / Banner Section */}
            <div className="relative w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-2xl p-8 mb-8 shadow-lg overflow-hidden text-white">
                {/* Background Shapes for visual interest */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Building2 size={16} className="text-blue-200" />
                            <span className="text-xs font-bold tracking-wider uppercase text-blue-100 bg-white/10 px-2 py-0.5 rounded">CCPL Construction</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Hello, Admin 👋</h1>
                        <p className="text-blue-100 font-medium max-w-lg">
                            Here's what's happening across your sites today. You have 5 pending issues to resolve.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:bg-white/15 transition-colors">
                            <div className="text-right">
                                <p className="text-2xl font-bold leading-none">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-blue-100 font-medium">
                                    {currentTime.toLocaleDateString(undefined, { weekday: 'long' })}
                                </p>
                            </div>
                            <div className="h-8 w-[1px] bg-blue-400/50"></div>
                            <div>
                                <Calendar size={24} className="text-blue-200 mb-1 mx-auto" />
                                <span className="text-xs font-bold text-white block">
                                    {currentTime.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        </div>
                        <div className="hidden lg:block bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="text-yellow-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">28°C</p>
                                    <p className="text-[10px] text-blue-100">Sunny</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar (moved out of header) */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
                <h2 className="text-lg font-bold text-slate-800">Overview</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all text-sm font-semibold">
                        <Calendar size={16} /> Select Period
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all text-sm font-semibold">
                        <Plus size={16} /> New Purchase
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Sites"
                    value="12"
                    icon={Building2}
                    color="blue"
                    trend="up"
                    trendValue="2"
                />
                <StatCard
                    title="Today Attendance"
                    value="485"
                    icon={Users}
                    color="green"
                    trend="up"
                    trendValue="96%"
                />
                <StatCard
                    title="Material Requests"
                    value="8"
                    icon={ShoppingCart}
                    color="yellow"
                    trend="down"
                    trendValue="3"
                />
                <StatCard
                    title="Pending Issues"
                    value="5"
                    icon={AlertTriangle}
                    color="red"
                    trend="up"
                    trendValue="1"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ChartCard title="Daily Attendance Trend" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="present" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" name="Present" />
                            <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} dot={false} name="Absent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Vendor Purchase Split">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={vendorSplitData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {vendorSplitData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                            <div className="text-center">
                                <span className="text-3xl font-bold text-slate-800">100%</span>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total</p>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DashboardTable
                    title="Recent Purchases"
                    columns={purchaseColumns}
                    data={purchases}
                    actions={
                        <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">View All</button>
                    }
                />

                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.12)] transition-shadow duration-300">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Site Updates</h3>
                        <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">View All</button>
                    </div>
                    <div className="divide-y divide-slate-50 overflow-y-auto max-h-[400px]">
                        {updates.map((update) => (
                            <div key={update.id} className="p-4 hover:bg-slate-50/80 transition-colors flex gap-4 items-start group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${update.type === 'progress' ? 'bg-blue-50 text-blue-600' :
                                    update.type === 'material' ? 'bg-amber-50 text-amber-600' :
                                        'bg-red-50 text-red-600'
                                    }`}>
                                    {update.type === 'progress' ? <TrendingUp size={20} /> :
                                        update.type === 'material' ? <ShoppingCart size={20} /> :
                                            <AlertTriangle size={20} />}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium leading-snug">{update.message}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-xs font-semibold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">{update.site}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-500">{update.engineer}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
