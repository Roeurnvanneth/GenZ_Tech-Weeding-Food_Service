"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Pencil, Trash2, Search, Utensils, 
  Loader2, DollarSign, X, Tag, ImageIcon 
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  menu_name: string;
  price_usd: number;
  price_khr: number;
  categoryId: number;
  status: string;
  image?: string; // ត្រូវជាមួយ Schema
  category?: { name: string };
}

export default function MenusPage() {
  const [data, setData] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Menu | null>(null);
  
  const [formData, setFormData] = useState({ 
    menu_name: "", 
    price_usd: "", 
    categoryId: "",
    status: "active",
    image: null as File | null
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch("/api/menus"),
        fetch("/api/categories") 
      ]);
      const menuJson = await menuRes.json();
      const catJson = await catRes.json();
      
      if (menuJson.success) setData(menuJson.data);
      if (catJson.success) setCategories(catJson.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("សូមជ្រើសរើសប្រភេទម្ហូប!");
    
    setSubmitting(true);
    const isEdit = !!editingItem;
    
    // បង្កើត FormData សម្រាប់បញ្ជូន File និង Text រួមគ្នា
    const body = new FormData();
    body.append("menu_name", formData.menu_name);
    body.append("price_usd", formData.price_usd);
    body.append("categoryId", formData.categoryId);
    body.append("status", formData.status);
    if (formData.image) body.append("image", formData.image);

    const url = isEdit ? `/api/menus/${editingItem.id}` : "/api/menus";

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: body, // ហាមដាក់ headers: { "Content-Type": "application/json" }
      });

      const result = await res.json();
      if (result.success) {
        setIsModalOpen(false);
        resetForm();
        fetchData();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("ប្រតិបត្តិការបរាជ័យ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបមុខម្ហូបនេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/menus/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      alert("មិនអាចលុបបានឡើយ");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ menu_name: "", price_usd: "", categoryId: "", status: "active", image: null });
    setPreviewUrl(null);
  };

  const openEditModal = (item: Menu) => {
    setEditingItem(item);
    setFormData({
      menu_name: item.menu_name,
      price_usd: item.price_usd.toString(),
      categoryId: item.categoryId.toString(),
      status: item.status,
      image: null
    });
    setPreviewUrl(item.image ? `/uploads/${item.image}` : null);
    setIsModalOpen(true);
  };

  const filtered = data.filter((item) => 
    item.menu_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 font-khmer max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#B48C00] text-white rounded-2xl shadow-lg"><Utensils size={32} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">គ្រប់គ្រងមុខម្ហូប</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-widest mt-1 uppercase">Management Dashboard v2.0</p>
          </div>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#B48C00] hover:bg-black text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl"
        >
          <Plus size={20} /> បន្ថែមមុខម្ហូបថ្មី
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
        <input 
          placeholder="ស្វែងរកឈ្មោះមុខម្ហូប..." 
          className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[1.8rem] outline-none focus:border-[#B48C00] font-bold text-lg shadow-sm"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <th className="px-10 py-7">មុខម្ហូប</th>
              <th className="px-10 py-7 text-center">តម្លៃ USD / KHR</th>
              <th className="px-10 py-7 text-center">ស្ថានភាព</th>
              <th className="px-10 py-7 text-right">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#B48C00]" size={40} /></td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-all font-bold">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                       <img 
                        src={item.image ? `/uploads/${item.image}` : "/placeholder.png"} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        onError={(e) => e.currentTarget.src = "/placeholder.png"}
                       />
                    </div>
                    <div>
                      <div className="text-lg text-slate-900">{item.menu_name}</div>
                      <div className="inline-flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                        <Tag size={10} /> {item.category?.name || "គ្មានប្រភេទ"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6 text-center">
                  <div className="text-xl font-black text-[#B48C00]">${Number(item.price_usd).toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400">≈ {Number(item.price_khr).toLocaleString()} R</div>
                </td>
                <td className="px-10 py-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black ${item.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-10 py-6 text-right space-x-2">
                    <button onClick={() => openEditModal(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-black"><X size={24}/></button>
            <h2 className="text-2xl font-black mb-8 text-slate-900">{editingItem ? "កែប្រែមុខម្ហូប" : "បន្ថែមមុខម្ហូបថ្មី"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* IMAGE UPLOAD BOX */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">រូបភាព</label>
                <div className="relative h-40 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden flex items-center justify-center group hover:border-[#B48C00] transition-all">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center text-slate-300 group-hover:text-[#B48C00]">
                      <ImageIcon className="mx-auto" size={40} />
                      <span className="text-[10px] font-black uppercase">បញ្ចូលរូបភាព</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ឈ្មោះមុខម្ហូប</label>
                <input required className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#B48C00] font-bold" value={formData.menu_name} onChange={(e) => setFormData({...formData, menu_name: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ប្រភេទ</label>
                <select required className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#B48C00] font-bold" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                  <option value="">ជ្រើសរើសប្រភេទ...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">តម្លៃ USD</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B48C00]" size={18}/>
                    <input type="number" step="0.01" required className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#B48C00] font-bold" value={formData.price_usd} onChange={(e) => setFormData({...formData, price_usd: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ស្ថានភាព</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#B48C00] font-bold" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="active">ACTIVE</option>
                    <option value="inactive">INACTIVE</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full bg-[#B48C00] text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-100">
                {submitting ? <Loader2 className="animate-spin" /> : editingItem ? "រក្សាទុកការកែប្រែ" : "រក្សាទុកមុខម្ហូប"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}