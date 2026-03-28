"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, CheckCircle, XCircle, Clock, Trash2, 
  Loader2, Calendar, User, Users, MapPin, 
  Phone, MessageSquare, Tag, Banknote, Coffee,
  Table
} from "lucide-react";

export default function ProfessionalBookingDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/booking");
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data || [];
      setBookings(list);
      setFiltered(list);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    let result = bookings.filter((b) =>
      `${b.customerName} ${b.phoneNumber} ${b.location}`.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  const updateStatus = async (id: number, newStatus: "Accepted" | "Rejected") => {
    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបការកក់នេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/booking/${id}`, { method: "DELETE" });
      if (res.ok) fetchBookings();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen font-khmer">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">បញ្ជីការកក់កម្មវិធី</h1>
          <p className="text-slate-500 text-lg font-medium">គ្រប់គ្រងរាល់ការកក់ និងស្ថានភាពកម្មវិធីរបស់អតិថិជន</p>
        </div>
        <div className="flex gap-6">
          <div className="px-8 py-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
            <span className="block text-sm font-black text-blue-400 uppercase tracking-widest mb-1">សរុប</span>
            <span className="text-3xl font-black text-blue-700">{bookings.length}</span>
          </div>
          <div className="px-8 py-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
            <span className="block text-sm font-black text-amber-600 uppercase tracking-widest mb-1">រង់ចាំ</span>
            <span className="text-3xl font-black text-amber-700">{bookings.filter(b => b.status === "Pending").length}</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            placeholder="ស្វែងរកតាមឈ្មោះ លេខទូរស័ព្ទ ឬទីតាំង..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-lg font-bold outline-none focus:border-[#B48C00] transition-all shadow-sm"
          />
        </div>
        <div className="flex p-2 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
          {["All", "Pending", "Accepted", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${
                statusFilter === s ? "bg-[#B48C00] text-white shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {s === "All" ? "ទាំងអស់" : s}
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-40 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#B48C00]" size={60} />
              <p className="text-slate-400 font-black text-xl">កំពុងទាញយកទិន្នន័យ...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-8">ព័ត៌មានអតិថិជន</th>
                  <th className="px-8 py-8">កាលបរិច្ឆេទ & ទីតាំង</th>
                  <th className="px-8 py-8">ចំនួនតុ & តម្លៃសរុប</th>
                  <th className="px-8 py-8">ស្ថានភាព</th>
                  <th className="px-8 py-8 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-all">
                    {/* CUSTOMER INFO */}
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <User size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-xl leading-tight mb-1">{b.customerName}</div>
                          <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
                            <Phone size={16} /> {b.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* DATE & LOCATION */}
                    <td className="px-8 py-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-slate-900 font-black text-lg">
                          <Calendar size={20} className="text-[#B48C00]" /> {b.programDate}
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 font-bold text-base">
                          <MapPin size={20} className="text-slate-400" /> {b.location}
                        </div>
                      </div>
                    </td>

                    {/* TABLES & PRICE */}
                    {/* Table Calculation: Based on guestCount */}
                <td className="px-10 py-10">
                  <div className="flex items-center gap-3 text-slate-900 font-black text-xl mb-1">
                    <Users size={22} className="text-blue-500" /> {b.guestCount || 0} នាក់
                  </div>
                  <div className="flex items-center gap-3 text-[#B48C00] font-bold text-lg">
                    <Table size={20} /> {Math.ceil((b.guestCount || 0) / 10)} តុ
                    <div className="flex items-center gap-3 text-emerald-700 font-black text-xl">
                          <Banknote size={24} /> ${b.totalPrice?.toLocaleString()} តម្លៃសរុប
                        </div>
                  </div>
                </td>
                    

                    {/* STATUS */}
                    <td className="px-8 py-8">
                      <span className={`px-6 py-2 rounded-full text-xs font-black uppercase border-2 tracking-widest shadow-sm
                        ${b.status === "Accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                          b.status === "Rejected" ? "bg-rose-50 text-rose-600 border-rose-100" : 
                          "bg-amber-50 text-amber-600 border-amber-100"}`}>
                        {b.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-8 py-8 text-right">
                      <div className="flex justify-end gap-3">
                        {b.status === "Pending" && (
                          <>
                            <button onClick={() => updateStatus(b.id, "Accepted")} className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-sm">
                              <CheckCircle size={24} />
                            </button>
                            <button onClick={() => updateStatus(b.id, "Rejected")} className="p-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm">
                              <XCircle size={24} />
                            </button>
                          </>
                        )}
                        <button onClick={() => deleteBooking(b.id)} className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}