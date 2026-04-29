"use client";
import { use, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { messages, Language } from "../../i18n/messages";
import {
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  ShoppingBag,
  DollarSign,
} from "lucide-react";

export default function BookingPage({
  params,
}: {
  params: Promise<{ locale: Language }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.locale;
  const t = messages[lang] || messages["kh"];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    location: "",
    guestCount: 10,
  });

  const [error, setError] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    location: "",
    guestCount: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cartData");
    const savedTotal = localStorage.getItem("cartTotal");
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedTotal) setTotalPrice(Number(savedTotal));
  }, []);

  const handleNextStep = () => {
    let newError = {
      name: "",
      phone: "",
      date: "",
      time: "",
      location: "",
      guestCount: "",
    };
    let hasError = false;

    if (!formData.name.trim()) {
      newError.name =
        lang === "kh"
          ? "សូមបញ្ចូលឈ្មោះរបស់អ្នក"
          : "Please enter your name";
      hasError = true;
    }
    if (!formData.phone.trim()) {
      newError.phone =
        lang === "kh"
          ? "សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក"
          : "Please enter your phone number";
      hasError = true;
    }
    if (!formData.date.trim()) {
      newError.date =
        lang === "kh"
          ? "សូមបញ្ចូលកាលបរិច្ឆេទកម្មវិធី"
          : "Please enter the event date";
      hasError = true;
    }

    setError(newError);

    if (hasError) {
      toast.error(
        lang === "kh"
          ? "សូមបំពេញព័ត៌មានដែលចាំបាច់!"
          : "Please fill in the required fields!"
      );
      return;
    }

    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!formData.name || !formData.phone || !formData.date) {
      toast.error(
        lang === "kh"
          ? "សូមបំពេញព័ត៌មានឱ្យគ្រប់គ្រាន់!"
          : "Please fill in all required fields!"
      );
      return;
    }

    setLoading(true);
    try {
      // ✅ FIXED PAYLOAD STRUCTURE from new logic
      const payload = {
        customerName: formData.name,
        phoneNumber: formData.phone,
        eventDate: `${formData.date}T${formData.time || "00:00"}`,
        location: formData.location,
        guestCount: Number(formData.guestCount),
        totalPrice: totalPrice,
        items: cartItems
          .filter((i) => i?.id)
          .map((i) => ({
            productId: Number(i.id),
            quantity: Number(i.tables || 1),
          })),
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          lang === "kh" ? "ការកក់ជោគជ័យ!" : "Booking Successful!"
        );
        localStorage.removeItem("cartData");
        localStorage.removeItem("cartTotal");
        setTimeout(() => {
          window.location.href = `/${lang}`;
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const isKh = lang === "kh";

  return (
    <div
      className={`min-h-screen bg-[#FAF7F2] ${isKh ? "font-khmer" : "font-sans"}`}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "12px", fontWeight: 700 },
        }}
      />

      <main className="max-w-2xl mx-auto py-14 px-6">
        {/* ---- PROGRESS INDICATOR ---- */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <StepDot
            number={1}
            active={step === 1}
            done={step > 1}
            label={isKh ? "ព័ត៌មាន" : "Details"}
          />
          <div
            className={`h-0.5 w-16 rounded-full transition-all duration-500 ${
              step > 1 ? "bg-[#B48C00]" : "bg-slate-200"
            }`}
          />
          <StepDot
            number={2}
            active={step === 2}
            done={false}
            label={isKh ? "បញ្ជាក់" : "Confirm"}
          />
        </div>

        {step === 1 ? (
          /* ============ STEP 1: FORM ============ */
          <div className="bg-white rounded-3xl shadow-md border border-amber-100/60 overflow-hidden">
            <div className="bg-[#5C1A0B] px-8 py-6">
              <h1 className="text-2xl font-black text-white tracking-tight">
                {isKh ? "ព័ត៌មានការកក់" : "Booking Details"}
              </h1>
              <p className="text-amber-200/70 text-sm mt-1 font-medium">
                {isKh
                  ? "សូមបំពេញព័ត៌មានខាងក្រោម"
                  : "Please fill in the information below"}
              </p>
            </div>

            <div className="px-8 py-8 space-y-5">
              {/* Name */}
              <div>
                <Field
                  icon={<User size={18} />}
                  label={isKh ? "ឈ្មោះអតិថិជន *" : "Full Name *"}
                >
                  <input
                    name="name"
                    value={formData.name}
                    placeholder={
                      isKh ? "បញ្ចូលឈ្មោះរបស់អ្នក" : "Enter your full name"
                    }
                    className="w-full bg-transparent outline-none text-slate-800 font-semibold placeholder:text-slate-300 placeholder:font-normal"
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (error.name) setError({ ...error, name: "" });
                    }}
                  />
                </Field>
                {error.name && (
                  <p className="text-red-500 text-xs mt-1 ml-2 italic">
                    {error.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Field
                  icon={<Phone size={18} />}
                  label={isKh ? "លេខទូរស័ព្ទ *" : "Phone Number *"}
                >
                  <input
                    name="phone"
                    value={formData.phone}
                    placeholder={
                      isKh ? "ឧ. +855 12 345 678" : "e.g. +855 12 345 678"
                    }
                    className="w-full bg-transparent outline-none text-slate-800 font-semibold placeholder:text-slate-300 placeholder:font-normal"
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (error.phone) setError({ ...error, phone: "" });
                    }}
                  />
                </Field>
                {error.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-2 italic">
                    {error.phone}
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field
                    icon={<Calendar size={18} />}
                    label={isKh ? "កាលបរិច្ឆេទ *" : "Event Date *"}
                  >
                    <input
                      name="date"
                      value={formData.date}
                      type="date"
                      className="w-full bg-transparent outline-none text-slate-800 font-semibold"
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        if (error.date) setError({ ...error, date: "" });
                      }}
                    />
                  </Field>
                  {error.date && (
                    <p className="text-red-500 text-xs mt-1 ml-2 italic">
                      {error.date}
                    </p>
                  )}
                </div>

                <Field
                  icon={<Clock size={18} />}
                  label={isKh ? "ម៉ោង" : "Time"}
                >
                  <input
                    name="time"
                    value={formData.time}
                    type="time"
                    className="w-full bg-transparent outline-none text-slate-800 font-semibold"
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </Field>
              </div>

              {/* Location */}
              <Field
                icon={<MapPin size={18} />}
                label={isKh ? "ទីតាំងកម្មវិធី" : "Event Location"}
              >
                <input
                  name="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder={
                    isKh
                      ? "ឧ. ភ្នំពេញ, ខណ្ឌចំការមន"
                      : "e.g. Phnom Penh, Chamkarmon"
                  }
                  className="w-full bg-transparent outline-none text-slate-800 font-semibold placeholder:text-slate-300 placeholder:font-normal"
                />
              </Field>

              {/* Cart Summary */}
              {cartItems.length > 0 && (
                <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#B48C00]/15 flex items-center justify-center text-[#B48C00]">
                      <ShoppingBag size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[#B48C00]">
                        {isKh ? "ម្ហូបដែលបានជ្រើស" : "Selected Menu"}
                      </p>
                      <p className="text-slate-600 font-bold text-sm">
                        {cartItems.length} {isKh ? "មុខ" : "items"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold">
                      {isKh ? "តម្លៃសរុប" : "Total"}
                    </p>
                    <p className="text-xl font-black text-emerald-600">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleNextStep}
                className="w-full py-4 bg-[#5C1A0B] hover:bg-[#7A2210] text-white font-black rounded-2xl mt-2 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#5C1A0B]/20 active:scale-[0.98]"
              >
                {isKh ? "បន្តទៅមុខ" : "Continue"}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          /* ============ STEP 2: CONFIRM ============ */
          <div className="bg-white rounded-3xl shadow-md border border-amber-100/60 overflow-hidden">
            <div className="bg-[#5C1A0B] px-8 py-6">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {isKh ? "បញ្ជាក់ការកក់" : "Confirm Booking"}
              </h2>
              <p className="text-amber-200/70 text-sm mt-1 font-medium">
                {isKh
                  ? "សូមពិនិត្យព័ត៌មានមុននឹងបញ្ជាក់"
                  : "Please review your details before confirming"}
              </p>
            </div>

            <div className="px-8 py-8 space-y-5">
              {/* Summary rows */}
              <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                <SummaryRow
                  icon={<User size={16} />}
                  label={isKh ? "ឈ្មោះ" : "Full Name"}
                  value={formData.name || "—"}
                />
                <SummaryRow
                  icon={<Phone size={16} />}
                  label={isKh ? "លេខទូរស័ព្ទ" : "Phone"}
                  value={formData.phone || "—"}
                />
                <SummaryRow
                  icon={<Calendar size={16} />}
                  label={isKh ? "កាលបរិច្ឆេទ" : "Date"}
                  value={formData.date || "—"}
                />
                {formData.time && (
                  <SummaryRow
                    icon={<Clock size={16} />}
                    label={isKh ? "ម៉ោង" : "Time"}
                    value={formData.time}
                  />
                )}
                {formData.location && (
                  <SummaryRow
                    icon={<MapPin size={16} />}
                    label={isKh ? "ទីតាំង" : "Location"}
                    value={formData.location}
                  />
                )}
              </div>

              {/* Cart items breakdown */}
              {cartItems.length > 0 && (
                <div className="rounded-2xl border border-amber-100 overflow-hidden divide-y divide-amber-50">
                  <div className="px-5 py-3 bg-amber-50 flex items-center gap-2">
                    <ShoppingBag size={15} className="text-[#B48C00]" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#B48C00]">
                      {isKh ? "ម្ហូបដែលបានជ្រើស" : "Order Summary"}
                    </p>
                  </div>
                  {cartItems
                    .filter((i) => i?.id)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-5 py-3 bg-white"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {item.name || `Item #${item.id}`}
                          </p>
                          <p className="text-xs text-slate-400">
                            {isKh ? "តុ" : "qty"}: {item.tables || 1}
                          </p>
                        </div>
                        {item.price_usd && (
                          <p className="text-sm font-black text-slate-800">
                            ${Number(item.price_usd).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <DollarSign size={17} />
                  </div>
                  <p className="font-black text-slate-700 text-sm uppercase tracking-wider">
                    {isKh ? "តម្លៃសរុប" : "Total Price"}
                  </p>
                </div>
                <p className="text-2xl font-black text-emerald-600">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <ChevronLeft size={20} />
                  {isKh ? "ត្រឡប់ក្រោយ" : "Back"}
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="flex-[2] py-4 bg-[#B48C00] hover:bg-[#9A7800] disabled:opacity-60 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B48C00]/25 active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block" />
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      {isKh ? "បញ្ជាក់ការកក់" : "Confirm Booking"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---- Helper Components ---- */

function StepDot({
  number,
  active,
  done,
  label,
}: {
  number: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border-2 transition-all duration-300 ${
          done
            ? "bg-[#B48C00] border-[#B48C00] text-white"
            : active
              ? "bg-[#5C1A0B] border-[#5C1A0B] text-white shadow-lg shadow-[#5C1A0B]/20"
              : "bg-white border-slate-200 text-slate-300"
        }`}
      >
        {done ? <CheckCircle size={16} /> : number}
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${
          active ? "text-[#5C1A0B]" : "text-slate-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
        <span className="text-[#B48C00]">{icon}</span>
        {label}
      </label>
      <div className="flex items-center gap-3 border-2 border-slate-100 focus-within:border-[#B48C00] focus-within:bg-amber-50/30 bg-slate-50/50 rounded-2xl px-4 py-3.5 transition-all">
        {children}
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-2.5 text-slate-400">
        <span className="text-[#B48C00]">{icon}</span>
        <span className="text-xs font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="font-black text-slate-800 text-sm">{value}</span>
    </div>
  );
}