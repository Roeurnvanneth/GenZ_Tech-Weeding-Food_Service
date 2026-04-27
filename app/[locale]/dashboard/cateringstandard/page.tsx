"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  X,
  Package,
  Camera,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";

/* ================= TYPES ================= */
type MenuItemRow = {
  menu_item_id: number;
  price_usd: number;
  price_khr: number;
};

type CateringStandard = {
  id: number;
  catering_standard_name_en: string;
  catering_standard_name_kh: string;
  description?: string;
  is_special: boolean;
  cover_image?: string | null;
  items: any[];
};

export default function CateringStandardsPage() {
  const BASE_API = "/api/admin/catering-standards";

  const [data, setData] = useState<CateringStandard[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  /* ================= FORM ================= */
  const [eventTypeId, setEventTypeId] = useState("1"); // Default event type
  const [nameEn, setNameEn] = useState("");
  const [nameKh, setNameKh] = useState("");
  const [description, setDescription] = useState("");
  const [isSpecial, setIsSpecial] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemRow[]>([]);

  /* ================= IMAGE ================= */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_API);
      const json = await res.json();
      const list = json?.data ?? [];
      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setEditId(null);
    setEventTypeId("1");
    setNameEn("");
    setNameKh("");
    setDescription("");
    setIsSpecial(false);
    setMenuItems([]);
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async () => {
    if (!nameEn || !nameKh) {
      alert("Please fill required fields");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("event_type_id", eventTypeId);
      formData.append("catering_standard_name_en", nameEn);
      formData.append("catering_standard_name_kh", nameKh);
      formData.append("description", description);
      formData.append("is_special", isSpecial ? "true" : "false");
      formData.append("menu_items", JSON.stringify(menuItems));
      
      if (imageFile) {
        formData.append("cover_image", imageFile);
      }

      const url = editId ? `${BASE_API}/${editId}` : BASE_API;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData, // Don't set Content-Type header
      });

      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Operation failed");
      }

      setOpen(false);
      resetForm();
      fetchData();
      alert(editId ? "Updated successfully!" : "Created successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const onDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BASE_API}/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchData();
        alert("Deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const onEdit = async (item: CateringStandard) => {
    try {
      const res = await fetch(`${BASE_API}/${item.id}`);
      const json = await res.json();
      const data = json?.data;

      setEditId(data.id);
      setEventTypeId(String(data.event_type_id || 1));
      setNameEn(data.catering_standard_name_en || "");
      setNameKh(data.catering_standard_name_kh || "");
      setDescription(data.description || "");
      setIsSpecial(data.is_special || false);
      setImagePreview(data.cover_image || null);
      setImageFile(null);

      setMenuItems(
        data.items?.map((i: any) => ({
          menu_item_id: i.menu_item_id,
          price_usd: i.price_usd,
          price_khr: i.price_khr,
        })) || []
      );

      setOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-[#b88c14] p-4 rounded-2xl text-white">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">គ្រប់គ្រងមុខម្ហូប</h1>
            <p className="text-gray-400 text-xs">MANAGEMENT DASHBOARD V2.0</p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="bg-[#b88c14] text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-[#9e7610] transition-colors"
        >
          <Plus size={20} /> បន្ថែមមុខម្ហូបថ្មី
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#b88c14]" size={32} />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No data found. Click "Add New" to create.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b">
                <th className="p-4 text-left w-24">រូបភាព</th>
                <th className="p-4 text-left">មុខម្ហូប</th>
                <th className="p-4 text-left">តម្លៃ USD/KHR</th>
                <th className="p-4 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  {/* IMAGE CELL */}
                  <td className="p-4">
                    {item.cover_image ? (
                      <img
                        src={item.cover_image}
                        alt={item.catering_standard_name_en}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-bold">
                    {item.catering_standard_name_en}
                    <div className="text-xs text-gray-400 font-normal">
                      {item.catering_standard_name_kh}
                    </div>
                    {item.is_special && (
                      <span className="inline-block mt-1 text-xs bg-[#b88c14]/10 text-[#b88c14] px-2 py-0.5 rounded-full">
                        Special
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.items?.length || 0} Items
                  </td>

                  <td className="p-4 flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg p-8 rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editId ? "Update Package" : "បន្ថែមមុខម្ហូបថ្មី"}
              </h2>
              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                រូបភាព
              </p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-200 rounded-2xl h-40 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#b88c14] transition-colors bg-gray-50"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <span className="bg-[#b88c14]/90 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                        <Camera size={14} /> Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 pointer-events-none">
                    <div className="w-12 h-12 bg-[#b88c14]/10 rounded-full flex items-center justify-center">
                      <Camera size={22} className="text-[#b88c14]" />
                    </div>
                    <span className="text-sm font-medium">Upload Image</span>
                    <span className="text-xs opacity-60">PNG, JPG, WEBP</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onFileChange}
                />
              </div>
            </div>

            {/* FORM FIELDS */}
            <input
              className="w-full p-3 bg-gray-50 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-[#b88c14]/30 border border-transparent focus:border-[#b88c14] transition-all"
              placeholder="English Name *"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />

            <input
              className="w-full p-3 bg-gray-50 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-[#b88c14]/30 border border-transparent focus:border-[#b88c14] transition-all"
              placeholder="Khmer Name *"
              value={nameKh}
              onChange={(e) => setNameKh(e.target.value)}
            />

            <textarea
              className="w-full p-3 bg-gray-50 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-[#b88c14]/30 border border-transparent focus:border-[#b88c14] transition-all"
              placeholder="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpecial}
                onChange={(e) => setIsSpecial(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#b88c14] focus:ring-[#b88c14]"
              />
              <span className="text-sm text-gray-700">Special Package</span>
            </label>

            {/* SUBMIT BUTTONS */}
            <button
              onClick={onSubmit}
              disabled={saving}
              className="w-full bg-[#b88c14] text-white py-3 rounded-xl mt-2 font-bold hover:bg-[#9e7610] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving...</span>
                </>
              ) : (
                editId ? "Update Package" : "Create Package"
              )}
            </button>

            <button
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="w-full mt-2 text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}