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

  // Khmer-friendly slugify (សម្អាត URL ឲ្យស្អាត)
  const slugifyKhmer = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")      // ដូរដកឃ្លាទៅជាសញ្ញា -
      .replace(/[^\u1780-\u17FF\w-]+/g, ""); // រក្សាទុកតែអក្សរខ្មែរ អង់គ្លេស លេខ និងសញ្ញា -
  };

  // បង្កើត Slug អូតូនៅពេលវាយឈ្មោះខ្មែរ
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

  // ស្វែងរកបានទាំងខ្មែរ និងអង់គ្លេស
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
      } else {
        alert("ការរក្សាទុកមានបញ្ហា! សូមព្យាយាមម្ដងទៀត។");
      }
    } catch (error) {
      alert("មានបញ្ហាបច្ចេកទេស!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបប្រភេទនេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
      else alert("ការលុបមិនបានសម្រេច!");
    } catch (err) {
      alert("មានបញ្ហាប្រព័ន្ធអ៊ីនធឺណិត");
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
    <div className="p-4 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen font-khmer">
      {/* ផ្នែកខាងលើ - Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">គ្រប់គ្រងប្រភេទមុខម្ហូប</h1>
          <p className="text-slate-500 text-sm">រៀបចំ និងកំណត់ចំណាត់ថ្នាក់មុខម្ហូបរបស់អ្នក</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-[#B48C00] hover:bg-yellow-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> បន្ថែមប្រភេទថ្មី
        </button>
      </div>

      {/* ផ្នែកតារាង និងការស្វែងរក */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-white">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="ស្វែងរកប្រភេទ..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#B48C00]/20 transition-all" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#B48C00]" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">កំពុងទាញយកទិន្នន័យ...</p>
            </div>
          ) : filtered.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#64748b] text-[11px] font-black uppercase tracking-wider bg-slate-50/50">
                  <th className="px-8 py-5">ឈ្មោះប្រភេទ</th>
                  <th className="px-8 py-5">តំណភ្ជាប់ (Slug)</th>
                  <th className="px-8 py-5">កាលបរិច្ឆេទបង្កើត</th>
                  <th className="px-8 py-5 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#B48C00] group-hover:text-white transition-all">
                          <Tags size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-700">{cat.translations?.kh?.name}</div>
                          <div className="text-[12px] text-slate-400 italic">{cat.translations?.en?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <LinkIcon size={14} className="text-slate-300" />
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[12px] font-mono">
                          {cat.slug}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('km-KH') : "មិនកំណត់"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      {/* === UPDATED: EDIT BUTTON WITH TEXT === */}
                      <button 
                        onClick={() => openModal(cat)} 
                        className="p-2.5 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm group inline-flex items-center gap-1.5"
                        title="កែសម្រួល"
                      >
                        <Pencil size={16} />
                        <span className="font-medium text-xs">កែសម្រួល</span>
                      </button>

                      {/* === UPDATED: DELETE BUTTON WITH TEXT === */}
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="p-2.5 border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm group inline-flex items-center gap-1.5"
                        title="លុបចោល"
                      >
                        <Trash2 size={16} />
                        <span className="font-medium text-xs">លុបចោល</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center space-y-3">
              <AlertCircle className="mx-auto text-slate-200" size={48} />
              <p className="text-slate-400 font-medium">មិនមានទិន្នន័យត្រូវបានរកឃើញទេ។</p>
            </div>
          )}
        </div>
      </div>

      {/* ផ្ទាំងសម្រាប់បញ្ចូលទិន្នន័យ (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId ? "កែប្រែព័ត៌មាន" : "បន្ថែមប្រភេទថ្មី"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase flex gap-1">ឈ្មោះជាភាសាខ្មែរ <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    value={nameKh} 
                    onChange={(e) => setNameKh(e.target.value)} 
                    placeholder="ឧ. អាហារសម្រន់" 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#B48C00] rounded-2xl outline-none font-medium transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase flex gap-1">ឈ្មោះជាភាសាអង់គ្លេស <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    value={nameEn} 
                    onChange={(e) => setNameEn(e.target.value)} 
                    placeholder="ex. Snacks" 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#B48C00] rounded-2xl outline-none font-medium transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-400 uppercase">តំណភ្ជាប់ (បង្កើតអូតូពីឈ្មោះខ្មែរ)</label>
                  <div className="relative">
                    <input 
                      value={slug} 
                      readOnly 
                      className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-slate-500 font-mono text-sm cursor-not-allowed" 
                    />
                    <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  </div>
                </div>
                
                <button 
                  disabled={isSubmitting} 
                  type="submit" 
                  className="w-full bg-[#B48C00] hover:bg-yellow-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-yellow-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={20} strokeWidth={3} />}
                  {editingId ? "រក្សាទុកការផ្លាស់ប្តូរ" : "យល់ព្រមបន្ថែម"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}