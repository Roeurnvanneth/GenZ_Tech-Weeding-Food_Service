"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, Tags, Calendar, Loader2, Check, AlertCircle, Link as LinkIcon } from "lucide-react";

interface Category {
  id: number;
  slug: string;
  createdAt?: string;
  translations: {
    kh: { name: string };
    en: { name: string };
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameKh, setNameKh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khmer-friendly slugify
  const slugifyKhmer = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")      
      .replace(/[^\u1780-\u17FF\w-]+/g, ""); 
  };

  useEffect(() => {
    if (!editingId) {
      setSlug(slugifyKhmer(nameKh));
    }
  }, [nameKh, editingId]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data || [];
      setCategories(list);
      setFiltered(list);
    } catch (err) {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const result = categories.filter((c) =>
      `${c.translations?.en?.name} ${c.translations?.kh?.name} ${c.slug}`.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, categories]);

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
          slug, 
          translations: { kh: { name: nameKh }, en: { name: nameEn } } 
        }),
      });

      if (res.ok) {
        closeModal();
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបប្រភេទនេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditingId(cat.id);
      setNameKh(cat.translations.kh.name);
      setNameEn(cat.translations.en.name);
      setSlug(cat.slug);
    } else {
      setEditingId(null);
      setNameKh(""); setNameEn(""); setSlug("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  return (
    <div className="p-5 space-y-8 bg-[#F3F4F6] min-h-screen font-khmer">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">គ្រប់គ្រងប្រភេទមុខម្ហូប</h1>
          <p className="text-slate-500 text-lg mt-1 font-medium">រៀបចំ និងមើលបញ្ជីចំណាត់ថ្នាក់មុខម្ហូបទាំងអស់របស់អ្នក</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-[#B48C00] hover:bg-[#8e6f00] text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-md transition-all active:scale-95"
        >
          <Plus size={24} strokeWidth={3} /> បន្ថែមប្រភេទថ្មី
        </button>
      </div>

      {/* SEARCH AND TABLE CONTAINER */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        {/* Search Input Area */}
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              placeholder="ស្វែងរកឈ្មោះប្រភេទ..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#B48C00]/20 focus:bg-white rounded-2xl text-base font-bold outline-none transition-all shadow-sm" 
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#B48C00]" size={48} />
              <p className="text-slate-400 font-black text-sm uppercase tracking-widest">កំពុងទាញយកទិន្នន័យ...</p>
            </div>
          ) : filtered.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] bg-slate-50/80 border-b border-slate-100">
                  <th className="px-10 py-6">ឈ្មោះប្រភេទ (NAME)</th>
                  <th className="px-10 py-6">តំណភ្ជាប់ (SLUG)</th>
                  <th className="px-10 py-6">កាលបរិច្ឆេទ</th>
                  <th className="px-10 py-6 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#B48C00] shadow-inner">
                          <Tags size={24} />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg leading-tight">{cat.translations?.kh?.name}</div>
                          <div className="text-sm text-slate-400 font-bold uppercase tracking-wide mt-1">{cat.translations?.en?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold border border-slate-200">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-10 py-6 text-slate-500 font-bold text-base">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-slate-300" />
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('km-KH') : "---"}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right space-x-3">
                      <button 
                        onClick={() => openModal(cat)} 
                        className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 hover:bg-yellow-100 hover:text-yellow-700 rounded-xl font-black text-sm transition-all border border-transparent hover:border-yellow-200"
                      >
                        <Pencil size={18} /> កែប្រែ
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-32 text-center space-y-4">
              <AlertCircle className="mx-auto text-slate-200" size={64} />
              <p className="text-slate-400 font-black text-xl tracking-tight">មិនមានទិន្នន័យត្រូវបានរកឃើញឡើយ</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">
                  {editingId ? "កែប្រែព័ត៌មាន" : "បន្ថែមប្រភេទថ្មី"}
                </h2>
                <button onClick={closeModal} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                    ឈ្មោះជាភាសាខ្មែរ <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    value={nameKh} 
                    onChange={(e) => setNameKh(e.target.value)} 
                    placeholder="ឧ. អាហារសម្រន់" 
                    className="w-full px-6 py-5 bg-slate-100 border-2 border-transparent focus:border-[#B48C00]/20 focus:bg-white rounded-2xl text-lg font-black outline-none transition-all" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
                    ឈ្មោះជាភាសាអង់គ្លេស <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    value={nameEn} 
                    onChange={(e) => setNameEn(e.target.value)} 
                    placeholder="ex. Snacks" 
                    className="w-full px-6 py-5 bg-slate-100 border-2 border-transparent focus:border-[#B48C00]/20 focus:bg-white rounded-2xl text-lg font-black outline-none transition-all uppercase" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">តំណភ្ជាប់ (SLUG)</label>
                  <div className="relative">
                    <input 
                      value={slug} 
                      readOnly 
                      className="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl text-slate-400 font-bold text-base cursor-not-allowed" 
                    />
                    <LinkIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
                </div>
                
                <button 
                  disabled={isSubmitting} 
                  type="submit" 
                  className="w-full mt-4 bg-[#B48C00] hover:bg-[#8e6f00] text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Check size={28} strokeWidth={4} />}
                  {editingId ? "រក្សាទុកការផ្លាស់ប្តូរ" : "រក្សាទុកព័ត៌មាន"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}