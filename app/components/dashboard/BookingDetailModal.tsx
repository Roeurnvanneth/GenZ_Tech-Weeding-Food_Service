"use client";
import { X, User, Phone, MapPin, Calendar, ListChecks } from "lucide-react";

export default function BookingDetailModal({ booking, onClose }: { booking: any; onClose: () => void }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-black mb-6 text-slate-800">ព័ត៌មានលម្អិតការកក់</h2>
        
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-3"><User size={18} className="text-[#B48C00]"/> <span className="font-bold">{booking.customerName}</span></div>
            <div className="flex items-center gap-3"><Phone size={18} className="text-[#B48C00]"/> <span>{booking.phoneNumber}</span></div>
            <div className="flex items-center gap-3"><MapPin size={18} className="text-[#B48C00]"/> <span>{booking.location}</span></div>
            <div className="flex items-center gap-3"><Calendar size={18} className="text-[#B48C00]"/> <span>{new Date(booking.programDate).toLocaleDateString()}</span></div>
          </div>

          <div>
            <h3 className="font-black mb-3 flex items-center gap-2"><ListChecks size={20} className="text-[#B48C00]"/> បញ្ជីម្ហូបដែលកក់៖</h3>
            <div className="border border-slate-100 rounded-2xl p-4">
              {booking.bookingItems?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between py-2 border-b last:border-0 border-slate-50">
                  <span className="font-bold">{item.menuPricing?.menu?.menu_name ?? "មិនមានឈ្មោះ"}</span>
                  <span className="text-slate-500 font-bold">x {item.quantity ?? 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xl font-black border-t pt-4">
            <span>តម្លៃសរុប:</span>
            <span className="text-emerald-600">${Number(booking.totalPrice).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}