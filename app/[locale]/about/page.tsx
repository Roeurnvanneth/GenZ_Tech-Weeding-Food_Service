"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { messages, Language } from '../../i18n/messages';
import { TeamHeader } from '../../components/teamheader';

// ✅ Map URL locale ("kh") → API translation key ("km")
function getApiLangKey(lang: string): string {
    const map: Record<string, string> = {
        en: 'en',
        kh: 'km', // URL uses "kh", but your API stores "km"
    };
    return map[lang] ?? 'en';
}

export default function AboutPage() {
    const params = useParams();
    const locale = params.locale as string;
    const lang = (locale === 'en' || locale === 'kh' ? locale : 'en') as Language;
    const t = messages[lang];

    // The key used inside member.translations → "en" or "km"
    const apiLang = getApiLangKey(lang);

    const [activeTab, setActiveTab] = useState<'managers' | 'ourTeam'>('managers');
    const [teamData, setTeamData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/api/teams');
                const result = await response.json();
                if (result.success) {
                    setTeamData(result.data);
                }
            } catch (error) {
                console.error('Error fetching team:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    // ✅ slug "Our manager" and "Our managers" both match the managers tab
    const filteredMembers = teamData.filter((member) => {
        const slugLower = member.slug?.toLowerCase() ?? '';
        const isManager = slugLower.includes('manager');
        return activeTab === 'managers' ? isManager : !isManager;
    });

    return (
        <div className={`min-h-screen bg-white text-[#333333] ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>

            {/* Hero Banner */}
            <section className="relative h-[400px] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img src="/pic.jpg" className="w-full h-full object-cover" alt="About hero" />
                    <div className="absolute inset-0 bg-black/30" />
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

                {/* Team Section */}
                <section className="py-20 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#B99808] mb-4">
                        {t.teamwork}
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-xl leading-relaxed mb-10">
                        {t.OurChef}
                    </p>

                    <TeamHeader t={t} active={activeTab} setActive={setActiveTab} />

                    <div className="mt-12 w-full transition-opacity duration-500">
                        {loading ? (

                            /* Loading Skeleton */
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="animate-pulse p-3 border border-gray-100 rounded-2xl shadow-sm">
                                        <div className="w-full h-64 bg-gray-200 rounded-xl mb-3" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                                        <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                                    </div>
                                ))}
                            </div>

                        ) : filteredMembers.length === 0 ? (
                            <p className="text-gray-400 text-lg py-10">No members found.</p>

                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {filteredMembers.map((member) => {

                                    // ✅ Read from correct language key ("en" or "km")
                                    // Falls back to English if the km translation is missing
                                    const translation =
                                        member.translations?.[apiLang] ??
                                        member.translations?.['en'] ??
                                        {};

                                    const name = translation.name?.trim() || 'Unknown';
                                    const role = translation.role?.trim() || '';

                                    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=B99808&color=fff&size=256`;

                                    return (
                                        <div
                                            key={member.id}
                                            className="group relative p-3 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
                                        >
                                            {/* Profile Image */}
                                            <div className="relative overflow-hidden rounded-xl mb-3">
                                                <img
                                                    src={member.image || avatarFallback}
                                                    className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                                                    alt={name}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = avatarFallback;
                                                    }}
                                                />
                                                {/* Gold gradient overlay on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#B99808]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                                            </div>

                                            {/* Name */}
                                            <p className="font-bold text-[#333333] text-sm md:text-base leading-tight truncate px-1">
                                                {name}
                                            </p>

                                            {/* Role / Position */}
                                            {role && (
                                                <p className="text-xs md:text-sm text-[#B99808] font-medium mt-0.5 truncate px-1">
                                                    {role}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}