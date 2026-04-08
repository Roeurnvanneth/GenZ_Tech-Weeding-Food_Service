"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, Search, Edit2, Trash2, ShieldCheck, 
  X, Loader2, Save, RefreshCw, AlertCircle 
} from "lucide-react";

interface CateringStandard {
  id: number;
  name: string;
}

export default function CateringStandardDashboard() {
  const [standards, setStandards] = useState<CateringStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: null as number | null,
    name: "",
  });

  // --- ១. ទាញទិន្នន័យ (GET ALL) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/catering-standard", { cache: 'no-store' });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const result = await res.json();
      if (result.success) {
        setStandards(result.data);
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

  // --- ២. បង្កើត និង កែប្រែ (POST & PATCH) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("សូមបញ្ចូលឈ្មោះស្តង់ដារ!");

    setSubmitting(true);
    try {
      const isUpdate = formData.id !== null;
      const url = isUpdate ? `/api/catering-standard/${formData.id}` : "/api/catering-standard";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      const resData = await res.json();
      if (resData.success) {
        setIsModalOpen(false);
        setFormData({ id: null, name: "" });
        fetchData();
      } else {
        alert(resData.error || "មានបញ្ហាបច្ចេកទេស!");
      }
    } catch (error) {
      alert("ការតភ្ជាប់មានបញ្ហា!");
    } finally {
      setSubmitting(false);
    }
  };

  // --- ៣. លុបទិន្នន័យ (DELETE) ---
  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបស្តង់ដារនេះមែនទេ?")) return;

    try {
      const res = await fetch(`/api/catering-standard/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("មិនអាចលុបបានទេ!");
    }
  };

  const filtered = standards.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-6 font-khmer">
      
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#B48C00] rounded-3xl shadow-lg shadow-amber-500/20 text-white transition-transform hover:rotate-6">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              ស្តង់ដារ <span className="text-[#B48C00]">សេវាកម្ម</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 italic">
              ការគ្រប់គ្រងគុណភាព និងកម្រិតសេវាកម្ម
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData} 
            className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all active:scale-90"
            title="ទាញទិន្នន័យថ្មី"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => { setFormData({id: null, name: ""}); setIsModalOpen(true); }}
            className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-black hover:bg-amber-600 transition-all shadow-xl flex items-center gap-2 active:scale-95"
          >
            <Plus size={20} /> បង្កើតថ្មី
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ស្វែងរកឈ្មោះស្តង់ដារ..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs font-black text-amber-600 bg-amber-50 px-5 py-2 rounded-xl uppercase border border-amber-100">
            សរុប: {filtered.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-24">លេខកូដ</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">ឈ្មោះស្តង់ដារ (Standard Name)</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-32 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-amber-600" size={40} />
                    <p className="font-black text-[10px] uppercase text-slate-400 tracking-widest">កំពុងទាញទិន្នន័យ...</p>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors group">
                    <td className="px-10 py-6 text-center font-black text-slate-300 italic">#{item.id}</td>
                    <td className="px-10 py-6 font-bold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">{item.name}</td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setFormData({id: item.id, name: item.name}); setIsModalOpen(true); }} 
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-amber-600 hover:border-amber-100 rounded-xl shadow-sm transition-all active:scale-90"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-xl shadow-sm transition-all active:scale-90"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-32 text-center">
                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={60} />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">មិនមានទិន្នន័យក្នុងប្រព័ន្ធឡើយ</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase text-slate-900 italic">
                  {formData.id ? "កែប្រែ" : "បន្ថែម"} <span className="text-amber-600">ស្តង់ដារ</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">សូមបញ្ចូលព័ត៌មានឱ្យបានត្រឹមត្រូវ</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 hover:bg-white rounded-2xl text-slate-400 shadow-sm border border-transparent hover:border-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">ឈ្មោះស្តង់ដារសេវាកម្ម</label>
                <input 
                  required 
                  autoFocus
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-slate-700 shadow-inner" 
                  placeholder="ឧទាហរណ៍៖ ស្តង់ដារមាស (Gold)" 
                />
              </div>
              <button 
                disabled={submitting} 
                type="submit" 
                className="w-full py-5 bg-[#020617] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-amber-600 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                {formData.id ? "រក្សាទុកការកែប្រែ" : "បង្កើតស្តង់ដារថ្មី"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}