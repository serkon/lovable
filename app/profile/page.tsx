"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Camera, Save, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MARITAL_STATUSES, EDUCATIONS, INTENTIONS, MaritalStatusId, EducationId, IntentionId } from "@/lib/mock-data";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";

export default function ProfilePage() {
    const { language } = useAppStore();
    const [bio, setBio] = useState("Huzurlu bir hayat süren, doğa aşığı ve kitap kurdu biriyim. Yeni yerler keşfetmeyi severim.");
    const [selectedHobbies, setSelectedHobbies] = useState(["Gezi, Doğa & Kamp", "Kültür, Sanat & Kitap"]);
    const [maritalStatus, setMaritalStatus] = useState<MaritalStatusId>("ms_divorced");
    const [education, setEducation] = useState<EducationId>("edu_bachelors");
    const [intention, setIntention] = useState<IntentionId>("int_chat");

    const hobbiesList = [
        "Gezi, Doğa & Kamp", "Kültür, Sanat & Kitap", "Sinema & Tiyatro",
        "Müzik & Dans", "Yemek & Gurme", "Spor, Yoga & Pilates",
        "Psikoloji & Kişisel Gelişim", "Tavla & Sosyal Oyunlar",
        "Bahçe İşleri", "Balık Tutma", "El Sanatları"
    ];

    const toggleHobby = (hobby: string) => {
        setSelectedHobbies(prev =>
            prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
            {/* Header */}
            <header className="h-20 px-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </Button>
                    </Link>
                    <Typography variant="h3" className="text-gray-900 font-bold">{language === 'tr' ? 'Profilimi Düzenle' : 'Edit My Profile'}</Typography>
                </div>
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Settings className="w-6 h-6 text-gray-600" />
                    </Button>
                </Link>
            </header>

            <main className="max-w-2xl mx-auto w-full p-6 space-y-8">
                {/* Profile Photo Section */}
                <section className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop"
                                alt="Profil Fotoğrafı"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <Typography variant="h2" className="text-xl font-bold">Ayşe, 48</Typography>
                </section>

                {/* Bio Section */}
                <section className="space-y-3">
                    <Typography variant="h3" className="text-base font-semibold text-gray-700">{getLabel('bio', language)}</Typography>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full h-32 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-white"
                        placeholder={language === 'tr' ? 'Kendinizden bahsedin...' : 'Tell us about yourself...'}
                    />
                </section>

                {/* Status & Intention Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Typography variant="h3" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{getLabel('intention', language)}</Typography>
                        <select
                            value={intention}
                            onChange={(e) => setIntention(e.target.value as IntentionId)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            {INTENTIONS.map(i => <option key={i} value={i}>{getLabel(i, language)}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Typography variant="h3" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{getLabel('education', language)}</Typography>
                        <select
                            value={education}
                            onChange={(e) => setEducation(e.target.value as EducationId)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            {EDUCATIONS.map(e => <option key={e} value={e}>{getLabel(e, language)}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Typography variant="h3" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{getLabel('maritalStatus', language)}</Typography>
                        <select
                            value={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.value as MaritalStatusId)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            {MARITAL_STATUSES.map(s => <option key={s} value={s}>{getLabel(s, language)}</option>)}
                        </select>
                    </div>
                </section>

                {/* Hobbies Section */}
                <section className="space-y-3">
                    <Typography variant="h3" className="text-base font-semibold text-gray-700">Hobiler</Typography>
                    <div className="flex flex-wrap gap-2">
                        {hobbiesList.map(hobby => (
                            <button
                                key={hobby}
                                onClick={() => toggleHobby(hobby)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    selectedHobbies.includes(hobby)
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                                        : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
                                )}
                            >
                                {hobby}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Save Button */}
                <div className="pt-6">
                    <Button className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-lg font-bold shadow-xl shadow-purple-100 flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        {getLabel('save', language)}
                    </Button>
                </div>
            </main>
        </div>
    );
}
