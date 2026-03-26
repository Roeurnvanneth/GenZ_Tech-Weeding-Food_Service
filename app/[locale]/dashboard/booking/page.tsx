"use client";
import { useState } from "react";
import { Check, X, Eye } from "lucide-react";

export default function BookingsPage() {
  // Mock data representing a Wedding Food Request
  const [bookings, setBookings] = useState([
    { id: "WED-9921", name: "Sok Rathana", date: "2026-06-15", tables: 50, package: "Premium Khmer", status: "Pending" },
    { id: "WED-9922", name: "Keo Pisey", date: "2026-07-20", tables: 100, package: "Royal Chinese", status: "Pending" },
  ]);

  const handleAction = (id: string, newStatus: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    alert(`Booking ${id} has been ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Manage Bookings</h1>
          <p className="text-slate-500 text-sm">Review and confirm upcoming wedding food services.</p>
        </div>
        <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm font-bold border border-yellow-100">
          Total Pending: {bookings.filter(b => b.status === "Pending").length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Host Name</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Wedding Date</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Tables</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{booking.name}</p>
                  <p className="text-xs text-slate-400">{booking.package} Set</p>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{booking.date}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">{booking.tables} Tables</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    booking.status === "Pending" ? "bg-blue-100 text-blue-600" : 
                    booking.status === "Confirmed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {booking.status === "Pending" && (
                      <>
                        <button 
                          onClick={() => handleAction(booking.id, "Confirmed")}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="Confirm Wedding"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction(booking.id, "Rejected")}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}