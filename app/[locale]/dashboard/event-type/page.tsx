"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Upload,
  ImageIcon,
  Search,
} from "lucide-react";

type EventType = {
  id: number;
  event_type_name_en: string;
  event_type_name_kh: string;
  cover_image?: string | null;
};

export default function EventTypePage() {
  const API = "/api/admin/event-types";

  const [data, setData] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nameEn, setNameEn] = useState("");
  const [nameKh, setNameKh] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const reset = () => {
    setNameEn("");
    setNameKh("");
    setFile(null);
    setPreview(null);
    setEditId(null);
    setOpen(false);
  };

  const onEdit = (item: EventType) => {
    setEditId(item.id);
    setNameEn(item.event_type_name_en);
    setNameKh(item.event_type_name_kh);
    setPreview(item.cover_image || null);
    setOpen(true);
  };

  const onSubmit = async () => {
    if (!nameEn || !nameKh) {
      alert("Please fill all fields");
      return;
    }
    setSubmitLoading(true);
    try {
      if (!editId) {
        const formData = new FormData();
        formData.append("event_type_name_en", nameEn);
        formData.append("event_type_name_kh", nameKh);
        if (file) formData.append("image", file);
        await fetch(API, { method: "POST", body: formData });
      } else {
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type_name_en: nameEn,
            event_type_name_kh: nameKh,
            cover_image: preview,
          }),
        });
      }
      reset();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-[#b88c14] text-white p-4 rounded-2xl font-bold text-xl">Ψ 9</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">ប្រភេទកម្មវិធី</h1>
            <p className="text-gray-400 text-xs tracking-wide">MANAGEMENT DASHBOARD V2.0</p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-[#b88c14] text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium hover:opacity-90 transition-all shadow-md"
        >
          <Plus size={20} /> បន្ថែមប្រភេទកម្មវិធីថ្មី
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white mb-6 px-6 py-4 rounded-full shadow-sm border border-gray-100 flex items-center gap-3 text-gray-400">
        <Search size={20} />
        <input 
          placeholder="ស្វែងរកឈ្មោះមុខម្ហូប..." 
          className="w-full outline-none text-gray-700"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-4 px-8 py-4 bg-gray-50 text-gray-400 text-sm font-semibold border-b">
          <div>មុខម្ហូប</div>
          <div>តម្លៃ USD / KHR</div>
          <div>ស្ថានភាព</div>
          <div className="text-right">សកម្មភាព</div>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-[#b88c14]" />
          </div>
        ) : (
          <div className="divide-y">
            {data.map((item) => (
              <div key={item.id} className="grid grid-cols-4 items-center px-8 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {item.cover_image ? (
                    <img src={item.cover_image} className="w-14 h-14 rounded-2xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-800">{item.event_type_name_en}</div>
                    <div className="text-sm text-gray-500">{item.event_type_name_kh}</div>
                  </div>
                </div>
                <div className="text-gray-500">-</div>
                <div className="text-gray-500">-</div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => onEdit(item)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">{editId ? "កែសម្រួលមុខម្ហូប" : "បង្កើតមុខម្ហូបថ្មី"}</h2>
              <button onClick={reset} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <label className="h-40 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center rounded-2xl mb-6 cursor-pointer hover:border-[#b88c14] transition-colors">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <div className="flex flex-col items-center text-gray-400 gap-2">
                  <Upload size={32} />
                  <span className="text-sm">Upload Image</span>
                </div>
              )}
              <input type="file" hidden onChange={onFileChange} />
            </label>

            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="English name"
              className="w-full bg-gray-50 border-transparent p-4 rounded-xl mb-3 focus:ring-2 focus:ring-[#b88c14] outline-none"
            />
            <input
              value={nameKh}
              onChange={(e) => setNameKh(e.target.value)}
              placeholder="Khmer name"
              className="w-full bg-gray-50 border-transparent p-4 rounded-xl mb-6 focus:ring-2 focus:ring-[#b88c14] outline-none"
            />

            <button
              onClick={onSubmit}
              disabled={submitLoading}
              className="w-full bg-[#b88c14] text-white py-4 rounded-xl font-bold flex justify-center hover:opacity-90 transition-all"
            >
              {submitLoading ? <Loader2 className="animate-spin" /> : (editId ? "រក្សាទុកការកែប្រែ" : "បង្កើត")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}