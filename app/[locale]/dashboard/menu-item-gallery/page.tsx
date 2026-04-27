"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, Loader2 } from "lucide-react";

/* ================= CONFIG ================= */
const BASE_URL = "/api/admin/menu-item-gallery";
const MENU_API = "/api/admin/menu-items";

/* ================= TYPES ================= */
type MenuItem = {
  id: number;
  menu_item_name_en: string;
};

type Gallery = {
  id: number;
  image: string;
  menu_item_id: number;
  menuItem: MenuItem;
};

/* ================= COMPONENT ================= */
export default function MenuItemGalleryPage() {
  const [data, setData] = useState<Gallery[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);

  const [form, setForm] = useState({
    menu_item_id: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);

    try {
      const [galleryRes, menuRes] = await Promise.all([
        fetch(BASE_URL),
        fetch(MENU_API),
      ]);

      const galleryJson = await galleryRes.json();
      const menuJson = await menuRes.json();

      setData(galleryJson.data || []);
      setMenus(menuJson.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FAST UPLOAD ================= */
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("images", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    return json.data.urls[0];
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately (fast!)
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      // Upload in background
      const url = await uploadImage(file);
      setForm({ ...form, image: url });
      // Replace temp preview with actual URL
      setPreview(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.menu_item_id || !form.image) {
      alert("All fields required");
      return;
    }

    setSubmitting(true);

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `${BASE_URL}/${editing.id}`
        : BASE_URL;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu_item_id: Number(form.menu_item_id),
          image: form.image,
        }),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Operation failed");
      }

      resetForm();
      fetchData();
      alert(editing ? "Image updated successfully!" : "Image created successfully!");
    } catch (err) {
      console.error(err);
      alert("Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      fetchData();
      alert("Image deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed. Please try again.");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item: Gallery) => {
    setEditing(item);
    setOpenModal(true);

    setForm({
      menu_item_id: String(item.menu_item_id),
      image: item.image,
    });

    setPreview(item.image);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setOpenModal(false);
    setEditing(null);

    setForm({
      menu_item_id: "",
      image: "",
    });

    setPreview("");
  };

  /* ================= UI ================= */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .gallery-root {
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

        .gallery-header-card {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; margin-bottom: 24px;
          border-radius: var(--radius); background: var(--white);
          box-shadow: var(--shadow-sm);
        }
        .gallery-header-left { display: flex; align-items: center; gap: 16px; }
        .gallery-logo-box {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #c9960c 0%, #e6b30a 100%);
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          font-size: 24px; box-shadow: 0 4px 12px rgba(201,150,12,0.30);
        }
        .gallery-header-title {
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 18px; font-weight: 700; color: var(--gray-800);
        }
        .gallery-header-sub {
          font-size: 11px; letter-spacing: 0.08em;
          color: var(--gray-400); text-transform: uppercase; margin-top: 2px;
        }
        .gallery-btn-add {
          display: flex; align-items: center; gap: 8px; padding: 11px 22px;
          background: linear-gradient(135deg, #c9960c 0%, #e6b30a 100%);
          color: #fff; border: none; border-radius: 50px;
          font-family: 'Kantumruy Pro', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; box-shadow: 0 4px 14px rgba(201,150,12,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .gallery-btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,150,12,0.45); }

        .gallery-table-card {
          border-radius: var(--radius); background: var(--white);
          box-shadow: var(--shadow-sm); overflow: hidden;
        }
        .gallery-table-head {
          display: grid; grid-template-columns: 100px 1fr 120px;
          padding: 12px 20px; border-bottom: 1px solid var(--gray-100);
          font-size: 12px; letter-spacing: 0.04em;
          color: var(--gray-400); font-weight: 600; text-transform: uppercase;
        }
        .gallery-table-head span:last-child { text-align: right; }
        .gallery-table-row {
          display: grid; grid-template-columns: 100px 1fr 120px;
          align-items: center; padding: 14px 20px;
          border-bottom: 1px solid var(--gray-100); transition: background 0.15s;
        }
        .gallery-table-row:last-child { border-bottom: none; }
        .gallery-table-row:hover { background: #fdf8ee; }
        .gallery-thumb {
          width: 70px; height: 70px; border-radius: 10px;
          background: var(--gray-100); border: 1px solid var(--gray-200);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-menu-name { font-weight: 600; font-size: 14px; color: var(--gray-800); }
        .gallery-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
        .gallery-btn-icon {
          width: 34px; height: 34px; border-radius: 8px; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }
        .gallery-btn-edit { background: #eff6ff; color: #3b82f6; }
        .gallery-btn-edit:hover { background: #dbeafe; }
        .gallery-btn-del { background: #fff5f5; color: #e53e3e; }
        .gallery-btn-del:hover { background: #fed7d7; }
        .gallery-empty { padding: 60px 20px; text-align: center; color: var(--gray-400); }

        .gallery-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 50;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          backdrop-filter: blur(2px);
        }
        .gallery-modal {
          background: #fff; border-radius: 20px; width: 100%; max-width: 500px;
          max-height: 92vh; overflow-y: auto;
          box-shadow: 0 8px 40px rgba(0,0,0,0.16);
        }
        .gallery-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 24px 16px; border-bottom: 1px solid #f0f0f0;
        }
        .gallery-modal-title {
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 17px; font-weight: 700; color: #222;
        }
        .gallery-btn-close {
          width: 32px; height: 32px; border-radius: 50%; border: none;
          background: #f0f0f0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .gallery-modal-body { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 20px; }
        .gallery-label {
          font-size: 12px; font-weight: 600; color: #666;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .gallery-select {
          width: 100%; padding: 11px 14px; border: 1.5px solid #e2e2e2;
          border-radius: 8px; font-size: 14px; outline: none;
        }
        .gallery-select:focus { border-color: #c9960c; }
        .gallery-upload-zone {
          border: 2px dashed #e2e2e2; border-radius: 14px;
          background: #f8f8f8; position: relative;
          min-height: 140px; display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gallery-upload-zone:hover {
          border-color: #c9960c;
          background: #fdf8ee;
        }
        .gallery-upload-zone input {
          position: absolute; inset: 0; opacity: 0; cursor: pointer;
          width: 100%;
          height: 100%;
        }
        .gallery-preview-img {
          width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px;
        }
        .gallery-upload-loading {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: white;
          gap: 8px;
        }
        .gallery-btn-submit {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #c9960c 0%, #e6b30a 100%);
          color: #fff; border: none; border-radius: 50px;
          cursor: pointer; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s ease;
        }
        .gallery-btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(201,150,12,0.45);
        }
        .gallery-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="gallery-root" style={{ padding: "32px 20px", minHeight: "100vh", background: "#f8f8f8" }}>
        {/* HEADER */}
        <div className="gallery-header-card">
          <div className="gallery-header-left">
            <div className="gallery-logo-box">🖼️</div>
            <div>
              <div className="gallery-header-title">Menu Item Gallery</div>
              <div className="gallery-header-sub">Management Dashboard V2.0</div>
            </div>
          </div>
          <button className="gallery-btn-add" onClick={() => setOpenModal(true)}>
            <Plus size={15} /> Add Image
          </button>
        </div>

        {/* TABLE */}
        <div className="gallery-table-card">
          <div className="gallery-table-head">
            <span>Image</span>
            <span>Menu</span>
            <span>Action</span>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <Loader2 size={28} className="spin" style={{ color: "#c9960c" }} />
            </div>
          ) : data.length === 0 ? (
            <div className="gallery-empty">
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🖼️</div>
              No gallery images yet. Add one!
            </div>
          ) : (
            data.map((item) => (
              <div className="gallery-table-row" key={item.id}>
                <div className="gallery-thumb">
                  {item.image ? (
                    <img src={item.image} alt="gallery" loading="lazy" />
                  ) : (
                    <span style={{ fontSize: "28px" }}>🖼️</span>
                  )}
                </div>
                <div className="gallery-menu-name">
                  {item.menuItem?.menu_item_name_en || "Unknown"}
                </div>
                <div className="gallery-actions">
                  <button className="gallery-btn-icon gallery-btn-edit" onClick={() => handleEdit(item)}>
                    <Pencil size={15} />
                  </button>
                  <button className="gallery-btn-icon gallery-btn-del" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="gallery-backdrop" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="gallery-modal">
            <div className="gallery-modal-header">
              <div className="gallery-modal-title">
                {editing ? "Update" : "Create"} Image
              </div>
              <button className="gallery-btn-close" onClick={resetForm}>
                <X size={16} />
              </button>
            </div>

            <div className="gallery-modal-body">
              {/* MENU SELECT */}
              <div>
                <div className="gallery-label">Select Menu Item</div>
                <select
                  className="gallery-select"
                  value={form.menu_item_id}
                  onChange={(e) => setForm({ ...form, menu_item_id: e.target.value })}
                >
                  <option value="">Select Menu Item</option>
                  {menus.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.menu_item_name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* UPLOAD - FAST WITH INSTANT PREVIEW */}
              <div>
                <div className="gallery-label">Image</div>
                <div className="gallery-upload-zone">
                  <input 
                    type="file" 
                    onChange={handleUpload}
                    accept="image/*"
                    disabled={uploading}
                  />
                  {preview ? (
                    <div style={{ position: "relative", width: "100%" }}>
                      <img src={preview} className="gallery-preview-img" alt="preview" />
                      {uploading && (
                        <div className="gallery-upload-loading">
                          <Loader2 size={20} className="spin" />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "32px" }}>
                      <div style={{ fontSize: "40px" }}>📷</div>
                      <div>Click to upload image</div>
                      <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                        PNG, JPG, WEBP
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SUBMIT */}
              <button
                className="gallery-btn-submit"
                onClick={handleSubmit}
                disabled={submitting || uploading || !form.image}
              >
                {(submitting || uploading) && <Loader2 size={16} className="spin" />}
                {uploading ? "Uploading..." : (editing ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}