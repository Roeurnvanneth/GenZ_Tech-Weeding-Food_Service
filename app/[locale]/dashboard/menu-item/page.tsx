"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

/* ================= CONFIG ================= */
const BASE_URL = "/api/admin/menu-items";

/* ================= TYPES ================= */
// Matches Prisma: MenuItemGallery { image_url: String }
type Gallery = {
  id?: number;
  image_url: string;
};

// Matches Prisma: MenuItem { cover_image: String? }
type MenuItem = {
  id: number;
  menu_item_name_en: string;
  menu_item_name_kh: string;
  cover_image: string | null;   // ✅ correct — matches Prisma schema
  gallery: Gallery[];
};

/* ================= HELPERS ================= */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target?.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

/* ================= COMPONENT ================= */
export default function MenuItemPage() {
  const [data, setData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);

  const [form, setForm] = useState({
    menu_item_name_en: "",
    menu_item_name_kh: "",
  });

  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [gallery, setGallery] = useState<
    { preview: string; file: File | null }[]
  >([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [notify, setNotify] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  /* ================= NOTIFY ================= */
  const showNotify = (msg: string, type: "success" | "error" = "success") => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 2800);
  };

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      showNotify("Cannot load menu items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= COVER IMAGE ================= */
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = await fileToDataUrl(file);
    setCoverPreview(preview);
    setCoverFile(file);
  };

  /* ================= GALLERY ================= */
  const handleGalleryAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = await Promise.all(
      files.map(async (file) => ({
        preview: await fileToDataUrl(file),
        file,
      }))
    );
    setGallery((prev) => [...prev, ...newItems]);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.menu_item_name_en || !form.menu_item_name_kh) {
      showNotify("Please fill required fields", "error");
      return;
    }

    setSubmitting(true);

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${BASE_URL}/${editing.id}` : BASE_URL;

      // ✅ Key fix: send "cover_image" not "cover_image_url"
      const cover_image = coverPreview || null;
      const gallery_images = gallery.map((g) => g.preview).filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu_item_name_en: form.menu_item_name_en,
          menu_item_name_kh: form.menu_item_name_kh,
          cover_image,        // ✅ matches Prisma schema field name
          gallery_images,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || "Request failed");

      showNotify(editing ? "Updated successfully!" : "Created successfully!");
      resetForm();
      fetchData();
    } catch (err: any) {
      showNotify(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showNotify("Deleted successfully!");
      fetchData();
    } catch (err: any) {
      showNotify(err.message, "error");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      menu_item_name_en: item.menu_item_name_en,
      menu_item_name_kh: item.menu_item_name_kh,
    });
    setCoverPreview(item.cover_image || "");  // ✅ correct field
    setCoverFile(null);
    setGallery(
      item.gallery?.length > 0
        ? item.gallery.map((g) => ({ preview: g.image_url, file: null }))
        : []
    );
    setOpenModal(true);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setOpenModal(false);
    setEditing(null);
    setForm({ menu_item_name_en: "", menu_item_name_kh: "" });
    setCoverPreview("");
    setCoverFile(null);
    setGallery([]);
  };

  /* ================= UI ================= */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .mi-root {
          font-family: 'DM Sans', sans-serif;
          --gold: #c9960c;
          --gold-bg: #fdf8ee;
          --white: #ffffff;
          --gray-50: #f8f8f8;
          --gray-100: #f0f0f0;
          --gray-200: #e2e2e2;
          --gray-400: #aaaaaa;
          --gray-600: #666666;
          --gray-800: #222222;
          --red: #e53e3e;
          --shadow-sm: 0 1px 4px rgba(0,0,0,0.07);
          --shadow-lg: 0 8px 40px rgba(0,0,0,0.16);
          --radius: 14px;
        }

        /* HEADER */
        .mi-header-card {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; margin-bottom: 24px;
          border-radius: var(--radius); background: var(--white);
          box-shadow: var(--shadow-sm);
        }
        .mi-header-left { display: flex; align-items: center; gap: 16px; }
        .mi-logo-box {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #c9960c 0%, #e6b30a 100%);
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          font-size: 24px; box-shadow: 0 4px 12px rgba(201,150,12,0.30); flex-shrink: 0;
        }
        .mi-header-title {
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 18px; font-weight: 700; color: var(--gray-800); line-height: 1.2;
        }
        .mi-header-sub {
          font-size: 11px; letter-spacing: 0.08em;
          color: var(--gray-400); text-transform: uppercase; margin-top: 2px;
        }
        .mi-btn-add {
          display: flex; align-items: center; gap: 8px; padding: 11px 22px;
          background: linear-gradient(135deg, #c9960c 0%, #e6b30a 100%);
          color: #fff; border: none; border-radius: 50px;
          font-family: 'Kantumruy Pro', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; box-shadow: 0 4px 14px rgba(201,150,12,0.35);
          transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
        }
        .mi-btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,150,12,0.45); }

        /* TABLE */
        .mi-table-card {
          border-radius: var(--radius); background: var(--white);
          box-shadow: var(--shadow-sm); overflow: hidden;
        }
        .mi-table-head {
          display: grid; grid-template-columns: 80px 1fr 1fr 120px;
          padding: 12px 20px; border-bottom: 1px solid var(--gray-100);
          font-size: 12px; letter-spacing: 0.04em;
          color: var(--gray-400); font-weight: 600; text-transform: uppercase;
        }
        .mi-table-head span:last-child { text-align: right; }
        .mi-table-row {
          display: grid; grid-template-columns: 80px 1fr 1fr 120px;
          align-items: center; padding: 14px 20px;
          border-bottom: 1px solid var(--gray-100); transition: background 0.15s;
        }
        .mi-table-row:last-child { border-bottom: none; }
        .mi-table-row:hover { background: #fdf8ee; }
        .mi-thumb {
          width: 52px; height: 52px; border-radius: 10px;
          background: var(--gray-100); border: 1px solid var(--gray-200);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .mi-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .mi-thumb-placeholder { font-size: 22px; color: var(--gray-400); }
        .mi-name-en { font-weight: 600; font-size: 14px; color: var(--gray-800); }
        .mi-name-kh {
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 13px; color: var(--gray-600); margin-top: 2px;
        }
        .mi-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
        .mi-btn-icon {
          width: 34px; height: 34px; border-radius: 8px; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
        }
        .mi-btn-icon:active { transform: scale(0.92); }
        .mi-btn-edit { background: #eff6ff; color: #3b82f6; }
        .mi-btn-edit:hover { background: #dbeafe; }
        .mi-btn-del { background: #fff5f5; color: #e53e3e; }
        .mi-btn-del:hover { background: #fed7d7; }
        .mi-empty { padding: 60px 20px; text-align: center; color: var(--gray-400); font-size: 14px; }
        .mi-empty-icon { font-size: 40px; margin-bottom: 10px; }

        /* MODAL */
        .mi-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 50;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          backdrop-filter: blur(2px); animation: mi-fadein 0.18s ease;
        }
        @keyframes mi-fadein { from { opacity: 0; } to { opacity: 1; } }
        .mi-modal {
          background: #fff; border-radius: 20px; width: 100%; max-width: 460px;
          max-height: 92vh; overflow-y: auto;
          box-shadow: 0 8px 40px rgba(0,0,0,0.16);
          animation: mi-slideup 0.22s cubic-bezier(.22,1,.36,1);
        }
        @keyframes mi-slideup {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .mi-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 24px 16px; border-bottom: 1px solid #f0f0f0;
          position: sticky; top: 0; background: #fff; z-index: 1;
        }
        .mi-modal-title {
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 17px; font-weight: 700; color: #222;
        }
        .mi-btn-close {
          width: 32px; height: 32px; border-radius: 50%; border: none;
          background: #f0f0f0; color: #666; font-size: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .mi-btn-close:hover { background: #e2e2e2; }
        .mi-modal-body { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 18px; }

        .mi-label {
          font-size: 12px; font-weight: 600; color: #666;
          letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px;
        }

        /* UPLOAD */
        .mi-upload-zone {
          border: 2px dashed #e2e2e2; border-radius: var(--radius);
          background: #f8f8f8; cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          position: relative; overflow: hidden;
          min-height: 140px; display: flex; align-items: center; justify-content: center;
        }
        .mi-upload-zone:hover { border-color: #c9960c; background: #fdf8ee; }
        .mi-upload-zone.has-img { min-height: unset; padding: 0; border-style: solid; border-color: #e2e2e2; }
        .mi-upload-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .mi-upload-placeholder { text-align: center; padding: 24px 16px; }
        .mi-upload-icon {
          width: 48px; height: 48px; background: #f5e6b0; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 10px; font-size: 22px;
        }
        .mi-upload-text { font-size: 14px; font-weight: 500; color: #666; }
        .mi-upload-hint { font-size: 11px; color: #aaa; margin-top: 4px; }
        .mi-cover-preview { width: 100%; max-height: 220px; object-fit: cover; border-radius: 12px; display: block; }
        .mi-cover-change-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.18s; border-radius: 12px;
          color: #fff; font-size: 13px; font-weight: 600; gap: 6px;
        }
        .mi-upload-zone:hover .mi-cover-change-overlay { opacity: 1; }

        /* INPUT */
        .mi-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #e2e2e2;
          border-radius: 8px; font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #222; background: #fff; outline: none;
          transition: border-color 0.18s; box-sizing: border-box;
        }
        .mi-input:focus { border-color: #c9960c; }

        /* GALLERY */
        .mi-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .mi-gallery-item {
          position: relative; border-radius: 10px; overflow: hidden;
          background: #f0f0f0; aspect-ratio: 1; border: 2px solid #e2e2e2;
        }
        .mi-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mi-gallery-remove {
          position: absolute; top: 4px; right: 4px;
          width: 22px; height: 22px; background: rgba(0,0,0,0.55);
          border-radius: 50%; color: #fff; font-size: 11px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 2; border: none; transition: background 0.15s;
        }
        .mi-gallery-remove:hover { background: #e53e3e; }
        .mi-gallery-add {
          display: flex; align-items: center; justify-content: center;
          border: 2px dashed #e2e2e2; border-radius: 10px; aspect-ratio: 1;
          color: #aaa; font-size: 24px; cursor: pointer;
          transition: border-color 0.15s, color 0.15s; background: none; width: 100%;
        }
        .mi-gallery-add:hover { border-color: #c9960c; color: #c9960c; }

        /* SUBMIT */
        .mi-btn-submit {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #c9960c 0%, #e6b30a 100%);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; border: none; border-radius: 50px;
          cursor: pointer; box-shadow: 0 4px 14px rgba(201,150,12,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px;
        }
        .mi-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,150,12,0.45); }
        .mi-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* NOTIFY */
        .mi-notify {
          position: fixed; bottom: 24px; right: 24px; padding: 12px 20px;
          border-radius: 10px; font-size: 14px; font-weight: 500; color: #fff;
          z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.12); animation: mi-fadein 0.2s ease;
        }
        .mi-notify-success { background: #22c55e; }
        .mi-notify-error   { background: #e53e3e; }

        @keyframes mi-spin { to { transform: rotate(360deg); } }
        .mi-spin { animation: mi-spin 0.8s linear infinite; }
      `}</style>

      <div className="mi-root" style={{ padding: "32px 20px", minHeight: "100vh", background: "#f8f8f8" }}>

        {/* ---- HEADER ---- */}
        <div className="mi-header-card">
          <div className="mi-header-left">
            <div className="mi-logo-box">📦</div>
            <div>
              <div className="mi-header-title">គ្រប់គ្រងមុខម្ហូប</div>
              <div className="mi-header-sub">Management Dashboard V2.0</div>
            </div>
          </div>
          <button className="mi-btn-add" onClick={() => { resetForm(); setOpenModal(true); }}>
            <Plus size={15} />
            បន្ថែមមុខម្ហូបថ្មី
          </button>
        </div>

        {/* ---- TABLE ---- */}
        <div className="mi-table-card">
          <div className="mi-table-head">
            <span>រូបភាព</span>
            <span>ឈ្មោះ EN</span>
            <span>ឈ្មោះ KH</span>
            <span>សកម្មភាព</span>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <Loader2 size={28} className="mi-spin" style={{ color: "#c9960c" }} />
            </div>
          ) : data.length === 0 ? (
            <div className="mi-empty">
              <div className="mi-empty-icon">🍽️</div>
              No menu items yet. Add one!
            </div>
          ) : (
            data.map((item) => (
              <div className="mi-table-row" key={item.id}>
                {/* ✅ cover_image — matches Prisma */}
                <div className="mi-thumb">
                  {item.cover_image
                    ? <img src={item.cover_image} alt={item.menu_item_name_en} />
                    : <span className="mi-thumb-placeholder">🖼️</span>}
                </div>

                <div>
                  <div className="mi-name-en">{item.menu_item_name_en}</div>
                </div>

                <div>
                  <div className="mi-name-kh">{item.menu_item_name_kh}</div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                    {item.gallery?.length ?? 0} Items
                  </div>
                </div>

                <div className="mi-actions">
                  <button className="mi-btn-icon mi-btn-edit" onClick={() => handleEdit(item)}>
                    <Pencil size={15} />
                  </button>
                  <button className="mi-btn-icon mi-btn-del" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---- MODAL ---- */}
      {openModal && (
        <div className="mi-backdrop" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="mi-modal">
            <div className="mi-modal-header">
              <div className="mi-modal-title">
                {editing ? "កែប្រែមុខម្ហូប" : "បន្ថែមមុខម្ហូបថ្មី"}
              </div>
              <button className="mi-btn-close" onClick={resetForm}><X size={16} /></button>
            </div>

            <div className="mi-modal-body">

              {/* Cover Image — field: cover_image ✅ */}
              <div>
                <div className="mi-label">រូបភាព</div>
                <div className={`mi-upload-zone ${coverPreview ? "has-img" : ""}`}>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleCoverChange}
                  />
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} className="mi-cover-preview" alt="cover" />
                      <div className="mi-cover-change-overlay">📷 Change Image</div>
                    </>
                  ) : (
                    <div className="mi-upload-placeholder">
                      <div className="mi-upload-icon">📷</div>
                      <div className="mi-upload-text">Upload Image</div>
                      <div className="mi-upload-hint">PNG, JPG, WEBP</div>
                    </div>
                  )}
                </div>
              </div>

              {/* English Name */}
              <div>
                <div className="mi-label">ឈ្មោះជាភាសាអង់គ្លេស *</div>
                <input
                  className="mi-input"
                  placeholder="English Name"
                  value={form.menu_item_name_en}
                  onChange={(e) => setForm({ ...form, menu_item_name_en: e.target.value })}
                />
              </div>

              {/* Khmer Name */}
              <div>
                <div className="mi-label">ឈ្មោះជាភាសាខ្មែរ *</div>
                <input
                  className="mi-input"
                  style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}
                  placeholder="ឈ្មោះខ្មែរ"
                  value={form.menu_item_name_kh}
                  onChange={(e) => setForm({ ...form, menu_item_name_kh: e.target.value })}
                />
              </div>

              {/* Gallery */}
              <div>
                <div className="mi-label">រូបភាពបន្ថែម</div>
                <div className="mi-gallery-grid">
                  {gallery.map((g, i) => (
                    <div className="mi-gallery-item" key={i}>
                      <img src={g.preview} alt={`gallery-${i}`} />
                      <button className="mi-gallery-remove" onClick={() => removeGalleryItem(i)}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button className="mi-gallery-add" onClick={() => galleryInputRef.current?.click()}>
                    ＋
                  </button>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleGalleryAdd}
                  />
                </div>
              </div>

              {/* Submit */}
              <button className="mi-btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 size={16} className="mi-spin" />}
                {editing ? "រក្សាទុក" : "បញ្ចូល"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ---- NOTIFICATION ---- */}
      {notify && (
        <div className={`mi-notify ${notify.type === "success" ? "mi-notify-success" : "mi-notify-error"}`}>
          {notify.msg}
        </div>
      )}
    </>
  );
}