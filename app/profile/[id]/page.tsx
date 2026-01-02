"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { getUserById } from "@/lib/actions/userActions";
import { Profile } from "@/lib/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { language, sendLike } = useAppStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const id = params.id as string;
            setImageIndex(0);
            setIsImageLoading(true);

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dbUser = await getUserById(id) as any;
                if (dbUser) {
                    const mapped: Profile = {
                        id: dbUser.id,
                        name: dbUser.name || "",
                        age: dbUser.age || 0,
                        location: dbUser.city || "",
                        distance: 0,
                        job: dbUser.job?.id || "",
                        education: dbUser.education?.id || "edu_elementary",
                        maritalStatus: dbUser.maritalStatus?.id || "ms_private",
                        intention: dbUser.intention?.id || "int_chat",
                        bio: dbUser.bio || "",
                        hobbies: Array.isArray(dbUser.hobbies) ? dbUser.hobbies.map((h: { id: string }) => h.id) : [],
                        imageUrl: dbUser.images?.[0]?.url || "https://via.placeholder.com/400",
                        images: Array.isArray(dbUser.images) ? dbUser.images.map((img: { url: string }) => img.url) : [],
                        iceBreaker: ""
                    };
                    setProfile(mapped);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("DB fetch failed", err);
            }

            setLoading(false);
        };

        loadProfile();
    }, [params.id]);

    const displayImages = profile?.images && profile.images.length > 0
        ? profile.images
        : profile?.imageUrl ? [profile.imageUrl] : [];

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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4" data-testid="profile-loading">
                <Skeleton className="h-[60vh] w-full max-w-md rounded-xl" />
                <div className="w-full max-w-md space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4" data-testid="profile-not-found">
                <h2 className="text-2xl font-bold">Profil Bulunamadı</h2>
                <p className="text-muted-foreground">Aradığınız kişi artık aramızda olmayabilir.</p>
                <Link href="/dashboard">
                    <Button>Keşfetmeye Geri Dön</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20" data-testid="public-profile-page-container">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md h-16 px-4 flex justify-between items-center sticky top-0 z-40 border-b">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h3 className="font-bold text-sm tracking-tight">{profile.name}</h3>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                </Button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6" data-testid="public-profile-main">
                {/* Photo Card */}
                <Card className="overflow-hidden relative aspect-[3/4] p-0 border">
                    {displayImages.length > 1 && (
                        <>
                            <div className="absolute top-4 left-0 right-0 z-30 flex justify-center gap-1 px-4">
                                {displayImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "h-1 rounded-full",
                                            idx === imageIndex ? "bg-white w-8 shadow-sm" : "bg-white/40 w-2"
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="absolute inset-0 z-20 flex">
                                <div
                                    className="w-1/2 h-full cursor-pointer"
                                    onClick={() => setImageIndex((prev) => {
                                        const newIdx = prev > 0 ? prev - 1 : displayImages.length - 1;
                                        if (newIdx !== prev) setIsImageLoading(true);
                                        return newIdx;
                                    })}
                                />
                                <div
                                    className="w-1/2 h-full cursor-pointer"
                                    onClick={() => setImageIndex((prev) => {
                                        const newIdx = prev < displayImages.length - 1 ? prev + 1 : 0;
                                        if (newIdx !== prev) setIsImageLoading(true);
                                        return newIdx;
                                    })}
                                />
                            </div>
                        </>
                    )}

                    <div className="relative w-full h-full bg-muted">
                        <Image
                            key={`${profile.id}-${imageIndex}`}
                            src={displayImages[imageIndex]}
                            alt={profile.name}
                            fill
                            className={cn(
                                "object-cover transition-all duration-700",
                                isImageLoading ? "blur-xl" : "blur-0"
                            )}
                            priority
                            onLoad={() => setIsImageLoading(false)}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />

                    <div className="absolute bottom-6 left-6 right-6 text-white z-20">
                        <h2 className="text-2xl font-bold">
                            {profile.name}, {profile.age}
                        </h2>
                        <div className="flex items-center gap-1.5 opacity-90 mt-1 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                        </div>
                    </div>
                </Card>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 border shadow-none rounded-xl">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{getLabel('job', language)}</p>
                                <p className="text-xs font-semibold truncate">{getLabel(profile.job, language)}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4 border shadow-none rounded-xl">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{getLabel('education', language)}</p>
                                <p className="text-xs font-semibold truncate">{getLabel(profile.education, language)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Bio Section */}
                <Card className="border shadow-none rounded-xl">
                    <CardContent className="p-6 space-y-3">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{getLabel('bio', language)}</h3>
                        <p className="text-foreground leading-relaxed italic text-sm">
                            &quot;{profile.bio}&quot;
                        </p>
                    </CardContent>
                </Card>

                {/* Hobbies Section */}
                <Card className="border shadow-none rounded-xl">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{getLabel('hobbies', language)}</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.hobbies.map(hobby => (
                                <Badge key={hobby} variant="secondary" className="px-2.5 py-0.5 text-[10px] font-bold uppercase">
                                    {getLabel(hobby, language)}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button onClick={handleLike} className="flex-1 gap-2">
                        <Heart className="w-5 h-5 fill-current" />
                        Beğen
                    </Button>
                    <Link href={`/chat/${profile.id}`} className="flex-none">
                        <Button variant="outline" size="icon">
                            <MessageCircle className="w-6 h-6" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
