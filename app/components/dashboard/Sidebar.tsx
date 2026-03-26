"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Tags, 
  ChefHat, 
  Users, 
  UserSquare2, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push(`/${locale}/login`);
  };

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: `/${locale}/dashboard` },
    { name: "Bookings", icon: <CalendarCheck size={20} />, href: `/${locale}/dashboard/booking` },
    { name: "Categories", icon: <Tags size={20} />, href: `/${locale}/dashboard/categories` },
    { name: "Products", icon: <ChefHat size={20} />, href: `/${locale}/dashboard/products` },
    { name: "Teams", icon: <Users size={20} />, href: `/${locale}/dashboard/teams` },
    { name: "Customers", icon: <UserSquare2 size={20} />, href: `/${locale}/dashboard/customers` },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col shrink-0 border-r border-slate-800 sticky top-0">
      <div className="p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          GenZ Tech
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Wedding Catering</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-[#B48C00] text-white shadow-lg shadow-yellow-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}