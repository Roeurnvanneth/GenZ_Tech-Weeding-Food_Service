"use client";

import React, { useState, useEffect } from "react";
import { 
  CalendarCheck, Users, TrendingUp, 
  Loader2, Clock, MapPin 
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, Tooltip,
  CartesianGrid
} from 'recharts';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/booking");
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data || [];
      setBookings(list);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  // --- Logic Calculations ---
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === "Pending").length;
  const acceptedCount = bookings.filter(b => b.status === "Accepted").length;
  const rejectedCount = bookings.filter(b => b.status === "Rejected").length;
  
  const totalRevenue = bookings
    .filter(b => b.status === "Accepted")
    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

  // បូកសរុបចំនួនភ្ញៀវទាំងអស់ (មិនមែនចំនួន User ទេ)
  const totalGuestsSum = bookings.reduce((sum, b) => sum + (Number(b.guestCount) || 0), 0);

  const pieData = [
    { name: 'Accepted', value: acceptedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
  ];

  const stats = [
    { title: "ការកក់សរុប", value: totalBookings, Icon: CalendarCheck, bg: "bg-blue-100", text: "text-blue-700" },
    { title: "រង់ចាំពិនិត្យ", value: pendingCount, Icon: Clock, bg: "bg-amber-100", text: "text-amber-700" },
    { title: "ភ្ញៀវសរុប", value: totalGuestsSum, Icon: Users, bg: "bg-emerald-100", text: "text-emerald-700" },
    { title: "ចំណូលសរុប", value: `$${totalRevenue.toLocaleString()}`, Icon: TrendingUp, bg: "bg-purple-100", text: "text-purple-700" },
  ];

  return (
    <div className="space-y-10 p-8 bg-slate-50 font-khmer min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">ទិដ្ឋភាពទូទៅ (Admin Overview)</h1>
          <p className="text-lg text-slate-500 font-medium mt-1">គ្រប់គ្រង និងតាមដានទិន្នន័យការកក់របស់អ្នក</p>
        </div>
        <button onClick={fetchDashboardData} className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95">
          <Loader2 className={`${isLoading ? "animate-spin" : ""} `} size={28} />
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-100">
          <h3 className="text-xl font-bold text-slate-700 mb-6">ស្ថានភាពការកក់</h3>
          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900">{totalBookings}</span>
              <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">សរុប</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-100 lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-700 mb-6">និន្នាការចំណូល</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookings.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="programDate" tick={{fontSize: 12, fontWeight: 600}} dy={10} />
                <Tooltip />
                <Line type="monotone" dataKey="totalPrice" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Cards - Large & Clear */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-100 flex items-center gap-6 transition-transform hover:-translate-y-1">
            <div className={`p-5 rounded-3xl ${stat.bg} ${stat.text}`}>
              <stat.Icon size={36} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">{stat.title}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section - Improved Readability */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-slate-800">បញ្ជីការកក់ចុងក្រោយ</h2>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">ទិន្នន័យបច្ចុប្បន្ន</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-[0.2em] border-b border-slate-200">
                <th className="px-10 py-6 text-center">អតិថិជន</th>
                <th className="px-10 py-6 text-center">កាលបរិច្ឆេទ</th>
                <th className="px-10 py-6 text-center">ចំនួននាក់ & តុ</th>
                <th className="px-10 py-6 text-center">តម្លៃសរុប</th>
                <th className="px-10 py-6 text-center">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 8).map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{b.customerName}</div>
                    <div className="text-sm text-slate-400 font-bold mt-1 tracking-wider">{b.phoneNumber}</div>
                  </td>
                  <td className="px-10 py-8 text-center font-bold text-slate-600">
                    <div className="flex items-center justify-center gap-2 bg-slate-100 py-2 px-4 rounded-xl text-base">
                      <CalendarCheck size={18} className="text-amber-500"/> {b.programDate}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="font-black text-slate-900 text-2xl leading-none">
                      {Math.ceil((b.guestCount || 0) / 10)} តុ
                    </div>
                    <div className="text-xs text-slate-400 font-black mt-2 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-md">
                      {b.guestCount || 0} នាក់
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="font-black text-emerald-600 text-2xl tracking-tighter">
                      ${Number(b.totalPrice).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`inline-block px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 shadow-sm ${
                      b.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                      b.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}