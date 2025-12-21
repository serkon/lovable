"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Check, X, MapPin, Briefcase, Heart } from "lucide-react";
import { useAppStore } from "@/context/AppStore"; // Use Store
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LikesPage() {
    const router = useRouter();
    const { likesReceived, approveMatch, rejectMatch } = useAppStore(); // Get from context

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
                    Sizi Beğenenler
                </Typography>
            </header>

            <main className="max-w-2xl mx-auto w-full p-4 space-y-4">
                <div className="bg-purple-100 p-4 rounded-xl mb-6">
                    <Typography variant="body" className="text-purple-800 text-center font-medium">
                        Bu kişiler sizinle tanışmak istiyor. Onaylarsanız sohbet başlayacak.
                    </Typography>
                </div>

                {likesReceived.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p>Şu an yeni beğeni yok.</p>
                    </div>
                )}

                {likesReceived.map((profile) => (
                    <Card data-testid={`liked-profile-card-${profile.id}`} key={profile.id} className="overflow-hidden shadow-md border-0 flex flex-col sm:flex-row h-auto animate-in slide-in-from-bottom duration-300 mb-4">
                        {/* Photo Area */}
                        <div className="relative h-64 sm:h-auto sm:w-1/3 bg-gray-200">
                            <img
                                src={profile.imageUrl}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
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
                                        {profile.intention}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{profile.job}</span>
                                </div>

                                <p className="text-gray-600 italic text-sm line-clamp-2 mt-2">
                                    &quot;{profile.bio}&quot;
                                </p>
                            </div>

                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    onClick={() => rejectMatch(profile.id)}
                                    className="flex-1 h-12 rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700"
                                >
                                    <X className="w-5 h-5 mr-2" />
                                    Pas Geç
                                </Button>
                                <Button
                                    onClick={() => approveMatch(profile)}
                                    className="flex-1 h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Tanış
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </main>
        </div>
    );
}
