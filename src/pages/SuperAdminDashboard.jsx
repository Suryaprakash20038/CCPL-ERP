import { useState, useEffect } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, CartesianGrid, XAxis, YAxis
} from 'recharts';
import {
    Briefcase, ShoppingBag, CreditCard, DollarSign,
    TrendingUp, Users, Activity, FileText, Calendar
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import DashboardTable from '../components/dashboard/DashboardTable';

const SuperAdminDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Mock Data
    const financialData = [
        { name: 'Jan', revenue: 4000, expense: 2400 },
        { name: 'Feb', revenue: 3000, expense: 1398 },
        { name: 'Mar', revenue: 5000, expense: 2800 },
        { name: 'Apr', revenue: 4780, expense: 3908 },
        { name: 'May', revenue: 5890, expense: 4800 },
        { name: 'Jun', revenue: 6390, expense: 3800 },
    ];

    const projectStatusData = [
        { name: 'On Track', value: 12, color: '#22C55E' },
        { name: 'Delayed', value: 3, color: '#F59E0B' },
        { name: 'Critical', value: 1, color: '#EF4444' },
        { name: 'Completed', value: 8, color: '#2563EB' },
    ];

    const highValuePurchases = [
        { id: 'PO-9001', item: 'Heavy Machinery (Excavator)', vendor: 'CAT Machines', amount: '₹45,00,000', manager: 'John Doe' },
        { id: 'PO-9002', item: 'Steel Reinforcement (50 Tons)', vendor: 'Tata Steel', amount: '₹22,50,000', manager: 'Jane Smith' },
        { id: 'PO-9003', item: 'HVAC Systems', vendor: 'BlueStar Corp', amount: '₹12,00,000', manager: 'Mike Ross' },
    ];

    const adminActivities = [
        { id: 1, action: 'Approved Project Budget', user: 'Super Admin', time: '10 mins ago' },
        { id: 2, action: 'Added New Vendor', user: 'Admin User', time: '1 hour ago' },
        { id: 3, action: 'System Backup Completed', user: 'System', time: '3 hours ago' },
        { id: 4, action: 'Changed User Permissions', user: 'Super Admin', time: 'Yesterday' },
    ];

    const purchaseColumns = [
        { header: 'PO ID', accessor: 'id' },
        { header: 'Item', accessor: 'item' },
        { header: 'Vendor', accessor: 'vendor' },
        { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-bold text-slate-800">{row.amount}</span> },
        { header: 'Manager', accessor: 'manager' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10 p-6">

            {/* Header / Banner Section */}
            <div className="relative w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 rounded-2xl p-8 mb-8 shadow-lg overflow-hidden text-white">
                {/* Background Shapes for visual interest */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex items-center gap-1.5 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                <span className="text-xs font-bold tracking-wide uppercase text-purple-200">Super Admin</span>
                            </div>
                            <span className="text-xs font-bold tracking-wider uppercase text-slate-300">CCPL Construction Group</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Executive Dashboard</h1>
                        <p className="text-slate-300 font-medium max-w-lg">
                            Welcome back. Overview of all corporate metrics and automated reporting.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:bg-white/10 transition-colors">
                            <div className="text-right">
                                <p className="text-2xl font-bold leading-none font-mono tracking-tight text-white">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-slate-300 font-medium">
                                    {currentTime.toLocaleDateString(undefined, { weekday: 'long' })}
                                </p>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-600"></div>
                            <div className="text-center min-w-[30px]">
                                <span className="text-xs font-bold text-purple-300 uppercase block">
                                    {currentTime.toLocaleDateString(undefined, { month: 'short' })}
                                </span>
                                <span className="text-xl font-bold text-white block leading-none">
                                    {currentTime.toLocaleDateString(undefined, { day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
                <h2 className="text-lg font-bold text-slate-800">Financial Overview</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm transition-all text-sm font-medium">
                        <FileText size={16} /> Reports
                    </button>
                    <button className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-navy-800 shadow-md transition-all text-sm font-medium">
                        <Users size={16} /> Manage Users
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Projects"
                    value="24"
                    icon={Briefcase}
                    color="blue"
                    trend="up"
                    trendValue="4 New"
                />
                <StatCard
                    title="Total Vendors"
                    value="156"
                    icon={ShoppingBag}
                    color="purple"
                    trend="up"
                    trendValue="12 Added"
                />
                <StatCard
                    title="Total Purchase Value"
                    value="₹12.5 Cr"
                    icon={CreditCard}
                    color="yellow"
                    trend="up"
                    trendValue="8% vs last month"
                />
                <StatCard
                    title="Total Revenue"
                    value="₹45.2 Cr"
                    icon={DollarSign}
                    color="green"
                    trend="up"
                    trendValue="15% YTD"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ChartCard title="Revenue vs Expenses" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                            <Bar dataKey="revenue" fill="#2563EB" name="Revenue" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            <Bar dataKey="expense" fill="#EF4444" name="Expenses" radius={[6, 6, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Project Distribution">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                            <div className="text-center">
                                <span className="text-4xl font-bold text-slate-800 tracking-tighter">24</span>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Total</p>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DashboardTable
                    title="High Value Purchases (> ₹10L)"
                    columns={purchaseColumns}
                    data={highValuePurchases}
                    actions={<button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">View All POs</button>}
                />

                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.12)] transition-shadow duration-300">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Admin Activities</h3>
                        <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">Audit Log</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {adminActivities.map((activity) => (
                            <div key={activity.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600">
                                    <Activity size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 leading-snug">{activity.action}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">by <span className="font-semibold text-slate-700">{activity.user}</span></p>
                                </div>
                                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SuperAdminDashboard;
