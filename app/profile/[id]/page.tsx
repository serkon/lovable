"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { getUserById } from "@/lib/actions/userActions";
import { MOCK_PROFILES, Profile, EducationId, MaritalStatusId, IntentionId } from "@/lib/mock-data";
import Image from "next/image";

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { language, sendLike } = useAppStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const id = params.id as string;

            // 1. Try fetching from DB
            try {
                const dbUser = await getUserById(id);
                if (dbUser) {
                    const mapped: Profile = {
                        id: dbUser.id,
                        name: dbUser.name || "",
                        age: dbUser.age || 0,
                        location: dbUser.city || "",
                        distance: 0,
                        job: dbUser.job?.name || "",
                        education: dbUser.education as EducationId,
                        maritalStatus: dbUser.maritalStatus as MaritalStatusId,
                        intention: dbUser.intention as IntentionId,
                        bio: dbUser.bio || "",
                        hobbies: dbUser.hobbies.map(h => h.name),
                        imageUrl: dbUser.imageUrl || "",
                        iceBreaker: ""
                    };
                    setProfile(mapped);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("DB fetch failed", err);
            }

            // 2. Fallback to mock profiles if id is a number string
            const mockId = parseInt(id);
            if (!isNaN(mockId)) {
                const mock = MOCK_PROFILES.find(p => p.id === mockId);
                if (mock) {
                    setProfile(mock);
                    setLoading(false);
                    return;
                }
            }

            setLoading(false);
        };

        loadProfile();
    }, [params.id]);

    const handleLike = () => {
        if (profile) {
            sendLike(profile);
            alert(getLabel('match_success_subtitle', language, { name: profile.name }));
        }
    };

    const handleShare = async () => {
        if (!profile) return;
        const shareData = {
            title: `${profile.name} - ${getLabel('app_name', language)}`,
            text: `${profile.name} (${profile.age}) seni bekliyor!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                alert(getLabel('share_success', language));
            }
        } catch (err) {
            console.error("Share failed:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <Typography variant="h2" className="text-gray-800 mb-2">Profil Bulunamadı</Typography>
                <Typography variant="body" className="text-gray-500 mb-6">Aradığınız kişi artık aramızda olmayabilir.</Typography>
                <Link href="/dashboard">
                    <Button className="bg-purple-600">Keşfetmeye Geri Dön</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Dynamic Header */}
            <header className="bg-white/80 backdrop-blur-md h-16 px-4 flex justify-between items-center sticky top-0 z-40 border-b border-purple-50">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="w-6 h-6 text-purple-600" />
                </Button>
                <Typography variant="h3" className="text-purple-700 font-bold">{profile.name}</Typography>
                <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full">
                    <Share2 className="w-5 h-5 text-gray-400" />
                </Button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Photo Card */}
                <Card className="overflow-hidden rounded-[40px] border-none shadow-2xl relative aspect-[3/4]">
                    <Image
                        src={profile.imageUrl}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 text-white p-2">
                        <Typography variant="h1" className="text-3xl font-bold flex items-center gap-2">
                            {profile.name}, {profile.age}
                        </Typography>
                        <div className="flex items-center gap-1.5 opacity-90 mt-1">
                            <MapPin className="w-4 h-4 text-purple-300" />
                            <p className="text-sm font-medium">{profile.location}</p>
                        </div>
                    </div>
                </Card>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-3xl border border-purple-50 flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-xl">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{getLabel('job', language)}</p>
                            <p className="text-sm font-semibold truncate">{profile.job}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-3xl border border-purple-50 flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-xl">
                            <GraduationCap className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{getLabel('education', language)}</p>
                            <p className="text-sm font-semibold truncate">{getLabel(profile.education, language)}</p>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="bg-white p-6 rounded-[32px] border border-purple-50 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <Typography variant="h3" className="text-lg font-bold text-gray-800">{getLabel('bio', language)}</Typography>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {profile.bio}
                    </p>
                </div>

                {/* Hobbies Section */}
                <div className="bg-white p-6 rounded-[32px] border border-purple-50 shadow-sm space-y-4">
                    <Typography variant="h3" className="text-lg font-bold text-gray-800">{getLabel('hobbies', language)}</Typography>
                    <div className="flex flex-wrap gap-2">
                        {profile.hobbies.map((hobby) => (
                            <span
                                key={hobby}
                                className="px-4 py-2 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100"
                            >
                                {hobby}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Floating Actions */}
                <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center gap-4 z-50">
                    <Button
                        onClick={handleLike}
                        className="h-16 w-full max-w-[200px] rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-200 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-lg font-bold"
                    >
                        <Heart className="w-6 h-6 fill-white" />
                        {getLabel('like', language)}
                    </Button>

                    <Button
                        variant="outline"
                        className="h-16 w-16 rounded-full border-purple-100 bg-white text-purple-600 shadow-xl shadow-purple-50 hover:bg-purple-50 transition-all"
                    >
                        <MessageCircle className="w-7 h-7" />
                    </Button>
                </div>
            </main>
        </div>
    );
}
