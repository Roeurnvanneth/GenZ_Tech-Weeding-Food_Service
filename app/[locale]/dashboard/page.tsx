"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  CalendarCheck, Users, TrendingUp, Loader2, 
  Clock, Package, CheckCircle2, XCircle, 
  LayoutDashboard, Filter, MapPin
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export default function ProfessionalDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("all");

  // ១. ទាញយកទិន្នន័យពី API (កែសម្រួលឱ្យត្រូវជាមួយ Backend ប្អូន)
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // ប្រើ /api/booking ឱ្យត្រូវជាមួយ Postman របស់ប្អូន
      const res = await fetch("/api/booking", { cache: 'no-store' }); 
      const json = await res.json();
      
      console.log("ទិន្នន័យទទួលបាន:", json); // សម្រាប់ឆែកមើលក្នុង Console

      if (json.success) {
        // បើ Backend បោះមកជា Object តែមួយ យើងបំប្លែងវាទៅជា Array ដើម្បីបង្ហាញក្នុងតារាង
        const dataReceived = Array.isArray(json.data) ? json.data : [json.data];
        setBookings(dataReceived);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  // ២. Logic ចម្រាញ់ទិន្នន័យតាមខែ
  const filteredData = useMemo(() => {
    if (filterMonth === "all") return bookings;
    return bookings.filter(b => {
      const date = new Date(b.programDate);
      return (date.getMonth() + 1).toString() === filterMonth;
    });
  }, [bookings, filterMonth]);

  // ៣. គណនាស្ថិតិសរុប (ផ្អែកលើទិន្នន័យពិតពី Backend)
  const stats = useMemo(() => {
    return {
      total: filteredData.length,
      pending: filteredData.filter(b => b.status === "Pending" || !b.status).length,
      revenue: filteredData.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0),
      guestSum: filteredData.reduce((sum, b) => sum + (Number(b.guestCount) || 0), 0)
    };
  }, [filteredData]);

  // ៤. ទិន្នន័យសម្រាប់ Pie Chart
  const pieData = [
    { name: 'យល់ព្រម', value: filteredData.filter(b => b.status === "Accepted").length || 0, color: '#10b981' },
    { name: 'រង់ចាំ', value: stats.pending, color: '#f59e0b' },
    { name: 'បដិសេធ', value: filteredData.filter(b => b.status === "Rejected").length || 0, color: '#ef4444' },
  ];

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 font-khmer text-indigo-600">
      <Loader2 className="animate-spin mb-2" size={40} />
      <p className="font-bold">កំពុងទាញទិន្នន័យពី Backend...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 lg:p-10 font-khmer">
      
      {/* --- Header & Filter --- */}
      <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="text-indigo-600" size={32} /> ផ្ទាំងគ្រប់គ្រងអាជីវកម្ម
          </h1>
          <p className="mt-1 text-slate-500 font-medium tracking-tight">ទិន្នន័យពិតពីប្រព័ន្ធគ្រប់គ្រងការកក់</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl shadow-sm border border-slate-200">
           <Filter size={18} className="text-slate-400" />
           <select 
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
              className="outline-none text-sm font-bold bg-transparent text-slate-700 cursor-pointer"
           >
              <option value="all">បង្ហាញខែទាំងអស់</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>ខែ 0{i + 1}</option>
              ))}
           </select>
           <button onClick={fetchDashboardData} className="ml-2 p-1 hover:bg-slate-100 rounded-full transition-colors">
              <Loader2 size={16} className="text-indigo-600" />
           </button>
        </div>
      </div>

      {/* --- Section 1: Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="ចំណូលសរុប" value={`$${stats.revenue.toLocaleString()}`} color="bg-emerald-500" icon={<TrendingUp/>}/>
        <StatCard label="រង់ចាំពិនិត្យ" value={stats.pending} color="bg-amber-500" icon={<Clock/>}/>
        <StatCard label="ភ្ញៀវសរុប" value={stats.guestSum.toLocaleString()} color="bg-indigo-500" icon={<Users/>}/>
        <StatCard label="ការកក់សរុប" value={stats.total} color="bg-slate-800" icon={<Package/>}/>
      </div>

      {/* --- Section 2: Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6 italic">និន្នាការចំណូល ($)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="programDate" tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Line type="monotone" dataKey="totalPrice" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-lg font-black text-slate-800 mb-6 text-center">ស្ថានភាពការកក់</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900">{stats.total}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">សរុប</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 3: Recent Bookings Table --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800">បញ្ជីកក់ចុងក្រោយ (Live)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-5">អតិថិជន</th>
                <th className="px-10 py-5 text-center">កាលបរិច្ឆេទ & ទីតាំង</th>
                <th className="px-10 py-5 text-center">ចំនួនតុ</th>
                <th className="px-10 py-5 text-center">តម្លៃសរុប</th>
                <th className="px-10 py-5 text-right">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((b, index) => (
                <tr key={index} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="px-10 py-6">
                    <div className="font-bold text-slate-900">{b.customerName}</div>
                    <div className="text-xs text-slate-400 font-medium">{b.phoneNumber}</div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="text-sm font-bold text-slate-700">{b.programDate}</div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 uppercase font-bold"><MapPin size={10}/> {b.location}</div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="text-lg font-black text-slate-800">{Math.ceil((b.guestCount || 0) / 10)} តុ</div>
                  </td>
                  <td className="px-10 py-6 text-center font-black text-emerald-600 text-lg">
                    ${Number(b.totalPrice).toLocaleString()}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${
                      b.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {b.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && <div className="p-20 text-center text-slate-400 font-bold italic">មិនទាន់មានទិន្នន័យ...</div>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-indigo-100`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
}