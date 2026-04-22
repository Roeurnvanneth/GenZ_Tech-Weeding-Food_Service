"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { messages, Language } from '../../i18n/messages';
import { TeamHeader } from '../../components/teamheader';
import { Menbere } from 'next/font/google';
import Footer from '@/app/components/footer';

export default function AboutPage() {
    const params = useParams();
    const locale = params.locale as string;
    const lang = (locale === 'en' || locale === 'kh' ? locale : 'en') as Language;
    const t = messages[lang];

    // រក្សាទុក State នៃ Tab នៅទីនេះ ដើម្បីឱ្យ Page ទាំងមូលដឹងថា Tab ណាខ្លះកំពុង Active
    const [activeTab, setActiveTab] = useState<'managers' | 'ourTeam'>('managers');


    //start fetch API
    const [teamDate, setTeamDate] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/api/teams');
                const result = await response.json();
                if (result.success) {
                    setTeamDate(result.data);
                }
            }catch (error) {
                console.error("Error fetching team:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);
    

    return (
        <div className={`min-h-screen bg-white text-[#333333] ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            {/* Hero Banner */}
            <section className="relative h-[400px] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img src="/service.webp" className="w-full h-full object-cover" alt="About hero" />
                    <div className="absolute inset-0 bg-black/30"></div> {/* បន្ថែម Overlay បន្តិចឱ្យអក្សរ Header លេច */}
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
                {/* Story Section */}
                <section className="grid md:grid-cols-2 gap-10 items-start">
                    <div className="space-y-6">
                        <h2 className="text-[#B99808] text-3xl font-bold">{t.AboutUs}</h2>
                        <p className="text-lg leading-relaxed whitespace-pre-line font-medium">{t.storyTitle}</p>
                    </div>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed">{t.p1}</p>
                        <p className="text-base leading-relaxed">{t.p2}</p>
                        <p className="text-base leading-relaxed">{t.p3}</p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="rounded-2xl overflow-hidden border-2 border-[#B99808]/20 shadow-2xl">
                        <img src="/neagteav.jpg" className="w-full h-[500px] object-cover" alt="Our Mission" />
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                        <h3 className="text-[#B99808] text-xl font-bold uppercase tracking-widest">{t.missionLabel}</h3>
                        <h2 className="text-3xl font-bold leading-tight">{t.missionTitle}</h2>
                        <p className="text-gray-500 max-w-md mx-auto md:mx-0">{t.missionDesc}</p>
                    </div>
                </section>

                {/* Team Section (ចំណុចដែលអ្នកចង់ដាក់ Button) */}
                <section className="py-20 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#B99808] mb-4">
                        {t.teamwork}
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-xl leading-relaxed mb-10">
                        {t.OurChef}
                    </p>

                    {/* បញ្ចូល TeamHeader និងបញ្ជូន Props ទៅឱ្យវា */}
                    <TeamHeader t={t} active={activeTab} setActive={setActiveTab} />

                <div className="mt-12 w-full transition-opacity duration-500">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {teamDate
                                .filter((member) => {
                                    // កូដនេះសម្រាប់ឆែកថា តើវាជា Manager ឬ Team ធម្មតា (ឆែកតាម slug ឬ field role ក្នុង DB របស់អ្នក)
                                    const isManager = member.slug.includes('manager'); // ឧទាហរណ៍: ប្រសិនបើ slug មាន "manager" នោះវាជា Manager
                                    return activeTab === 'managers' ? isManager : !isManager;
                                })
                                .map((member) => (
                                    <div key={member.id} className="p-2 border border-gray-100 rounded-xl shadow-sm">
                                    <img
                                        src={member.image}
                                        className="w-full h-64 object-cover rounded-lg mb-2"
                                        alt="Member profile"
                                        // បន្ថែមកូដខាងក្រោមនេះ
                                        onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + member.translations[lang]?.name + "&background=random";
                                        }}
                                        />
                                        <p className="font-bold text-[#333333]">
                                            {member.tranlations}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {member.tranlations}
                                        </p>
                                    </div>
                                ))
                                }
                        </div>
                    ) }
                </div>
                </section>
            </main>
        </div>
    );
}