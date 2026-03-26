"use client";

import { Utensils, CalendarCheck, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  // Mock data for your Wedding Service
  const stats = [
    { title: "Total Bookings", value: "24", icon: <CalendarCheck className="text-blue-600" />, bg: "bg-blue-50" },
    { title: "Active Menus", value: "8", icon: <Utensils className="text-orange-600" />, bg: "bg-orange-50" },
    { title: "Total Customers", value: "152", icon: <Users className="text-green-600" />, bg: "bg-green-50" },
    { title: "Revenue (MTD)", value: "$12,450", icon: <TrendingUp className="text-purple-600" />, bg: "bg-purple-50" },
  ];

  const recentBookings = [
    { id: "BK-001", customer: "Sok Rathana", date: "April 12, 2026", tables: 50, status: "Confirmed" },
    { id: "BK-002", customer: "Keo Pisey", date: "May 05, 2026", tables: 80, status: "Pending" },
    { id: "BK-003", customer: "Chan Tola", date: "June 20, 2026", tables: 35, status: "Confirmed" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Catering Overview</h1>
        <p className="text-slate-500">Welcome back, Chef! Here is what's happening with your wedding services.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Recent Wedding Bookings</h2>
          <button className="text-sm font-bold text-[#B48C00] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Event Date</th>
                <th className="px-6 py-4">Tables</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{booking.id}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.customer}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.date}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.tables} Tables</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {booking.status}
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