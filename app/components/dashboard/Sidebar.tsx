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
  Store,
  PartyPopper,
  Tags,
  Package,
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
      group: "ផ្ទាំងគ្រប់គ្រង (Dashboard)",
      items: [
        {
          name: "ការវិភាគទិន្នន័យ",
          icon: <LayoutDashboard size={22} />,
          href: `/${locale}/dashboard`,
        },
        {
          name: "បញ្ជីការកក់",
          icon: <CalendarCheck size={22} />,
          href: `/${locale}/dashboard/booking`,
        },
      ],
    },
    {
      group: "ផលិតផល និង កាតាឡុក",
      items: [
        {
          name: "ប្រភេទផលិតផល",
          icon: <Tags size={22} />,
          href: `/${locale}/dashboard/categories`,
        },
        {
          name: "ទំនិញ/ផលិតផល", 
          icon: <Package size={22} />,
          href: `/${locale}/dashboard/products`,
        },
      ],
    },
    {
      group: "ការគ្រប់គ្រងទូទៅ",
      items: [
        {
          name: "ក្រុមការងារ",
          icon: <Users size={22} />,
          href: `/${locale}/dashboard/teams`,
        },
      ],
    },
  ];

  return (
    <aside className="w-80 bg-[#0F172A] h-screen flex flex-col shrink-0 sticky top-0 border-r border-slate-700 shadow-2xl z-50 font-khmer">
      {/* --- Branding Section --- */}
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500 rounded-2xl shadow-xl shadow-yellow-500/20">
            <Store className="text-slate-900" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none uppercase">
              សុខជា <span className="text-yellow-500">ធារី</span>
            </h1>
            <p className="text-[11px] text-yellow-500/60 font-bold tracking-[0.1em] uppercase mt-2">
              ADMIN CONTROL PANEL
            </p>
          </div>
        </div>
      </div>

      {/* --- Navigation Scroll Area --- */}
      <nav className="flex-1 px-4 space-y-10 overflow-y-auto pb-8 custom-scrollbar">
        {navigation.map((group) => (
          <div key={group.group} className="space-y-4">
            <p className="px-5 text-xs font-black text-slate-500 uppercase tracking-widest border-l-4 border-yellow-500/30 ml-1">
              {group.group}
            </p>
            <div className="space-y-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                      isActive
                        ? "bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 font-bold scale-[1.02]"
                        : "hover:bg-white/5 text-slate-100 hover:text-yellow-500"
                    }`}
                  >
                    <span className={`${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-yellow-500"}`}>
                      {item.icon}
                    </span>
                    <span className="text-[15px] font-medium tracking-wide leading-none">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* --- Profile & Sign Out --- */}
      <div className="p-6 bg-slate-900/60 border-t border-slate-700/50">
        <div className="flex items-center gap-4 px-4 py-4 mb-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-11 h-11 rounded-xl bg-yellow-500 flex items-center justify-center text-sm font-black text-slate-900 shadow-inner">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate uppercase">
              អ្នកគ្រប់គ្រង
            </p>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Online Now</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-5 py-4 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-200 font-bold group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[15px] uppercase tracking-wider">ចាកចេញពីប្រព័ន្ធ</span>
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 20px;
        }
      `}</style>
    </aside>
  );
}