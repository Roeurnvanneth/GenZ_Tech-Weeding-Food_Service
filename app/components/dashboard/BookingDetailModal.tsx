"use client";

import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Users,
} from "lucide-react";

export default function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: any;
  onClose: () => void;
}) {
  if (!booking) return null;

  const items: any[] = booking.bookingItems || [];

  const rawDate = booking.eventDate || booking.programDate;
  const displayDate = rawDate
    ? (() => {
        const d = new Date(rawDate);
        return isNaN(d.getTime())
          ? String(rawDate)
          : d.toLocaleDateString("km-KH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
      })()
    : "—";

  const computedTotal = items.reduce((sum, item) => {
    const unitPrice = Number(item?.price ?? item?.product?.price ?? 0);
    return sum + unitPrice * Number(item?.quantity ?? 1);
  }, 0);

  const displayTotal =
    Number(booking.totalPrice) > 0 ? Number(booking.totalPrice) : computedTotal;

  // ✅ No Record, no type annotation — just a plain object
  const statusConfig = {
    Accepted: {
      bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",
      icon: <CheckCircle size={13} />, label: "យល់ព្រម",
    },
    Rejected: {
      bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200",
      icon: <XCircle size={13} />, label: "បដិសេធ",
    },
    Pending: {
      bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200",
      icon: <Clock size={13} />, label: "រង់ចាំ",
    },
  };

  const status = (booking.status ?? "Pending") as keyof typeof statusConfig;
  const s = statusConfig[status] ?? statusConfig.Pending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="bg-[#5C1A0B] px-8 py-6 flex items-start justify-between">
          <div>
            <p className="text-amber-200/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              ព័ត៌មានលម្អិតការកក់
            </p>
            <h2 className="text-2xl font-black text-white leading-tight">
              {booking.customerName}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${s.bg} ${s.text} ${s.border}`}
            >
              {s.icon} {s.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="px-8 py-6 space-y-5 max-h-[72vh] overflow-y-auto">

          {/* Info rows */}
          <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <InfoRow icon={<User size={15} />}     label="ឈ្មោះ"       value={booking.customerName || "—"} />
            <InfoRow icon={<Phone size={15} />}    label="ទូរស័ព្ទ"    value={booking.phoneNumber  || "—"} />
            <InfoRow icon={<MapPin size={15} />}   label="ទីតាំង"      value={booking.location     || "—"} />
            <InfoRow icon={<Calendar size={15} />} label="កាលបរិច្ឆេទ" value={displayDate} />
            <InfoRow
              icon={<Users size={15} />}
              label="ភ្ញៀវ"
              value={`${booking.guestCount ?? 0} នាក់ · ${Math.ceil((booking.guestCount ?? 0) / 10)} តុ`}
            />
          </div>

          {/* ── Products ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3.5 w-1 rounded-full bg-[#B48C00]" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                បញ្ជីផលិតផលដែលបានកក់
              </p>
            </div>

            {items.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 rounded-2xl text-slate-400">
                <Package size={16} />
                <span className="text-sm font-bold">មិនមានផលិតផល</span>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item: any, idx: number) => {
                  const productName =
                    item?.product?.name  ||
                    item?.product?.title ||
                    `ផលិតផល #${item?.productId ?? idx + 1}`;

                  const categoryName =
                    item?.product?.category?.name  ||
                    item?.product?.category?.title ||
                    null;

                  const unitPrice = Number(item?.price ?? item?.product?.price ?? 0);
                  const qty       = Number(item?.quantity ?? 1);
                  const subtotal  = unitPrice * qty;

                  return (
                    <div
                      key={item?.id ?? idx}
                      className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3.5"
                    >
                      {/* Left */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#B48C00]/15 flex items-center justify-center text-[#B48C00] shrink-0">
                          <ShoppingBag size={15} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">
                            {productName}
                          </p>
                          {categoryName && (
                            <span className="inline-block mt-0.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                              {categoryName}
                            </span>
                          )}
                          <p className="text-xs text-slate-400 font-bold mt-0.5">
                            តម្លៃឯកតា:{" "}
                            <span className="text-slate-600">
                              {unitPrice > 0 ? `$${unitPrice.toFixed(2)}` : "—"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="text-right shrink-0 ml-3">
                        <span className="inline-block bg-[#B48C00]/10 text-[#B48C00] text-[11px] font-black px-2.5 py-0.5 rounded-full">
                          x {qty}
                        </span>
                        {subtotal > 0 && (
                          <p className="font-black text-emerald-600 text-sm mt-0.5">
                            ${subtotal.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <DollarSign size={17} />
              </div>
              <p className="font-black text-slate-700 text-sm uppercase tracking-wider">
                តម្លៃសរុប
              </p>
            </div>
            <p className="text-2xl font-black text-emerald-600">
              ${displayTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 bg-white hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-2 text-slate-400 shrink-0">
        <span className="text-[#B48C00]">{icon}</span>
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className="font-black text-slate-800 text-sm text-right ml-4 truncate max-w-[58%]">
        {value}
      </span>
    </div>
  );
}