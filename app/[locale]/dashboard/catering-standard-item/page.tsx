"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, ChefHat, Search, DollarSign, Loader2 } from "lucide-react";

interface CateringStandardItem {
  id: number;
  catering_standard_id: number | string;
  menu_item_id: number | string;
  price_usd: string | number;
  price_khr: string | number;
  menuItem?: { name_en: string; name_km?: string };
  cateringStandard?: { catering_standard_name_en: string };
}

interface FormState {
  catering_standard_id: string;
  menu_item_id: string;
  price_usd: string;
  price_khr: string;
}

const EMPTY_FORM: FormState = {
  catering_standard_id: "",
  menu_item_id: "",
  price_usd: "",
  price_khr: "",
};

export default function CateringStandardItemPage() {
  const [data, setData] = useState<CateringStandardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [standards, setStandards] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const API_URL = "/api/admin/catering-standard-items";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
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
    fetch("/api/admin/catering-standards")
      .then((r) => r.json())
      .then((d) => setStandards(d.data || []));
    fetch("/api/admin/menu-items")
      .then((r) => r.json())
      .then((d) => setMenus(d.data || []));
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.catering_standard_id) newErrors.catering_standard_id = "Required";
    if (!form.menu_item_id) newErrors.menu_item_id = "Required";
    if (!form.price_usd || isNaN(Number(form.price_usd))) newErrors.price_usd = "Valid USD price required";
    if (!form.price_khr || isNaN(Number(form.price_khr))) newErrors.price_khr = "Valid KHR price required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setOpenModal(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: CateringStandardItem) => {
    setEditingId(item.id);
    setForm({
      catering_standard_id: String(item.catering_standard_id),
      menu_item_id: String(item.menu_item_id),
      price_usd: String(item.price_usd),
      price_khr: String(item.price_khr),
    });
    setErrors({});
    setOpenModal(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setOpenModal(true);
  };

  const filtered = data.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.menuItem?.name_en?.toLowerCase().includes(q) ||
      item.cateringStandard?.catering_standard_name_en?.toLowerCase().includes(q)
    );
  });

  const inputClass = (field: keyof FormState) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400"
    }`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap');
        .page-root { font-family: 'Sora', 'Noto Sans Khmer', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .modal-enter { animation: scaleIn 0.25s cubic-bezier(.34,1.56,.64,1) both; }
        .row-hover:hover { background: #fffbf0; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: .04em; }
        .shimmer { background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        .btn-primary { background: linear-gradient(135deg, #b45309, #d97706); box-shadow: 0 2px 12px #d9770640; }
        .btn-primary:hover { background: linear-gradient(135deg, #92400e, #b45309); box-shadow: 0 4px 18px #d9770660; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }
      `}</style>

      <div className="page-root p-6 space-y-5 min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">

        {/* ── HEADER ── */}
        <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm border border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                Catering Standard Items
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-0.5">
                គ្រប់គ្រងមុខម្ហូប — Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition w-52"
              />
            </div>
            {/* Add button */}
            <button
              onClick={openCreate}
              className="btn-primary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} />
              <span>បន្ថែមថ្មី</span>
            </button>
          </div>
        </div>
        {/* ── TABLE ── */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animationDelay: "100ms" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-stone-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Menu Item</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Standard</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Price (USD)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Price (KHR)</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-5">
                        <div className={`h-4 rounded-lg shimmer ${j === 1 ? "w-36" : j === 2 ? "w-28" : "w-16"}`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <ChefHat size={36} strokeWidth={1.2} />
                      <p className="font-medium">No items found</p>
                      <p className="text-xs">Try adjusting your search or add a new item.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="row-hover transition-colors duration-150"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">#{item.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{item.menuItem?.name_en ?? `Menu #${item.menu_item_id}`}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge bg-amber-50 text-amber-700 border border-amber-200">
                        {item.cateringStandard?.catering_standard_name_en ?? `Standard #${item.catering_standard_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-emerald-700">${Number(item.price_usd).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-600">៛{Number(item.price_khr).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
              <span className="font-semibold text-gray-600">{data.length}</span> items
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="modal-enter bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                  {editingId ? <Pencil size={14} className="text-white" /> : <Plus size={16} className="text-white" />}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">
                    {editingId ? "Edit Item" : "Add New Item"}
                  </h2>
                  <p className="text-xs text-gray-400">{editingId ? "កែសម្រួលមុខម្ហូប" : "បន្ថែមមុខម្ហូបថ្មី"}</p>
                </div>
              </div>
              <button onClick={() => setOpenModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-7 py-6 space-y-4">
              {/* Catering Standard */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catering Standard <span className="text-red-400">*</span></label>
                <select
                  value={form.catering_standard_id}
                  onChange={(e) => { setForm({ ...form, catering_standard_id: e.target.value }); setErrors({ ...errors, catering_standard_id: "" }); }}
                  className={inputClass("catering_standard_id")}
                >
                  <option value="">— Select Standard —</option>
                  {standards.map((s) => (
                    <option key={s.id} value={s.id}>{s.catering_standard_name_en}</option>
                  ))}
                </select>
                {errors.catering_standard_id && <p className="text-red-500 text-xs">{errors.catering_standard_id}</p>}
              </div>

              {/* Menu Item */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Menu Item <span className="text-red-400">*</span></label>
                <select
                  value={form.menu_item_id}
                  onChange={(e) => { setForm({ ...form, menu_item_id: e.target.value }); setErrors({ ...errors, menu_item_id: "" }); }}
                  className={inputClass("menu_item_id")}
                >
                  <option value="">— Select Menu Item —</option>
                  {menus.map((m) => (
                    <option key={m.id} value={m.id}>{m.name_en}</option>
                  ))}
                </select>
                {errors.menu_item_id && <p className="text-red-500 text-xs">{errors.menu_item_id}</p>}
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price USD <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.price_usd}
                      onChange={(e) => { setForm({ ...form, price_usd: e.target.value }); setErrors({ ...errors, price_usd: "" }); }}
                      className={`${inputClass("price_usd")} pl-7`}
                    />
                  </div>
                  {errors.price_usd && <p className="text-red-500 text-xs">{errors.price_usd}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price KHR <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">៛</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.price_khr}
                      onChange={(e) => { setForm({ ...form, price_khr: e.target.value }); setErrors({ ...errors, price_khr: "" }); }}
                      className={`${inputClass("price_khr")} pl-7`}
                    />
                  </div>
                  {errors.price_khr && <p className="text-red-500 text-xs">{errors.price_khr}</p>}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-7 py-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? "Saving..." : "រក្សាទុក / Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="modal-enter bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Delete Item?</h3>
              <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}