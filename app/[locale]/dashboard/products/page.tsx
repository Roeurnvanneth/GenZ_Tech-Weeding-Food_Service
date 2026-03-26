"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, MoreVertical, Package, DollarSign } from "lucide-react";

export default function ProductsPage() {
  const [products] = useState([
    { id: 1, name: "Premium Khmer Set", category: "Traditional", price: 180, status: "Active", tables: "Min 30" },
    { id: 2, name: "Royal Chinese Banquet", category: "International", price: 250, status: "Active", tables: "Min 20" },
    { id: 3, name: "Western Wedding Buffet", category: "Western", price: 300, status: "Draft", tables: "Min 50" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Wedding Menus</h1>
          <p className="text-slate-500 text-sm">Manage your food packages and pricing.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#B48C00] text-white px-4 py-2 rounded-xl font-bold hover:bg-yellow-700 transition-all shadow-lg">
          <Plus size={20} /> Add New Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-slate-200 relative">
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#B48C00]">
                 {item.category}
               </div>
               <div className="flex items-center justify-center h-full text-slate-400">
                  <Package size={48} />
               </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-green-600 font-bold">
                  <DollarSign size={16} /> {item.price}<span className="text-xs text-slate-400 font-normal">/table</span>
                </div>
                <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                  {item.tables}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}