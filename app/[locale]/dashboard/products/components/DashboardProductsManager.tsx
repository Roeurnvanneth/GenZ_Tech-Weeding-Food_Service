"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ImageIcon,
  Check,
  Globe,
  Star,
  Video,
  ArrowUpCircle,
  Search,
  DollarSign,
  Layers,
} from "lucide-react";

interface Product {
  id: number;
  slug: string;
  maxPrice: number;
  hallPrice: number;
  videoUrl: string | null;
  images: string[];
  isPoppular: boolean;
  categoryId: number;
  translations: {
    kh: { name: string; description: string };
    en: { name: string; description: string };
  };
  category?: {
    translations?: { kh?: { name: string } };
    slug?: string;
  };
}

export default function DashboardProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const [formData, setFormData] = useState({
    nameKh: "",
    nameEn: "",
    descriptionKh: "",
    descriptionEn: "",
    maxPrice: "",
    hallPrice: "",
    categoryId: "",
    slug: "",
    videoUrl: "",
    images: [] as string[],
    popular: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary Config (ដូចមុន)
  const CLOUD_NAME = "dclrah9om";
  const UPLOAD_PRESET = "genz_preset";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const pJson = await pRes.json();
      const cJson = await cRes.json();
      setProducts(pJson.data || []);
      setCategories(cJson.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 📸 Multi-Image Upload
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    const uploadedUrls: string[] = [...formData.images];
    
    for (const file of selectedFiles) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { 
          method: "POST", body: data 
        });
        const json = await res.json();
        uploadedUrls.push(json.secure_url);
      } catch (err) { console.error(err); }
    }
    setFormData((prev) => ({ ...prev, images: uploadedUrls }));
    setIsUploading(false);
  };

  // 🎥 Video Upload Logic
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsVideoUploading(true);
    setVideoProgress(0);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("resource_type", "video");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setVideoProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setFormData((prev) => ({ ...prev, videoUrl: response.secure_url }));
      }
      setIsVideoUploading(false);
    };
    xhr.send(data);
  };

  // 💾 Submit to Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("សូមជ្រើសរើសប្រភេទ Category");

    const payload = {
      slug: formData.slug,
      maxPrice: Number(formData.maxPrice) || 0,
      hallPrice: Number(formData.hallPrice) || 0,
      isPoppular: formData.popular,
      videoUrl: formData.videoUrl || null,
      images: formData.images,
      categoryId: Number(formData.categoryId),
      translations: {
        kh: { name: formData.nameKh, description: formData.descriptionKh },
        en: { name: formData.nameEn, description: formData.descriptionEn },
      },
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(result.error || "រក្សាទុកមិនបានជោគជ័យ");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (p?: Product) => {
    if (p) {
      setEditingId(p.id);
      setFormData({
        nameKh: p.translations?.kh?.name || "",
        nameEn: p.translations?.en?.name || "",
        descriptionKh: p.translations?.kh?.description || "",
        descriptionEn: p.translations?.en?.description || "",
        popular: p.isPoppular || false,
        maxPrice: p.maxPrice?.toString() || "",
        hallPrice: p.hallPrice?.toString() || "",
        categoryId: p.categoryId?.toString() || "",
        slug: p.slug || "",
        videoUrl: p.videoUrl || "",
        images: p.images || [],
      });
    } else {
      setEditingId(null);
      setFormData({
        nameKh: "", nameEn: "", descriptionKh: "", descriptionEn: "",
        maxPrice: "", hallPrice: "", categoryId: "", slug: "",
        videoUrl: "", images: [], popular: false,
      });
    }
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    const nameKh = p.translations?.kh?.name || "";
    const nameEn = p.translations?.en?.name || "";
    return (
      nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-5 font-khmer bg-[#F3F4F6] min-h-screen pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">គ្រប់គ្រងឈុតម្ហូប</h1>
          <p className="text-slate-500 text-lg mt-1">រៀបចំ និងមើលបញ្ជីឈុតម្ហូបទាំងអស់ក្នុងប្រព័ន្ធ</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#B48C00] hover:bg-[#8e6f00] text-white px-10 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 shadow-xl transition-all active:scale-95"
        >
          <Plus size={28} strokeWidth={4} /> បន្ថែមឈុតថ្មី
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-10 border-b border-slate-100 bg-white/50 backdrop-blur-md">
          <div className="relative max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input
              type="text"
              placeholder="ស្វែងរកឈ្មោះឈុតម្ហូប ឬ Slug..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-[2rem] outline-none text-lg font-bold border-2 border-transparent focus:border-[#B48C00]/20 focus:bg-white transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6 text-left">ព័ត៌មានឈុតម្ហូប</th>
                <th className="px-10 py-6 text-left">ប្រភេទ (Category)</th>
                <th className="px-10 py-6 text-center">តម្លៃឈុត/តុ</th>
                <th className="px-10 py-6 text-center">តម្លៃរោង</th>
                <th className="px-10 py-6 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-32 text-center">
                    <Loader2 className="animate-spin text-[#B48C00] mx-auto mb-4" size={50} />
                    <span className="font-black text-slate-400 uppercase tracking-widest">កំពុងទាញទិន្នន័យ...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center font-bold text-slate-400">មិនមានទិន្នន័យឡើយ</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-white overflow-hidden border-2 border-slate-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                          <img src={p.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-xl flex items-center gap-2">
                            {p.translations?.kh?.name}
                            {p.isPoppular && <Star size={20} className="text-orange-500 fill-orange-500" />}
                          </span>
                          <span className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1 italic">/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100 flex items-center gap-2 w-fit">
                          <Layers size={14} /> {p.category?.translations?.kh?.name || p.category?.slug || "General"}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="text-2xl font-black text-[#B48C00] tracking-tighter">${p.maxPrice}</span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="text-xl font-black text-blue-700 tracking-tighter">${p.hallPrice}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(p)} className="p-4 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl border border-slate-100 transition-all">
                            <Pencil size={22} />
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm("តើអ្នកប្រាកដថាចង់លុបឈុតនេះ?")) {
                                const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
                                if (res.ok) fetchData();
                              }
                            }} 
                            className="p-4 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl border border-slate-100 transition-all"
                          >
                            <Trash2 size={22} />
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

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[3.5rem] shadow-2xl flex flex-col max-h-[94vh] border border-white/20 animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 rounded-t-[3.5rem] z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-yellow-50 text-[#B48C00] rounded-2xl">
                    <UtensilsIcon size={32} />
                </div>
                <div>
                    <h2 className="font-black text-3xl text-slate-900">{editingId ? "កែប្រែព័ត៌មានឈុតម្ហូប" : "បន្ថែមឈុតម្ហូបថ្មី"}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Product Management System</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-900">
                <X size={36} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-12 overflow-y-auto space-y-12 scrollbar-hide">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="space-y-6">
                  <label className="text-sm font-black text-slate-500 uppercase flex items-center gap-3 ml-2 tracking-widest">
                    <ImageIcon size={20} className="text-[#B48C00]" /> រូបភាពអាល់ប៊ុម ({formData.images.length}/25)
                  </label>
                  <div className="grid grid-cols-4 gap-4 p-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-[1.5rem] overflow-hidden group border-2 border-white shadow-md">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData(p => ({...p, images: p.images.filter((_, idx) => idx !== i)}))}
                          className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    ))}
                    {formData.images.length < 25 && (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-[1.5rem] bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#B48C00] hover:text-[#B48C00] transition-all group"
                      >
                        {isUploading ? <Loader2 className="animate-spin text-[#B48C00]" /> : <Plus size={40} className="group-hover:rotate-90 transition-transform duration-500" />}
                      </button>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} hidden multiple onChange={handleMultiFileUpload} accept="image/*" />
                </div>

                {/* Video Section */}
                <div className="space-y-6">
                  <label className="text-sm font-black text-slate-500 uppercase flex items-center gap-3 ml-2 tracking-widest">
                    <Video size={20} className="text-blue-500" /> វីដេអូបង្ហាញឈុតម្ហូប
                  </label>
                  <div className="h-[230px] bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-inner relative group">
                    {formData.videoUrl ? (
                      <div className="w-full h-full">
                        <video src={formData.videoUrl} className="w-full h-full object-cover" controls />
                        <button type="button" onClick={() => setFormData({...formData, videoUrl: ""})}
                          className="absolute top-6 right-6 p-3 bg-red-600 text-white rounded-2xl shadow-2xl hover:scale-110 transition-transform"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => videoInputRef.current?.click()} className="flex flex-col items-center gap-4 text-slate-400 hover:text-blue-600 transition-all">
                        {isVideoUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-blue-500" size={40} />
                            <span className="text-xl font-black text-blue-600">{videoProgress}%</span>
                          </div>
                        ) : (
                          <>
                            <ArrowUpCircle size={60} strokeWidth={1.5} className="group-hover:-translate-y-2 transition-transform duration-500" />
                            <span className="font-black uppercase tracking-tighter">Upload High Quality Video</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <input type="file" ref={videoInputRef} hidden onChange={handleVideoUpload} accept="video/*" />
                </div>
              </div>

              {/* Popular Checkbox Custom */}
              <div onClick={() => setFormData({ ...formData, popular: !formData.popular })}
                className={`p-8 rounded-[2.5rem] border-2 transition-all flex justify-between items-center cursor-pointer shadow-xl ${formData.popular ? "bg-orange-50 border-orange-400" : "bg-slate-50 border-transparent hover:bg-slate-100"}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[1.5rem] ${formData.popular ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-slate-200 text-slate-400"}`}>
                    <Star size={32} fill={formData.popular ? "white" : "none"} />
                  </div>
                  <div>
                    <span className="font-black text-2xl text-slate-800 block leading-none">ឈុតម្ហូបល្បីបំផុត (Most Popular)</span>
                    <span className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest italic">Display priority status on website</span>
                  </div>
                </div>
                <div className={`w-16 h-8 rounded-full relative transition-colors ${formData.popular ? "bg-orange-500" : "bg-slate-300"}`}>
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${formData.popular ? "right-1" : "left-1"}`} />
                </div>
              </div>

              {/* Translation Inputs */}
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6 p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 shadow-sm">
                  <h4 className="font-black text-2xl text-slate-900 flex items-center gap-3 mb-4"><Globe size={26} className="text-blue-600" /> ភាសាខ្មែរ</h4>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">ឈ្មោះឈុតម្ហូប</label>
                    <input required value={formData.nameKh} onChange={(e) => setFormData({ ...formData, nameKh: e.target.value })}
                      className="w-full px-8 py-5 bg-white rounded-[1.5rem] outline-none shadow-sm font-black text-xl border-2 border-transparent focus:border-blue-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">ការពិពណ៌នា</label>
                    <textarea rows={4} value={formData.descriptionKh} onChange={(e) => setFormData({...formData, descriptionKh: e.target.value})}
                      className="w-full px-8 py-5 bg-white rounded-[1.5rem] outline-none shadow-sm text-lg font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-6 p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 shadow-sm">
                  <h4 className="font-black text-2xl text-slate-900 flex items-center gap-3 mb-4"><Globe size={26} className="text-[#B48C00]" /> English Version</h4>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Product Set Name</label>
                    <input required value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-8 py-5 bg-white rounded-[1.5rem] outline-none shadow-sm font-black text-xl border-2 border-transparent focus:border-yellow-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Full Description</label>
                    <textarea rows={4} value={formData.descriptionEn} onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                      className="w-full px-8 py-5 bg-white rounded-[1.5rem] outline-none shadow-sm text-lg font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Financial & ID Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <DollarSign size={14} className="text-[#B48C00]" /> តម្លៃឈុត/តុ ($)
                  </label>
                  <input type="number" required value={formData.maxPrice} onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                    className="w-full px-8 py-6 bg-slate-100 rounded-[2rem] outline-none font-black text-3xl text-[#B48C00] border-2 border-transparent focus:border-[#B48C00]/30 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <DollarSign size={14} className="text-blue-600" /> តម្លៃរោង/តុបតែង ($)
                  </label>
                  <input type="number" required value={formData.hallPrice} onChange={(e) => setFormData({ ...formData, hallPrice: e.target.value })}
                    className="w-full px-8 py-6 bg-blue-50 rounded-[2rem] outline-none font-black text-3xl text-blue-700 border-2 border-blue-100 focus:border-blue-400 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">តំណភ្ជាប់ URL (Slug)</label>
                  <input required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-8 py-6 bg-slate-100 rounded-[2rem] outline-none font-bold text-xl text-slate-600 italic"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">ប្រភេទឈុតម្ហូប (Product Category)</label>
                <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-8 py-6 bg-slate-100 rounded-[2rem] outline-none font-black text-xl border-2 border-transparent focus:border-[#B48C00] appearance-none cursor-pointer"
                >
                  <option value="">-- សូមជ្រើសរើសប្រភេទ --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.translations?.kh?.name || c.slug}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={isUploading || isVideoUploading}
                className="w-full bg-[#B48C00] text-white py-8 rounded-[3rem] font-black text-3xl shadow-2xl hover:bg-black hover:-translate-y-2 active:scale-95 transition-all flex justify-center items-center gap-6 group"
              >
                {isUploading || isVideoUploading ? (
                  <Loader2 className="animate-spin" size={40} />
                ) : (
                  <>
                    <Check strokeWidth={5} className="group-hover:scale-125 transition-transform" /> រក្សាទុកព័ត៌មានឈុតម្ហូប
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Icon Helper
function UtensilsIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    );
}