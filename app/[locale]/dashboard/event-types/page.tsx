"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, Search, Edit2, Trash2, Layers, 
  X, Loader2, Save, RefreshCw, AlertCircle 
} from "lucide-react";

interface EventType {
  id: number;
  name: string;
  _count?: {
    cateringItems: number;
  };
}

export default function EventTypeDashboard() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form State សម្រាប់ទាំង បង្កើត និង កែប្រែ
  const [formData, setFormData] = useState({
    id: null as number | null,
    name: "",
  });

  // --- ១. ទាញទិន្នន័យ (អាន) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/event-types", { cache: 'no-store' });
      const result = await res.json();
      if (result.success) {
        setEventTypes(result.data);
      }
    } catch (error) {
      console.error("❌ កំហុសក្នុងការទាញទិន្នន័យ:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ២. រក្សាទុកទិន្នន័យ (បង្កើតថ្មី & កែប្រែ) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("សូមបញ្ចូលឈ្មោះប្រភេទកម្មវិធី!");

    setSubmitting(true);
    try {
      const isUpdate = formData.id !== null;
      const url = isUpdate ? `/api/event-types/${formData.id}` : "/api/event-types";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      const resData = await res.json();
      if (resData.success) {
        setIsModalOpen(false);
        resetForm();
        fetchData();
      } else {
        alert(resData.error || "មានបញ្ហាបច្ចេកទេស!");
      }
    } catch (error) {
      alert("មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ប្រព័ន្ធ");
    } finally {
      setSubmitting(false);
    }
  };

  // --- ៣. លុបទិន្នន័យ (លុប) ---
  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបប្រភេទកម្មវិធីនេះមែនទេ? រាល់ទិន្នន័យពាក់ព័ន្ធនឹងត្រូវលុបទាំងអស់ចេញពីប្រព័ន្ធ!")) return;

    try {
      const res = await fetch(`/api/event-types/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchData();
      } else {
        alert("កំហុស៖ " + data.error);
      }
    } catch (error) {
      console.error("❌ កំហុសក្នុងការលុប:", error);
      alert("មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ (Server) ដើម្បីលុបទិន្នន័យ!");
    }
  };

  // --- ៤. ជំនួយការ ---
  const openEditModal = (item: EventType) => {
    setFormData({ id: item.id, name: item.name });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: "" });
  };

  const filteredTypes = eventTypes.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-6 font-khmer text-slate-900">
      
      {/* ផ្នែកក្បាល (Header) */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#B48C00] rounded-3xl shadow-lg shadow-yellow-500/20 text-white">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              ប្រភេទ <span className=" text-[#B48C00]">កម្មវិធី</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 italic">
              គ្រប់គ្រងប្រភេទកម្មវិធី អាពាហ៍ពិពាហ៍ និង ជប់លៀង
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all active:scale-95" title="ទាញទិន្នន័យថ្មី">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-[#B48C00] text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl flex items-center gap-2 active:scale-95"
          >
            <Plus size={20} /> បង្កើតថ្មី
          </button>
        </div>
      </div>

      {/* ផ្នែកតារាង (Table) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ស្វែងរកតាមឈ្មោះ..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-[#B48C00] transition-all font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-100 rounded-xl">
            សរុបទិន្នន័យ: {filteredTypes.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-24">លេខកូដ</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">ឈ្មោះប្រភេទកម្មវិធី (ភាសាខ្មែរ/អង់គ្លេស)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-32 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-4 text-[#B48C00]" size={40} />
                    <p className="font-black text-[10px] uppercase tracking-widest text-[#B48C00]">កំពុងផ្ទុកទិន្នន័យពី Database...</p>
                  </td>
                </tr>
              ) : filteredTypes.length > 0 ? (
                filteredTypes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-slate-300">#{item.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-800 text-lg group-hover:text-[#B48C00] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                        ចំនួនសេវាកម្មម្ហូប (Catering): {item._count?.cateringItems || 0}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-[#B48C00] hover:border-yellow-100 rounded-xl shadow-sm transition-all active:scale-90"
                          title="កែប្រែ"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-xl shadow-sm transition-all active:scale-90"
                          title="លុប"
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
                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={56} />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">រកមិនឃើញទិន្នន័យដែលអ្នកស្វែងរកឡើយ</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ផ្ទាំងបញ្ចូលទិន្នន័យ (Modal Form) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 italic">
                {formData.id ? "កែប្រែ" : "បន្ថែម"} <span className="text-[#B48C00]">ប្រភេទកម្មវិធី</span>
              </h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="p-3 hover:bg-white rounded-2xl text-slate-400 shadow-sm border border-transparent hover:border-slate-100 transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">ឈ្មោះប្រភេទកម្មវិធី (ឈ្មោះបង្ហាញ)</label>
                <input 
                  required 
                  autoFocus
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#B48C00] focus:bg-white transition-all font-bold text-slate-700 shadow-inner" 
                  placeholder="ឧទាហរណ៍៖ កម្មវិធីអាពាហ៍ពិពាហ៍" 
                />
              </div>
              <button 
                disabled={submitting} 
                type="submit" 
                className="w-full py-5 bg-[#B48C00] text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex justify-center items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                {formData.id ? "រក្សាទុកការកែប្រែ" : "រក្សាទុកទិន្នន័យថ្មី"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}