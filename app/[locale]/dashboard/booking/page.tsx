"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, CheckCircle, XCircle, Trash2, 
  Loader2, Calendar, Users, MapPin, 
  Phone, Banknote, Table, AlertCircle, Clock, Filter
} from "lucide-react";

export default function ProfessionalBookingDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // --- ១. មុខងារទាញទិន្នន័យ (Fetch Real API) ---
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", { cache: 'no-store' });
      if (!res.ok) throw new Error("មិនអាចទាញទិន្នន័យបានឡើយ");
      const json = await res.json();
      const list = json.data || [];
      setBookings(list);
      setFiltered(list);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // --- ២. មុខងារ Filter (Search & Status) ---
  useEffect(() => {
    let result = bookings.filter((b) => {
      const searchStr = `${b.customerName} ${b.phoneNumber} ${b.location}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    });

    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  // --- ៣. មុខងារ Update Status ---
  const updateStatus = async (id: number, newStatus: string) => {
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

  // --- ៤. មុខងារលុប (Delete) ---
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
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen font-khmer animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">បញ្ជីកក់កម្មវិធី (Booking List)</h1>
          <div className="h-1.5 w-16 bg-[#B48C00] rounded-full mt-3"></div>
          <p className="text-slate-500 mt-4 font-bold uppercase text-[10px] tracking-[0.2em]">Management & Quality Control</p>
        </div>
        <div className="flex gap-4">
          <StatCard label="សរុប" value={bookings.length} color="blue" />
          <StatCard label="រង់ចាំ" value={bookings.filter(b => b.status === "Pending").length} color="amber" />
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#B48C00] transition-colors" size={22} />
          <input 
            placeholder="ស្វែងរកតាមឈ្មោះ លេខទូរស័ព្ទ ឬទីតាំង..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[1.8rem] text-lg font-bold outline-none focus:border-[#B48C00] focus:ring-4 focus:ring-[#B48C00]/5 shadow-sm transition-all"
          />
        </div>
        <div className="flex p-2 bg-white rounded-[1.5rem] border border-slate-200 shadow-sm">
          {["All", "Pending", "Accepted", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${
                statusFilter === s ? "bg-[#B48C00] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {s === "All" ? "ទាំងអស់" : s}
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-40 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#B48C00]" size={50} />
            <p className="text-slate-400 font-black">កំពុងទាញយកទិន្នន័យ...</p>
          </div>
        ) : error ? (
          <div className="p-40 text-center text-rose-500">
             <AlertCircle className="mx-auto mb-4" size={50} />
             <p className="font-black">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">អតិថិជន</th>
                  <th className="px-10 py-6">ព័ត៌មានកម្មវិធី</th>
                  <th className="px-10 py-6 text-center">តុ / តម្លៃ</th>
                  <th className="px-10 py-6 text-center">ស្ថានភាព</th>
                  <th className="px-10 py-6 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#B48C00]/10 flex items-center justify-center text-[#B48C00] font-black text-xl">
                          {b.customerName?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-lg group-hover:text-[#B48C00] transition-colors">{b.customerName}</div>
                          <div className="text-sm text-slate-400 font-bold flex items-center gap-1"><Phone size={12}/> {b.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-slate-700 font-black mb-1"><Calendar size={16} className="text-[#B48C00]"/> {b.programDate}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold"><MapPin size={14}/> {b.location}</div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="font-black text-slate-800 flex items-center justify-center gap-1"><Users size={16} className="text-[#B48C00]"/> {Math.ceil(b.guestCount/10)} តុ</div>
                      <div className="text-xl font-black text-emerald-600 tracking-tighter mt-1">${Number(b.totalPrice).toLocaleString()}</div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        {b.status === "Pending" && (
                          <>
                            <button onClick={() => updateStatus(b.id, "Accepted")} className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"><CheckCircle size={20}/></button>
                            <button onClick={() => updateStatus(b.id, "Rejected")} className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"><XCircle size={20}/></button>
                          </>
                        )}
                        <button onClick={() => deleteBooking(b.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- UI COMPONENTS ---
function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100"
  };
  return (
    <div className={`px-8 py-4 rounded-3xl border text-center min-w-[120px] ${colors[color]}`}>
      <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
      <span className="text-3xl font-black">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    "Accepted": { bg: "bg-emerald-50", text: "text-emerald-600", icon: <CheckCircle size={12}/>, kh: "យល់ព្រម" },
    "Rejected": { bg: "bg-rose-50", text: "text-rose-600", icon: <XCircle size={12}/>, kh: "បដិសេធ" },
    "Pending": { bg: "bg-amber-50", text: "text-amber-600", icon: <Clock size={12}/>, kh: "រង់ចាំ" }
  };
  const s = config[status] || config.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase border border-current/10 ${s.bg} ${s.text} shadow-sm`}>
      {s.icon} {s.kh}
    </span>
  );
}