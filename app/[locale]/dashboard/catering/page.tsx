"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { 
  Plus, Search, Edit2, Trash2, Utensils, 
  X, Loader2, Save, RefreshCw, AlertCircle 
} from "lucide-react";

// --- កំណត់ Interface ឱ្យត្រូវតាម Database ប្អូន ---
interface Catering {
  id: number;
  catering_name: string;      // ឈ្មោះជាខ្មែរ (ឧទាហរណ៍៖ ឈុតអាពាហ៍ពិពាហ៍កម្រិតមាស)
  name: string;               // ឈ្មោះជាអង់គ្លេស (ឧទាហរណ៍៖ Wedding Luxury Set A)
  event_name: string;         // Wedding / Party
  total_price: number | string;
  description: string;
  catering_standard_id: number;
  eventTypeId: number;
  menuId: any;                // ប្រភេទ JSON
}

export default function CateringDashboard() {
  const { locale } = useParams();
  
  // States
  const [caterings, setCaterings] = useState<Catering[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null as number | null,
    catering_name: "",
    name: "",
    event_name: "",
    description: "",
    total_price: 0,
    catering_standard_id: 1,
    eventTypeId: 1,
    menuIds: [] as number[],
  });

  // --- ១. ទាញទិន្នន័យពី API (ប្រើ /api/catering តាម folder ប្អូន) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // ហៅទៅកាន់ path ត្រឹមត្រូវតាម structure
      const res = await fetch("/api/catering", { cache: 'no-store' });
      const result = await res.json();
      
      console.log("🔍 API Result:", result);

      if (result.success && Array.isArray(result.data)) {
        setCaterings(result.data);
      } else if (Array.isArray(result)) {
        setCaterings(result);
      } else if (result.data && Array.isArray(result.data)) {
        setCaterings(result.data);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ២. ការលុបទិន្នន័យ ---
  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/catering/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (resData.success) {
        fetchData(); 
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- ៣. Helpers ---
  const resetForm = () => {
    setFormData({
      id: null,
      catering_name: "",
      name: "",
      event_name: "",
      description: "",
      total_price: 0,
      catering_standard_id: 1,
      eventTypeId: 1,
      menuIds: [],
    });
  };

  const filteredCaterings = caterings.filter(c => 
    c.catering_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-6 font-sans">
      
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-yellow-500 rounded-3xl shadow-lg shadow-yellow-500/20 text-[#0F172A]">
            <Utensils size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Catering <span className="text-yellow-500">Dashboard</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              Connected to Prisma API
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-yellow-500 text-[#0F172A] px-8 py-4 rounded-2xl font-black hover:bg-yellow-600 transition-all shadow-xl flex items-center gap-2 active:scale-95"
          >
            <Plus size={20} /> បង្កើតថ្មី
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ស្វែងរកតាមឈ្មោះកញ្ចប់..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-yellow-500 transition-all font-bold text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase shadow-sm">
            សរុប: {filteredCaterings.length} កញ្ចប់
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ព័ត៌មានកញ្ចប់</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ប្រភេទកម្មវិធី</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Standard ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-4 text-yellow-500" size={40} />
                    <p className="font-black text-[10px] uppercase tracking-widest">កំពុងទាញទិន្នន័យពិតពី Database...</p>
                  </td>
                </tr>
              ) : filteredCaterings.length > 0 ? (
                filteredCaterings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-slate-300">#{item.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 group-hover:text-yellow-600 transition-colors">
                        {item.catering_name || "គ្មានឈ្មោះ"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold mt-1">
                        {item.name || "No English Name"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-xl border border-yellow-200 uppercase tracking-wider italic shadow-sm">
                        {item.event_name}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600 text-xs mx-auto border border-slate-200">
                        {item.catering_standard_id}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button className="p-3 hover:bg-yellow-50 text-slate-400 hover:text-yellow-600 rounded-xl transition-all border border-transparent hover:border-yellow-100 shadow-sm hover:shadow-md">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-3 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={56} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">មិនមានទិន្នន័យក្នុង DATABASE ឡើយ</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}