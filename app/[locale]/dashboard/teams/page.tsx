"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, User } from "lucide-react";

export default function TeamPage() {
  // 1. Mock Data for Wedding Service Team
  const [team] = useState([
    {
      id: 1,
      name: "Sok Sopheap",
      khName: "សុខ សុភាព",
      role: "Executive Chef",
      khRole: "មេចុងភៅ",
      category: "Our Team",
      createdAt: "3/26/2026",
      image: "", // You can add actual image URLs here
    },
    {
      id: 2,
      name: "Keo Pisey",
      khName: "កែវ ពិសី",
      role: "Service Manager",
      khRole: "អ្នកគ្រប់គ្រងសេវាកម្ម",
      category: "Facility Team",
      createdAt: "3/25/2026",
      image: "",
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Team Members</h1>
        <button className="flex items-center gap-2 bg-[#B48C00] text-white px-4 py-2 rounded-xl font-bold hover:bg-yellow-700 transition-all shadow-lg">
          <Plus size={20} /> New Team Member
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by team member name or role..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {/* TEAM TABLE */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Team Member</th>
              <th className="px-6 py-4 font-semibold">Photo</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Created At</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                {/* NAME (English & Khmer) */}
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700">{member.name}</p>
                  <p className="text-sm text-slate-400 font-khmer">{member.khName}</p>
                </td>

                {/* PHOTO */}
                <td className="px-6 py-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-slate-400" />
                    )}
                  </div>
                </td>

                {/* ROLE */}
                <td className="px-6 py-4">
                  <p className="text-slate-600 text-sm font-medium">{member.role}</p>
                  <p className="text-xs text-slate-400 font-khmer">{member.khRole}</p>
                </td>

                {/* CATEGORY */}
                <td className="px-6 py-4 text-sm text-slate-500">
                  {member.category}
                </td>

                {/* CREATED AT */}
                <td className="px-6 py-4 text-sm text-slate-500">
                  {member.createdAt}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 text-sm font-medium">
                      Edit
                    </button>
                    <button className="px-3 py-1 border border-red-100 rounded text-red-500 hover:bg-red-50 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}