"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  ChefHat,
  Users,
  LogOut,
  UtensilsCrossed,
  ShieldCheck,
  Layers,
  Store,
  PartyPopper,
  Tags, // Icon for Categories
} from "lucide-react";

export default function Sidebar() {
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push(`/${locale}/login`);
  };

  const navigation = [
    {
      group: "Dashboard",
      items: [
        {
          name: "Analytics",
          icon: <LayoutDashboard size={18} />,
          href: `/${locale}/dashboard`,
        },
        {
          name: "Booking List",
          icon: <CalendarCheck size={18} />,
          href: `/${locale}/dashboard/booking`,
        },
      ],
    },
    {
      group: "Products & Catalog",
      items: [
        {
          name: "Categories", // NEW: Added Categories
          icon: <Tags size={18} />,
          href: `/${locale}/dashboard/categories`,
        },
        {
          name: "Menus",
          icon: <ChefHat size={18} />,
          href: `/${locale}/dashboard/menus`,
        },
        {
          name: "Catering Packages",
          icon: <UtensilsCrossed size={18} />,
          href: `/${locale}/dashboard/caterings`,
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          name: "Event Types",
          icon: <PartyPopper size={18} />,
          href: `/${locale}/dashboard/event-types`,
        },
        {
          name: "Service Standards",
          icon: <ShieldCheck size={18} />,
          href: `/${locale}/dashboard/standards`,
        },
        {
          name: "Teams",
          icon: <Users size={18} />,
          href: `/${locale}/dashboard/teams`,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-[#0F172A] text-slate-300 h-screen flex flex-col shrink-0 sticky top-0 border-r border-slate-800 shadow-2xl z-50">
      {/* --- Branding Section --- */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/20">
            <Store className="text-[#0F172A]" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none uppercase">
              SOKCHEA <span className="text-yellow-500">THEAVY</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-black tracking-[0.2em] uppercase mt-1.5">
              Admin Control Panel
            </p>
          </div>
        </div>
      </div>

      {/* --- Navigation Scroll Area --- */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto pb-8 custom-scrollbar">
        {navigation.map((group) => (
          <div key={group.group} className="space-y-3">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.25em]">
              {group.group}
            </p>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-5 py-3.5 rounded-[1.25rem] transition-all duration-300 group ${
                      isActive
                        ? "bg-yellow-500 text-[#0F172A] shadow-lg shadow-yellow-500/10 font-bold"
                        : "hover:bg-slate-800/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`${isActive ? "text-[#0F172A]" : "text-slate-500 group-hover:text-yellow-500 transition-colors"}`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm tracking-tight">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* --- Profile & Sign Out --- */}
      <div className="p-6 bg-slate-900/40 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-4 py-4 mb-4 bg-[#1e293b]/30 rounded-[1.5rem] border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-sm font-black text-[#0F172A]">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate uppercase tracking-tighter">
              Administrator
            </p>
            <p className="text-[10px] text-slate-500 truncate font-bold">
              Active Session
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-5 py-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-200 group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-black uppercase tracking-widest">Logout</span>
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 20px;
        }
      `}</style>
    </aside>
  );
}