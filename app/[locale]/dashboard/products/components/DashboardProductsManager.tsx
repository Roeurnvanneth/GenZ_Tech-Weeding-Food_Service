"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Pencil, Trash2, X, Loader2, UploadCloud, 
  ImageIcon, Check, Globe, Star, Video, ArrowUpCircle, Search 
} from "lucide-react";

export default function DashboardProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
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
    nameKh: "", nameEn: "", descriptionKh: "", descriptionEn: "",
    minPrice: "", maxPrice: "", hallPrice: "", 
    categoryId: "", slug: "", videoUrl: "", images: [] as string[],
    popular: false 
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const CLOUD_NAME = "dclrah9om"; 
  const UPLOAD_PRESET = "genz_preset";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
      const pJson = await pRes.json();
      const cJson = await cRes.json();
      setProducts(pJson.data || []);
      setCategories(cJson.data || []);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

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
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const json = await res.json();
        uploadedUrls.push(json.secure_url);
      } catch (err) { console.error(err); }
    }
    setFormData(prev => ({ ...prev, images: uploadedUrls }));
    setIsUploading(false);
  };

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
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setVideoProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setFormData(prev => ({ ...prev, videoUrl: response.secure_url }));
      }
      setIsVideoUploading(false);
    };
    xhr.send(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      slug: formData.slug,
      minPrice: parseFloat(formData.minPrice) || 0,
      maxPrice: parseFloat(formData.maxPrice) || 0,
      isPoppular: formData.popular,
      hallPrice: parseFloat(formData.hallPrice) || 0,
      videoUrl: formData.videoUrl,
      images: formData.images,
      categoryId: parseInt(formData.categoryId),
      translations: {
        kh: { name: formData.nameKh, description: formData.descriptionKh },
        en: { name: formData.nameEn, description: formData.descriptionEn }
      }
    };

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) { setIsModalOpen(false); fetchData(); }
  };

  const openModal = (p?: any) => {
    if (p) {
      setEditingId(p.id);
      setFormData({
        nameKh: p.translations?.kh?.name || "", nameEn: p.translations?.en?.name || "",
        descriptionKh: p.translations?.kh?.description || "", descriptionEn: p.translations?.en?.description || "",
        popular: p.isPoppular || false, minPrice: p.minPrice?.toString() || "",
        maxPrice: p.maxPrice?.toString() || "", hallPrice: p.hallPrice?.toString() || "",
        categoryId: p.categoryId?.toString() || "", slug: p.slug || "",
        videoUrl: p.videoUrl || "", images: p.images || []
      });
    } else {
      setEditingId(null);
      setFormData({ 
        nameKh: "", nameEn: "", descriptionKh: "", descriptionEn: "", 
        minPrice: "", maxPrice: "", hallPrice: "", 
        categoryId: "", slug: "", videoUrl: "", images: [] , popular: false
      });
    }
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.translations?.kh?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-5 font-khmer bg-[#F3F4F6] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">គ្រប់គ្រងឈុតម្ហូប</h1>
          <p className="text-slate-500 text-base mt-1">រៀបចំ និងមើលបញ្ជីឈុតម្ហូបទាំងអស់របស់អ្នក</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-[#B48C00] hover:bg-[#8e6f00] text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-md transition-all active:scale-95"
        >
          <Plus size={24} strokeWidth={3} /> បន្ថែមឈុតថ្មី
        </button>
      </div>

      {/* MAIN DATA TABLE CONTAINER */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
        {/* Search Bar Section */}
        <div className="p-8 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text"
              placeholder="ស្វែងរកឈ្មោះឈុតម្ហូប..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none text-base font-bold border-2 border-transparent focus:border-[#B48C00]/20 focus:bg-white transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Column Labels */}
        <div className="grid grid-cols-12 gap-6 px-10 py-5 bg-slate-50 border-b border-slate-100 text-sm font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-4">ឈ្មោះឈុត (NAME)</div>
          <div className="col-span-3">តំណភ្ជាប់ (SLUG)</div>
          <div className="col-span-2 text-center">តម្លៃឈុត ($)</div>
          <div className="col-span-3 text-right">សកម្មភាព</div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-[#B48C00]" size={40} />
                <span className="font-bold text-slate-400">កំពុងទាញទិន្នន័យ...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-20 text-center font-bold text-slate-400">មិនមានទិន្នន័យត្រូវបានរកឃើញឡើយ</div>
          ) : filteredProducts.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-6 px-10 py-6 items-center hover:bg-slate-50/50 transition-colors">
              {/* Product Info */}
              <div className="col-span-4 flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                  <img src={p.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-lg flex items-center gap-2">
                    {p.translations?.kh?.name}
                    {p.isPoppular && <Star size={18} className="text-yellow-500 fill-yellow-500" />}
                  </span>
                  <span className="text-sm text-slate-400 font-bold tracking-wide uppercase">{p.translations?.en?.name}</span>
                </div>
              </div>

              {/* Slug Box */}
              <div className="col-span-3">
                <code className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold border border-slate-200">
                  {p.slug}
                </code>
              </div>

              {/* Price Display */}
              <div className="col-span-2 text-center">
                <span className="text-xl font-black text-[#B48C00] tracking-tight">${p.maxPrice}</span>
              </div>

              {/* Action Buttons */}
              <div className="col-span-3 flex justify-end gap-3">
                <button 
                  onClick={() => openModal(p)}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 hover:bg-yellow-100 hover:text-yellow-700 rounded-xl font-black text-sm transition-all border border-transparent hover:border-yellow-200"
                >
                  <Pencil size={18} /> កែប្រែ
                </button>
                <button 
                  onClick={() => {if(confirm("តើអ្នកប្រាកដថាចង់លុបឈុតនេះ?")) fetch(`/api/products/${p.id}`, {method:"DELETE"}).then(()=>fetchData())}}
                  className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 rounded-t-[3rem] z-10">
               <h2 className="font-black text-2xl text-slate-900">បញ្ចូលព័ត៌មានឈុតម្ហូប</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={28}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 scrollbar-hide">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Image Upload Area */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 uppercase flex items-center gap-2 ml-2">
                    <ImageIcon size={18} className="text-[#B48C00]"/> រូបភាព ({formData.images.length}/25)
                  </label>
                  <div className="grid grid-cols-4 gap-3 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData(p => ({...p, images: p.images.filter((_,idx)=>idx!==i)}))} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={20}/></button>
                      </div>
                    ))}
                    {formData.images.length < 25 && (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#B48C00] hover:text-[#B48C00] transition-all group">
                        {isUploading ? <Loader2 className="animate-spin text-[#B48C00]"/> : <Plus size={30} className="group-hover:scale-110 transition-transform" />}
                        <span className="text-[10px] font-black mt-2 uppercase tracking-tighter">Add Photo</span>
                      </button>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} hidden multiple onChange={handleMultiFileUpload} accept="image/*" />
                </div>

                {/* Video Upload Area */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 uppercase flex items-center gap-2 ml-2"><Video size={18} className="text-blue-500"/> វីដេអូឈុតម្ហូប</label>
                  <div className="h-[180px] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {formData.videoUrl ? (
                      <div className="relative w-full h-full">
                         <video src={formData.videoUrl} className="w-full h-full object-cover" controls />
                         <button type="button" onClick={()=>setFormData({...formData, videoUrl: ""})} className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-xl shadow-lg hover:scale-105 transition-transform"><X size={18}/></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => videoInputRef.current?.click()} className="flex flex-col items-center gap-3 text-slate-400 hover:text-blue-600 group transition-all">
                         {isVideoUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-blue-500" size={32}/>
                                <span className="text-sm font-black text-blue-500">{videoProgress}%</span>
                            </div>
                         ) : <><ArrowUpCircle size={40} className="group-hover:-translate-y-1 transition-transform" /><span className="text-xs font-black uppercase">Upload Video</span></>}
                      </button>
                    )}
                  </div>
                  <input type="file" ref={videoInputRef} hidden onChange={handleVideoUpload} accept="video/*" />
                </div>
              </div>

              {/* Popular Checkbox */}
              <div 
                onClick={() => setFormData({...formData, popular: !formData.popular})}
                className={`p-6 rounded-[2rem] border-2 transition-all flex justify-between items-center cursor-pointer shadow-sm ${formData.popular ? 'bg-yellow-50 border-yellow-400' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${formData.popular ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Star size={24} fill={formData.popular ? "white" : "none"} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-lg text-slate-800">ឈុតម្ហូបល្បីបំផុត (Popular Set)</span>
                    <span className="text-sm text-slate-500 font-bold italic">បង្ហាញផ្កាយលើរូបភាពក្នុងគេហទំព័រ</span>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-colors ${formData.popular ? 'bg-yellow-400' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${formData.popular ? 'right-1' : 'left-1'}`} />
                </div>
              </div>

              {/* Languages */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-5 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <h4 className="font-black text-xl text-slate-900 flex items-center gap-3 mb-2"><Globe size={22} className="text-blue-600"/> ភាសាខ្មែរ</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">ឈ្មោះឈុតម្ហូប</label>
                    <input required value={formData.nameKh} onChange={(e)=>setFormData({...formData, nameKh: e.target.value})} className="w-full p-4 bg-white rounded-2xl outline-none shadow-sm font-black text-lg border-2 border-transparent focus:border-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">ការពិពណ៌នា</label>
                    <textarea rows={3} value={formData.descriptionKh} onChange={(e)=>setFormData({...formData, descriptionKh: e.target.value})} className="w-full p-4 bg-white rounded-2xl outline-none shadow-sm text-base font-bold" />
                  </div>
                </div>

                <div className="space-y-5 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <h4 className="font-black text-xl text-slate-900 flex items-center gap-3 mb-2"><Globe size={22} className="text-[#B48C00]"/> English Language</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">Product Name</label>
                    <input required value={formData.nameEn} onChange={(e)=>setFormData({...formData, nameEn: e.target.value})} className="w-full p-4 bg-white rounded-2xl outline-none shadow-sm font-black text-lg border-2 border-transparent focus:border-yellow-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 ml-1 uppercase">Description</label>
                    <textarea rows={3} value={formData.descriptionEn} onChange={(e)=>setFormData({...formData, descriptionEn: e.target.value})} className="w-full p-4 bg-white rounded-2xl outline-none shadow-sm text-base font-bold" />
                  </div>
                </div>
              </div>

              {/* Logic Inputs */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 ml-2 uppercase">តម្លៃឈុត/តុ ($)</label>
                  <input type="number" required value={formData.maxPrice} onChange={(e)=>setFormData({...formData, maxPrice: e.target.value})} className="w-full p-5 bg-slate-100 rounded-2xl outline-none font-black text-2xl text-[#B48C00] border-2 border-transparent focus:border-[#B48C00]/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 ml-2 uppercase text-blue-600">តម្លៃរោង ($)</label>
                  <input type="number" required value={formData.hallPrice} onChange={(e)=>setFormData({...formData, hallPrice: e.target.value})} className="w-full p-5 bg-blue-50 rounded-2xl outline-none font-black text-2xl text-blue-700 border-2 border-blue-100 focus:border-blue-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 ml-2 uppercase">Slug (URL)</label>
                  <input required value={formData.slug} onChange={(e)=>setFormData({...formData, slug: e.target.value})} className="w-full p-5 bg-slate-100 rounded-2xl outline-none font-bold text-lg text-slate-600" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 ml-2 uppercase">ប្រភេទឈុតម្ហូប</label>
                <select required value={formData.categoryId} onChange={(e)=>setFormData({...formData, categoryId: e.target.value})} className="w-full p-5 bg-slate-100 rounded-2xl outline-none font-black text-lg border-2 border-transparent focus:border-slate-300">
                  <option value="">-- សូមជ្រើសរើសប្រភេទ --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.translations?.kh?.name}</option>)}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isUploading || isVideoUploading} 
                className="w-full bg-[#B48C00] text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-[#8e6f00] hover:-translate-y-1 transition-all flex justify-center items-center gap-4"
              >
                {(isUploading || isVideoUploading) ? <Loader2 className="animate-spin" size={30}/> : <><Check strokeWidth={4} /> រក្សាទុកទិន្នន័យ</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}