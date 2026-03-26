"use client";
import { User } from "lucide-react";

export default function CustomersPage() {
  const customers = [
    { name: "Sok Rathana", phone: "+855 12 345 678", email: "sok@mail.com", bookings: 1 },
    { name: "Keo Pisey", phone: "+855 99 777 888", email: "pisey@mail.com", bookings: 2 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wedding Clients</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Total Bookings</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 flex items-center gap-3 font-bold text-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={16}/></div>
                  {c.name}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{c.phone}</p>
                  <p className="text-xs text-slate-400">{c.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{c.bookings} Events</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-[#B48C00] font-bold text-sm">View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}