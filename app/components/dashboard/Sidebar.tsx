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
  ChevronRight,
  Settings,
  Store,
  PartyPopper,
  PackageSearch,
  ClipboardList,
} from "lucide-react";

export default function Sidebar() {
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push(`/${locale}/login`);
  };

  // Logic: Products are categorized into Categories, Menus, and Sets
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
      group: "Products",
      items: [
        {
          name: "Product ",
          icon: <Layers size={18} />,
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
    <aside className="w-72 bg-[#0F172A] text-slate-300 h-screen flex flex-col shrink-0 sticky top-0 border-r border-slate-800 shadow-2xl">
      {/* --- Branding Section --- */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg shadow-yellow-500/10">
            <Store className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">
              SOKCHEA <span className="text-yellow-500">THEAVY</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">
              Admin Control Panel
            </p>
          </div>
        </div>
      </div>

      {/* --- Navigation Scroll Area --- */}
      <nav className="flex-1 px-4 space-y-7 overflow-y-auto pb-8 custom-scrollbar">
        {navigation.map((group) => (
          <div key={group.group} className="space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-yellow-500/10 text-white border-l-4 border-yellow-500"
                        : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`${isActive ? "text-yellow-500" : "text-slate-500 group-hover:text-yellow-500"}`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold">{item.name}</span>
                    </div>
                    {isActive && (
                      <div className="w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,1)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* --- Profile & Sign Out --- */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-slate-800/30 rounded-2xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center text-xs font-bold text-yellow-500">
            ADM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              Main Administrator
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              system@sokchea.com
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-200 group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
}
