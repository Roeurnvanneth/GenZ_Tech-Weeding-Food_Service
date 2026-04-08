"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Pencil, Trash2, X, Tags, 
  Loader2, Check, AlertCircle, Link as LinkIcon, 
  LayoutGrid, Star, ChevronRight
} from "lucide-react";

interface Category {
  id: number;
  slug: string;
  isPoppular: boolean;
  translations: {
    kh: { name: string };
    en: { name: string };
  };
  _count?: {
    products: number; 
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameKh, setNameKh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [isPoppular, setIsPoppular] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
        setFiltered(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Search Logic
  useEffect(() => {
    const result = categories.filter((c) =>
      `${c.translations?.en?.name} ${c.translations?.kh?.name} ${c.slug}`.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, categories]);

  // Auto-generate Slug from Khmer Name
  useEffect(() => {
    if (!editingId && nameKh) {
      setSlug(nameKh.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\u1780-\u17FF\w-]+/g, ""));
    }
  }, [nameKh, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          slug, isPoppular, 
          translations: { kh: { name: nameKh }, en: { name: nameEn } } 
        }),
      });
      if ((await res.json()).success) {
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកចង់លុបប្រភេទនេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if ((await res.json()).success) fetchCategories();
    } catch (err) { console.error(err); }
  };

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditingId(cat.id);
      setNameKh(cat.translations.kh.name);
      setNameEn(cat.translations.en.name);
      setSlug(cat.slug);
      setIsPoppular(cat.isPoppular);
    } else {
      setEditingId(null);
      setNameKh(""); setNameEn(""); setSlug(""); setIsPoppular(false);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 font-khmer bg-[#F8FAFC] min-h-screen pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <LayoutGrid className="text-[#B48C00]" size={28} /> គ្រប់គ្រងប្រភេទមុខម្ហូប
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">រៀបចំ និងចាត់ថ្នាក់មុខម្ហូបសម្រាប់កម្មវិធីនីមួយៗ</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#B48C00] text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-[#967500] transition-all shadow-lg shadow-yellow-900/10 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> បង្កើតថ្មី
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-[#B48C00] transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="ស្វែងរកឈ្មោះប្រភេទ..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full outline-none focus:ring-4 focus:ring-[#B48C00]/5 focus:border-[#B48C00]/20 transition-all font-bold" 
                />
            </div>
            <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest">
                សរុប: {filtered.length} ជួរ
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-center w-20">ល.រ</th>
                <th className="px-8 py-5">ឈ្មោះប្រភេទ</th>
                <th className="px-8 py-5 text-center">ផលិតផល</th>
                <th className="px-8 py-5 text-center">ពេញនិយម</th>
                <th className="px-8 py-5 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-[#B48C00]" size={40} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 font-bold">រកមិនឃើញទិន្នន័យឡើយ</td></tr>
              ) : (
                filtered.map((cat, i) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-center font-black text-slate-300 group-hover:text-[#B48C00]">{(i + 1).toString().padStart(2, '0')}</td>
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#B48C00]/10 group-hover:text-[#B48C00] transition-all">
                                <Tags size={18} />
                            </div>
                            <div>
                                <p className="font-black text-slate-700 text-base">{cat.translations?.kh?.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">/{cat.slug}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-black border border-indigo-100">
                        {cat._count?.products || 0} មុខម្ហូប
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                        {cat.isPoppular ? (
                            <div className="flex items-center justify-center gap-1 text-orange-500 font-black text-xs">
                                <Star size={14} fill="currentColor" /> ពេញនិយម
                            </div>
                        ) : <span className="text-slate-300 text-xs font-bold">ធម្មតា</span>}
                    </td>
                    <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                            <button onClick={() => openModal(cat)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                                <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800">{editingId ? "កែប្រែប្រភេទ" : "បង្កើតប្រភេទថ្មី"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">ឈ្មោះប្រភេទ (ខ្មែរ)</label>
                  <input required value={nameKh} onChange={(e) => setNameKh(e.target.value)} placeholder="ឧ. ម្ហូបការតាមផ្ទះ" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-[#B48C00] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">English Name</label>
                  <input required value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Wedding Menu" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-[#B48C00] transition-all" />
                </div>
                
                <div 
                  onClick={() => setIsPoppular(!isPoppular)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${isPoppular ? 'border-orange-500/20 bg-orange-50/50' : 'border-slate-100 bg-slate-50/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isPoppular ? 'bg-orange-500 text-white' : 'bg-slate-200'}`}>
                        {isPoppular && <Check size={14} strokeWidth={4} />}
                    </div>
                    <span className={`font-black text-sm ${isPoppular ? 'text-orange-600' : 'text-slate-500'}`}>កំណត់ជាប្រភេទពេញនិយម</span>
                  </div>
                  <Star size={18} className={isPoppular ? 'text-orange-500' : 'text-slate-300'} fill={isPoppular ? "currentColor" : "none"} />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">តំណភ្ជាប់ (Slug)</label>
                  <div className="relative">
                    <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-500 italic outline-none" />
                    <LinkIcon className="absolute right-5 top-4 text-slate-300" size={18} />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#B48C00] hover:bg-black text-white py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-yellow-900/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={22} strokeWidth={3} />}
                  {editingId ? "រក្សាទុកការកែប្រែ" : "យល់ព្រមបង្កើត"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}