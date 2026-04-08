"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, Search, Edit2, Trash2, Utensils, 
  X, Loader2, Save, RefreshCw, AlertCircle, DollarSign, Info, CheckCircle2
} from "lucide-react";

interface Catering {
  id: number;
  catering_name: string;
  name: string;
  event_name: string;
  total_price: number;
  description: string;
  catering_standard_id: number;
  eventTypeId: number;
  menuId: number[]; 
}

export default function CateringDashboard() {
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

  // --- ១. ទាញទិន្នន័យ (READ) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/caterings", { cache: 'no-store' });
      const result = await res.json();
      if (result.success) {
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

  // --- ២. រក្សាទុកទិន្នន័យ (CREATE & UPDATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isUpdate = formData.id !== null;
      const url = isUpdate ? `/api/caterings/${formData.id}` : "/api/caterings";
      const method = isUpdate ? "PATCH" : "POST";

      const payload = {
        ...formData,
        total_price: Number(formData.total_price),
        catering_standard_id: Number(formData.catering_standard_id),
        eventTypeId: Number(formData.eventTypeId),
        oldEventTypeId: formData.eventTypeId 
      };

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        setIsModalOpen(false);
        resetForm();
        fetchData();
      } else {
        alert("មានបញ្ហា: " + resData.error);
      }
    } catch (error) {
      alert("មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ប្រព័ន្ធ");
    } finally {
      setSubmitting(false);
    }
  };

  // --- ៣. លុបទិន្នន័យ (DELETE) ---
  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបកញ្ចប់សេវាកម្មនេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/caterings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      alert("លុបមិនបានសម្រេច! ប្រហែលជាទិន្នន័យកំពុងត្រូវបានប្រើប្រាស់។");
    }
  };

  // --- ៤. Helpers ---
  const openEditModal = (item: Catering) => {
    setFormData({
      id: item.id,
      catering_name: item.catering_name || "",
      name: item.name || "",
      event_name: item.event_name || "",
      description: item.description || "",
      total_price: Number(item.total_price),
      catering_standard_id: item.catering_standard_id,
      eventTypeId: item.eventTypeId,
      menuIds: Array.isArray(item.menuId) ? item.menuId : [],
    });
    setIsModalOpen(true);
  };

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
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-khmer text-slate-900">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-amber-500 rounded-3xl text-[#0F172A] shadow-xl shadow-amber-500/20 transition-transform hover:rotate-6">
            <Utensils size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">
              សេវាកម្ម <span className="text-amber-600">ម្ហូបអាហារ</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">គ្រប់គ្រងកញ្ចប់ម្ហូបអាហារសម្រាប់កម្មវិធី</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData} 
            className="p-4 bg-white text-slate-400 rounded-2xl border border-slate-200 hover:text-amber-600 hover:border-amber-100 shadow-sm transition-all active:scale-90"
            title="ទាញទិន្នន័យថ្មី"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }} 
            className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold hover:bg-amber-600 shadow-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={20} /> បង្កើតកញ្ចប់ថ្មី
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
              placeholder="ស្វែងរកកញ្ចប់សេវាកម្ម..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-50 transition-all font-medium text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-black uppercase border border-amber-100">
            សរុប: {filteredCaterings.length} កញ្ចប់
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-24">លេខកូដ</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ព័ត៌មានកញ្ចប់សេវាកម្ម</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">តម្លៃសរុប</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ប្រភេទកម្មវិធី</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <Loader2 className="animate-spin mx-auto text-amber-500 mb-2" size={40} />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">កំពុងទាញទិន្នន័យ...</p>
                  </td>
                </tr>
              ) : filteredCaterings.length > 0 ? (
                filteredCaterings.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors group">
                    <td className="px-8 py-6 text-center font-black text-slate-300">#{item.id}</td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">{item.catering_name}</div>
                      <div className="text-[11px] text-slate-400 font-medium italic mt-0.5">{item.name}</div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl font-black text-emerald-600">
                        ${Number(item.total_price).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 italic text-sm text-slate-500 font-medium">{item.event_name}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(item)} 
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-amber-600 hover:border-amber-100 hover:shadow-sm rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-sm rounded-xl transition-all"
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
                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={60} />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">មិនមានទិន្នន័យត្រូវបានរកឃើញឡើយ</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl my-auto animate-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight">
                  {formData.id ? "កែប្រែ" : "បន្ថែម"} <span className="text-amber-600">កញ្ចប់សេវាកម្ម</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">សូមបំពេញព័ត៌មានខាងក្រោមឱ្យបានត្រឹមត្រូវ</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 text-slate-400 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ឈ្មោះកញ្ចប់សេវាកម្ម (ភាសាខ្មែរ)</label>
                  <input required value={formData.catering_name} onChange={e => setFormData({...formData, catering_name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-bold shadow-inner" placeholder="ឧ៖ កញ្ចប់មាស" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ឈ្មោះជាភាសាអង់គ្លេស (English Name)</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-bold shadow-inner" placeholder="ឧ៖ Gold Package" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ឈ្មោះកម្មវិធី (ឧ៖ អាពាហ៍ពិពាហ៍)</label>
                  <input required value={formData.event_name} onChange={e => setFormData({...formData, event_name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-bold shadow-inner" placeholder="ឧ៖ អាពាហ៍ពិពាហ៍ (Wedding)" />
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">តម្លៃសរុប (គិតជាដុល្លារ $)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <input type="number" required value={formData.total_price} onChange={e => setFormData({...formData, total_price: Number(e.target.value)})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-black text-emerald-600 shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">លេខកូដបញ្ជីមុខម្ហូប (ឧ៖ 1, 2, 3)</label>
                  <input 
                    placeholder="ឧ៖ 1, 5, 10" 
                    value={formData.menuIds.join(",")} 
                    onChange={e => setFormData({...formData, menuIds: e.target.value.split(",").map(id => Number(id.trim()))})} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-bold shadow-inner" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ស្តង់ដារ ID</label>
                    <input type="number" value={formData.catering_standard_id} onChange={e => setFormData({...formData, catering_standard_id: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ប្រភេទកម្មវិធី ID</label>
                    <input type="number" value={formData.eventTypeId} onChange={e => setFormData({...formData, eventTypeId: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-bold" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ការពិពណ៌នាបន្ថែម</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-bold shadow-inner" placeholder="ព័ត៌មានលម្អិតអំពីកញ្ចប់ម្ហូបអាហារ..." />
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={submitting} 
                  type="submit" 
                  className="w-full py-5 bg-[#020617] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-amber-600 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                  {formData.id ? "រក្សាទុកការកែប្រែ" : "បង្កើតកញ្ចប់សេវាកម្មឥឡូវនេះ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}