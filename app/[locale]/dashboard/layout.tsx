import Sidebar from "../../components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Added text-slate-900 to ensure text is visible against bg-slate-50
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Sidebar (Stays on the left) */}
      <Sidebar />

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* 2. Navbar (Stays at the top) */}
        {/* <Navbar /> */}

        {/* 3. Main Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* This is where your Products, Bookings, etc. will show up */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}