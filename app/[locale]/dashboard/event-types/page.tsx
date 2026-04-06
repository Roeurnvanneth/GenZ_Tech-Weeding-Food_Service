"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, Search, Edit2, Trash2, Layers, 
  X, Loader2, Save, RefreshCw, AlertCircle 
} from "lucide-react";

// --- ១. កំណត់ Interface ឱ្យត្រូវតាម Prisma Studio របស់ប្អូន ---
interface EventType {
  id: number;
  name: string; // អាពាហ៍ពិពាហ៍ (Wedding) ឬ ជប់លៀង (Party)
  _count?: {
    cateringItems: number;
  };
}

export default function EventTypeDashboard() {
  // States
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form State សម្រាប់បង្កើតថ្មី
  const [formData, setFormData] = useState({
    id: null as number | null,
    name: "",
  });

  // --- ២. ទាញទិន្នន័យពី Backend (GET) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // ហៅទៅកាន់ API Route របស់ Event Type
      const res = await fetch("/api/event-type", { cache: 'no-store' });
      const result = await res.json();
      
      console.log("🔍 EventTypes Data:", result);

      if (result.success && Array.isArray(result.data)) {
        setEventTypes(result.data);
      } else if (Array.isArray(result)) {
        setEventTypes(result);
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

  // --- ៣. បង្កើតប្រភេទកម្មវិធីថ្មី (POST) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("សូមបញ្ចូលឈ្មោះ!");

    setSubmitting(true);
    try {
      const res = await fetch("/api/event-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      const resData = await res.json();
      if (resData.success) {
        setIsModalOpen(false);
        setFormData({ id: null, name: "" });
        fetchData(); // ទាញទិន្នន័យថ្មីភ្លាមៗ
      } else {
        alert(resData.error || "ឈ្មោះនេះមានរួចហើយ");
      }
    } catch (error) {
      alert("មានបញ្ហាក្នុងការតភ្ជាប់");
    } finally {
      setSubmitting(false);
    }
  };

  // --- ៤. Helpers ---
  const filteredTypes = eventTypes.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-6 font-sans">
      
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-600/20 text-white">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Event <span className="text-indigo-600">Types</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              គ្រប់គ្រងប្រភេទកម្មវិធីក្នុង Database
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl flex items-center gap-2"
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
              placeholder="ស្វែងរកប្រភេទកម្មវិធី..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-6 py-2 bg-indigo-50 rounded-xl text-[10px] font-black text-indigo-600 uppercase">
            សរុប: {filteredTypes.length} ប្រភេទ
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-24">ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ឈ្មោះប្រភេទកម្មវិធី</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ចំនួនមុខម្ហូបក្នុងប្រភេទនេះ</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-4 text-indigo-600" size={40} />
                    <p className="font-black text-[10px] uppercase tracking-widest">កំពុងផ្ទុកទិន្នន័យ...</p>
                  </td>
                </tr>
              ) : filteredTypes.length > 0 ? (
                filteredTypes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-slate-300">#{item.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-xs font-black text-indigo-600">
                          {item._count?.cateringItems || 0}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Items</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button className="p-3 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-3 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={56} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">រកមិនឃើញទិន្នន័យក្នុង DATABASE</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal Form --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Add <span className="text-indigo-600">Event Type</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-2xl text-slate-400 shadow-sm"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Type Name</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 transition-all font-bold" 
                  placeholder="ឧទាហរណ៍៖ អាពាហ៍ពិពាហ៍ (Wedding)" 
                />
              </div>
              <button 
                disabled={submitting} 
                type="submit" 
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex justify-center items-center gap-3 shadow-xl shadow-indigo-600/20"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} រក្សាទុក
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}