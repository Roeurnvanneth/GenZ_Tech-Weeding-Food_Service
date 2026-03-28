"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Search, Pencil, Trash2, X, Loader2, 
  UploadCloud, User, Check, Globe, Link as LinkIcon 
} from "lucide-react";

export default function TeamManager() {
  // --- States ---
  const [teams, setTeams] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Cloudinary States
  const [isUploading, setIsUploading] = useState(false);
  const CLOUD_NAME = "dclrah9om"; 
  const UPLOAD_PRESET = "genz_preset";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    slug: "",
    image: "",
    nameEn: "",
    roleEn: "",
    nameKh: "",
    roleKh: ""
  });

  // --- 1. Fetch Data (Read) ---
  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teams");
      const json = await res.json();
      // Ensure we get the array from the 'data' property
      const list = json.data || [];
      setTeams(list);
      setFiltered(list);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  // --- 2. Search & Filtering ---
  useEffect(() => {
    const result = teams.filter((t) =>
      `${t.translations?.en?.name} ${t.translations?.km?.name} ${t.translations?.en?.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, teams]);

  // --- 3. Automatic Slug Generation ---
  useEffect(() => {
    if (!editingId && formData.nameEn) {
      const generatedSlug = formData.nameEn
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.nameEn, editingId]);

  // --- 4. Image Upload (Cloudinary) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setFormData(prev => ({ ...prev, image: json.secure_url }));
    } catch (err) {
      alert("រូបភាពមិនអាចផ្ទុកឡើងបានទេ!");
    } finally {
      setIsUploading(false);
    }
  };

  // --- 5. Submit (Create & Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      slug: formData.slug,
      image: formData.image,
      translations: {
        en: { name: formData.nameEn, role: formData.roleEn },
        km: { name: formData.nameKh, role: formData.roleKh }
      }
    };

    const url = editingId ? `/api/teams/${editingId}` : "/api/teams";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTeams();
      } else {
        alert("មានបញ្ហាក្នុងការរក្សាទុក! សូមពិនិត្យមើល Slug ម្តងទៀត។");
      }
    } catch (error) {
      alert("Error saving team member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 6. Delete ---
  const handleDelete = async (id: number) => {
    if (!confirm("តើអ្នកប្រាកដថាចង់លុបបុគ្គលិកនេះមែនទេ?")) return;
    try {
      const res = await fetch(`/api/teams/${id}`, { method: "DELETE" });
      if (res.ok) fetchTeams();
    } catch (err) {
      alert("លុបមិនបានសម្រេច!");
    }
  };

  // --- Helper to open Modal ---
  const openModal = (member?: any) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        slug: member.slug || "",
        image: member.image || "",
        nameEn: member.translations?.en?.name || "",
        roleEn: member.translations?.en?.role || "",
        nameKh: member.translations?.km?.name || "",
        roleKh: member.translations?.km?.role || "",
      });
    } else {
      setEditingId(null);
      setFormData({ slug: "", image: "", nameEn: "", roleEn: "", nameKh: "", roleKh: "" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-10 space-y-8 bg-[#F3F4F6] min-h-screen font-khmer">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">គ្រប់គ្រងបុគ្គលិក</h1>
          <p className="text-slate-500 text-lg mt-1 font-medium italic">រៀបចំ និងកំណត់តួនាទីរបស់ក្រុមការងារ</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-[#B48C00] hover:bg-[#8e6f00] text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-md transition-all active:scale-95"
        >
          <Plus size={24} strokeWidth={3} /> បន្ថែមបុគ្គលិកថ្មី
        </button>
      </div>

      {/* SEARCH AND TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              placeholder="ស្វែងរកឈ្មោះ ឬតួនាទី..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#B48C00]/20 focus:bg-white rounded-2xl text-base font-bold outline-none transition-all shadow-sm" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#B48C00]" size={48} />
              <p className="text-slate-400 font-black tracking-widest uppercase text-sm">កំពុងទាញយកទិន្នន័យ...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] bg-slate-50/80 border-b border-slate-100">
                  <th className="px-10 py-6">បុគ្គលិក (Member)</th>
                  <th className="px-10 py-6">តួនាទី (Role)</th>
                  <th className="px-10 py-6">តំណភ្ជាប់ (Slug)</th>
                  <th className="px-10 py-6 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-100 shadow-sm flex-shrink-0">
                          {member.image ? (
                            <img src={member.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><User size={24}/></div>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg leading-tight">{member.translations?.km?.name}</div>
                          <div className="text-sm text-slate-400 font-bold uppercase mt-1">{member.translations?.en?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                        <div className="font-bold text-slate-700 text-base">{member.translations?.km?.role}</div>
                        <div className="text-xs text-slate-400 italic font-medium">{member.translations?.en?.role}</div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold border border-slate-200">
                        {member.slug}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => openModal(member)} className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 hover:bg-yellow-100 hover:text-yellow-700 rounded-xl font-black text-sm transition-all">
                        <Pencil size={18} /> កែប្រែ
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
               <h2 className="font-black text-2xl text-slate-900">ព័ត៌មានបុគ្គលិក</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={28}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-8 max-h-[80vh] scrollbar-hide">
              {/* Profile Upload */}
              <div className="flex flex-col items-center gap-4 bg-slate-50 p-8 rounded-[2.5rem]">
                  <div className="relative w-36 h-36 rounded-[2.5rem] bg-white border-4 border-white shadow-xl overflow-hidden group">
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50"><User size={60}/></div>
                      )}
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        {isUploading ? <Loader2 className="animate-spin" size={32}/> : <UploadCloud size={32}/>}
                      </button>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">រូបថតបុគ្គលិក (Profile Image)</p>
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
              </div>

              {/* Translation Inputs */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Khmer Version */}
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <h4 className="font-black text-xl text-slate-900 flex items-center gap-3 mb-2"><Globe size={22} className="text-blue-600"/> ភាសាខ្មែរ</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">ឈ្មោះបុគ្គលិក</label>
                    <input required value={formData.nameKh} onChange={(e)=>setFormData({...formData, nameKh: e.target.value})} className="w-full p-4 bg-white border-2 border-transparent focus:border-blue-500/20 rounded-2xl outline-none shadow-sm font-black text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">តួនាទី</label>
                    <input required value={formData.roleKh} onChange={(e)=>setFormData({...formData, roleKh: e.target.value})} className="w-full p-4 bg-white border-2 border-transparent focus:border-blue-500/20 rounded-2xl outline-none shadow-sm text-base font-bold" />
                  </div>
                </div>

                {/* English Version */}
                <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <h4 className="font-black text-xl text-slate-900 flex items-center gap-3 mb-2"><Globe size={22} className="text-[#B48C00]"/> English</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">Full Name</label>
                    <input required value={formData.nameEn} onChange={(e)=>setFormData({...formData, nameEn: e.target.value})} className="w-full p-4 bg-white border-2 border-transparent focus:border-yellow-500/20 rounded-2xl outline-none shadow-sm font-black text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">Role / Job Title</label>
                    <input required value={formData.roleEn} onChange={(e)=>setFormData({...formData, roleEn: e.target.value})} className="w-full p-4 bg-white border-2 border-transparent focus:border-yellow-500/20 rounded-2xl outline-none shadow-sm text-base font-bold" />
                  </div>
                </div>
              </div>

              {/* URL Slug */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 ml-2 uppercase tracking-wider">តំណភ្ជាប់ URL (Slug)</label>
                <div className="relative">
                    <input required value={formData.slug} onChange={(e)=>setFormData({...formData, slug: e.target.value})} className="w-full p-5 bg-slate-100 rounded-2xl outline-none font-bold text-lg text-slate-600 border-2 border-transparent focus:border-slate-300" />
                    <LinkIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isUploading} 
                className="w-full bg-[#B48C00] text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-[#8e6f00] hover:-translate-y-1 transition-all flex justify-center items-center gap-4 active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={30}/> : <><Check strokeWidth={4} /> រក្សាទុកទិន្នន័យ</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}