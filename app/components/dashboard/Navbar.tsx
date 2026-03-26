"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { locale } = useParams();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear real session
    router.push(`/${locale}/login`);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-[#B48C00]" size={18} />
        <input
          type="text"
          placeholder="Search bookings..."
          className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-[#B48C00]/10 outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200"
          >
            <div className="w-10 h-10 rounded-full bg-[#B48C00] flex items-center justify-center text-white shadow-lg">
              <User size={20} />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-none">Admin Sopheap</p>
              <p className="text-[10px] text-slate-400 mt-1">Super Admin</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in duration-150">
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-sm font-bold text-slate-800">Sopheap Admin</p>
                <p className="text-[11px] text-slate-500">admin@genztech.com</p>
              </div>
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                  <User size={16} /> Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                  <Settings size={16} /> Account Security
                </button>
              </div>
              <div className="p-2 border-t border-slate-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-bold"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}