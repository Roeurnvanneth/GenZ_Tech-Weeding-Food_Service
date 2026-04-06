"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  ChevronDown, 
  Settings, 
  Shield, 
  Globe, 
  Mail 
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { locale } = useParams();

  // បិទ Dropdown ពេលចុចខាងក្រៅ
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
    localStorage.removeItem("token");
    router.push(`/${locale}/login`);
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-50 font-khmer">
      
      {/* --- Search Bar Section --- */}
      <div className="relative w-72 lg:w-[400px] group hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
        </div>
        <input
          type="text"
          placeholder="ស្វែងរកការកក់ ឬទិន្នន័យផ្សេងៗ..."
          className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 focus:bg-white outline-none transition-all text-sm font-medium"
        />
      </div>

      {/* --- Right Actions Section --- */}
      <div className="flex items-center gap-2 lg:gap-4 ml-auto">
        
        {/* Language Switcher (Optional) */}
        <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all hidden sm:flex items-center gap-2 border border-transparent hover:border-slate-100">
          <Globe size={18} />
          <span className="text-xs font-black uppercase tracking-widest">{locale}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-active:scale-95">
              <User size={20} strokeWidth={2.5} />
            </div>
            
            <div className="text-left hidden lg:block">
              <p className="text-[13px] font-black text-slate-800 leading-none">សុខជា ធាវី សុភ័ក្រ</p>
              <div className="flex items-center gap-1 mt-1.5">
                 <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded uppercase tracking-tighter">Super Admin</span>
              </div>
            </div>

            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu Area */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-[22px] shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-slate-50 mb-2">
                <p className="text-sm font-black text-slate-800">ព័ត៌មានគណនី</p>
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                  <Mail size={12} />
                  <p className="text-[11px] font-medium truncate">admin@catering-pro.com</p>
                </div>
              </div>

              <div className="px-2 space-y-1">
                <DropdownItem icon={<User size={16}/>} label="កែប្រែព័ត៌មានផ្ទាល់ខ្លួន" />
                <DropdownItem icon={<Settings size={16}/>} label="ការកំណត់ប្រព័ន្ធ" />
                <DropdownItem icon={<Shield size={16}/>} label="សុវត្ថិភាពគណនី" />
              </div>

              <div className="mt-3 pt-2 px-2 border-t border-slate-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 rounded-xl font-black transition-colors"
                >
                  <LogOut size={16} />
                  <span>ចាកចេញពីប្រព័ន្ធ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Sub-component សម្រាប់ Dropdown Items ឱ្យកូដខ្លីងាយស្រួលមើល
function DropdownItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
      <span className="opacity-70">{icon}</span>
      {label}
    </button>
  );
}