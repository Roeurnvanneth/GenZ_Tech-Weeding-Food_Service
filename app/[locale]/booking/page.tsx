"use client";

import { useState, useMemo } from 'react';
import Header from '../../components/header';
import { messages, Language } from '../../i18n/messages';
import Footer from '@/app/components/footer';

// Static prices for calculation (In real app, fetch these from /api/products)
const PRICE_PER_FOOD = 150; 
const PRICE_PER_TENT = 50;

export default function BookingPage() {
    const [lang, setLang] = useState<Language>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // 1. Initial Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
        location: "",
        method: "Phone",
        programType: "Wedding",
        guestCount: 10,
        foodProductId: "1",
        tentProductId: "5"
    });

    const t = messages[lang];
    const toggleLang = () => setLang(prev => (prev === 'kh' ? 'en' : 'kh'));

    // 2. Dynamic Price Calculation
    const totalPrice = useMemo(() => {
        const count = Number(formData.guestCount) || 0;
        const foodPrice = formData.foodProductId ? PRICE_PER_FOOD : 0;
        const tentPrice = formData.tentProductId ? PRICE_PER_TENT : 0;
        return (foodPrice + tentPrice) * count;
    }, [formData.guestCount, formData.foodProductId, formData.tentProductId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. API Submission Logic
    const handleConfirmBooking = async () => {
        if (!formData.name || !formData.phone || !formData.date || !formData.time) {
            alert(lang === 'kh' ? "សូមបំពេញព័ត៌មានដែលចាំបាច់!" : "Please fill in all required fields!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lang: lang,
                    customerName: formData.name,
                    phoneNumber: formData.phone,
                    programType: formData.programType,
                    programDate: formData.date,
                    programTime: formData.time,
                    location: formData.location,
                    guestCount: Number(formData.guestCount),
                    contactMethod: formData.method,
                    foodProductId: Number(formData.foodProductId),
                    tentProductId: Number(formData.tentProductId),
                    totalPrice: totalPrice, // Sending calculated total to API
                    startDateTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
                    endDateTime: new Date(new Date(`${formData.date}T${formData.time}`).getTime() + 8 * 60 * 60 * 1000).toISOString(),
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(lang === 'kh' ? "ការកក់ជោគជ័យ!" : "Booking Successful!");
                window.location.href = "/"; 
            } else {
                alert(result.error || "Error");
            }
        } catch (error) {
            alert("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-white ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            <Header lang={lang} toggleLang={toggleLang} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={null} />

            <section className="relative h-[250px] md:h-[350px] flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover brightness-50" alt="Hero" />
                <div className="relative z-10 text-center">
                    <h1 className="text-white text-3xl md:text-5xl font-bold uppercase border-2 border-white px-8 py-2">
                        {step === 1 ? t.btnMore : t.ci}
                    </h1>
                </div>
            </section>

            <main className="max-w-4xl mx-auto py-12 px-6">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.labelName} *</label>
                                    <input name="name" onChange={handleChange} value={formData.name} type="text" className="p-3 border text-black rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20" placeholder="Sopheak Nary" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.labelPhone} *</label>
                                    <input name="phone" onChange={handleChange} value={formData.phone} type="tel" className="p-3 border text-black rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20" placeholder="012345678" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.pt}</label>
                                    <select name="programType" onChange={handleChange} value={formData.programType} className="p-3 border text-black rounded-lg bg-white outline-none">
                                        <option value="Wedding">{t.wedding}</option>
                                        <option value="Birthday">{t.birthday}</option>
                                        <option value="Party">{t.party}</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.gtCount}</label>
                                    <input name="guestCount" onChange={handleChange} value={formData.guestCount} type="number" className="p-3 border text-black rounded-lg outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.labelDate} *</label>
                                    <input name="date" onChange={handleChange} value={formData.date} type="date" min={new Date().toISOString().split("T")[0]} className="p-3 border text-black rounded-lg outline-none" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.labelTime} *</label>
                                    <input name="time" onChange={handleChange} value={formData.time} type="time" className="p-3 border text-black rounded-lg outline-none" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black">{t.labelLocation}</label>
                                <input name="location" onChange={handleChange} value={formData.location} type="text" className="p-3 border text-black rounded-lg outline-none" placeholder="Phnom Penh, Sen Sok..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.fID}</label>
                                    <input name="foodProductId" onChange={handleChange} value={formData.foodProductId} type="number" className="p-3 border text-black rounded-lg outline-none" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-black">{t.tID}</label>
                                    <input name="tentProductId" onChange={handleChange} value={formData.tentProductId} type="number" className="p-3 border text-black rounded-lg outline-none" />
                                </div>
                            </div>

                            {/* LIVE PRICE PREVIEW */}
                            <div className="bg-[#8B0000]/5 p-5 rounded-2xl border border-[#8B0000]/20 flex justify-between items-center">
                                <span className="font-bold text-black text-lg">{lang === 'kh' ? "តម្លៃសរុបស្មាន:" : "Estimated Total:"}</span>
                                <span className="text-3xl font-bold text-[#8B0000]">${totalPrice.toLocaleString()}</span>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full py-4 bg-[#8B0000] text-white font-bold rounded-xl hover:bg-[#2F10DC] transition shadow-lg active:scale-95">
                                {t.btnContinue}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in zoom-in duration-500">
                        <div className="bg-white border rounded-3xl p-8 shadow-xl text-center space-y-6">
                            <h2 className="text-2xl font-bold text-black">{t.ci}</h2>
                            
                            <div className="bg-gray-50 rounded-2xl p-6 text-left grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 border border-gray-100">
                                <p className="text-black"><strong>{t.labelName}:</strong> {formData.name}</p>
                                <p className="text-black"><strong>{t.e}:</strong> {formData.programType}</p>
                                <p className="text-black"><strong>{t.labelDate}:</strong> {formData.date}</p>
                                <p className="text-black"><strong>{t.gtCount}:</strong> {formData.guestCount}</p>
                                <p className="text-black col-span-2"><strong>{t.labelLocation}:</strong> {formData.location}</p>
                                <div className="col-span-2 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-xl font-bold text-black">{lang === 'kh' ? "តម្លៃសរុបចុងក្រោយ" : "Final Total Price"}</span>
                                    <span className="text-3xl font-bold text-[#8B0000]">${totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-xl text-black hover:bg-gray-100 font-bold transition">
                                    {t.back}
                                </button>
                                <button onClick={handleConfirmBooking} disabled={loading} className={`flex-[2] py-3 rounded-xl font-bold text-white transition shadow-lg active:scale-95 ${loading ? 'bg-gray-400' : 'bg-[#8B0000] hover:bg-[#2F10DC]'}`}>
                                    {loading ? (lang === 'kh' ? "កំពុងរក្សាទុក..." : "Saving...") : t.smbooking}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer t={t} lang={lang} />
        </div>
    );
}