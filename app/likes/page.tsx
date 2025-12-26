"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Check, X, MapPin, Briefcase } from "lucide-react";
import { useAppStore } from "@/context/AppStore"; // Use Store
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getLabel } from "@/lib/translations";
import Image from "next/image";

export default function LikesPage() {
    const { likesReceived, approveMatch, rejectMatch, language } = useAppStore();
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center gap-4 px-6 sticky top-0 z-10 transition-colors">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-6 h-6 text-purple-700" />
                    </Button>
                </Link>
                <Typography variant="h3" className="text-purple-700">
                    {getLabel('likes_title', language)}
                </Typography>
            </header>

            <main className="max-w-2xl mx-auto w-full p-4 space-y-4">
                <div className="bg-purple-100 p-4 rounded-xl mb-6">
                    <Typography variant="body" className="text-purple-800 text-center font-medium">
                        {getLabel('likes_subtitle', language)}
                    </Typography>
                </div>

                {likesReceived.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p>{getLabel('no_new_likes', language)}</p>
                    </div>
                )}

                {likesReceived.map((profile) => (
                    <Card data-testid={`liked-profile-card-${profile.id}`} key={profile.id} className="overflow-hidden shadow-md border-0 flex flex-col sm:flex-row h-auto animate-in slide-in-from-bottom duration-300 mb-4">
                        {/* Photo Area */}
                        <div className="relative h-64 sm:h-auto sm:w-1/3 bg-gray-200 overflow-hidden">
                            <Image
                                src={profile.imageUrl}
                                alt={profile.name}
                                fill
                                className={cn(
                                    "object-cover transition-[opacity,filter,transform] duration-1000 ease-in-out",
                                    loadingImages[profile.id] !== false ? "blur-2xl opacity-0 scale-110" : "blur-0 opacity-100 scale-100"
                                )}
                                onLoad={() => setLoadingImages(prev => ({ ...prev, [profile.id]: false }))}
                            />
                            {loadingImages[profile.id] !== false && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-[2px] z-10 transition-opacity duration-800 pointer-events-none">
                                    <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Details Area */}
                        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Typography variant="h3" className="text-gray-900">
                                            {profile.name}, {profile.age}
                                        </Typography>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{profile.location}</span>
                                        </div>
                                    </div>
                                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                        {getLabel(profile.intention, language)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Briefcase className="w-4 h-4 text-purple-500" />
                                    <span>{getLabel(profile.job, language)}</span>
                                </div>

                                <p className="text-gray-600 italic text-sm line-clamp-2 mt-2">
                                    &quot;{profile.bio}&quot;
                                </p>
                            </div>

                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    onClick={() => rejectMatch(profile.id)}
                                    className="flex-1 h-12 rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 font-bold"
                                >
                                    <X className="w-5 h-5 mr-2" />
                                    {getLabel('btn_pass', language)}
                                </Button>
                                <Button
                                    onClick={() => approveMatch(profile)}
                                    className="flex-1 h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    {getLabel('btn_meet', language)}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </main>
        </div>
    );
}
