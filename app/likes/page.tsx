"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, X, MapPin, Briefcase } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getLabel } from "@/lib/translations";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LikesPage() {
    const { likesReceived, approveMatch, rejectMatch, language } = useAppStore();
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="bg-background p-4 border-b flex items-center gap-4 px-6 sticky top-0 z-10">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <h3 className="text-xl font-bold">
                    {getLabel('likes_title', language)}
                </h3>
            </header>

            <main className="max-w-2xl mx-auto w-full p-4 space-y-6">
                <div className="bg-muted p-4 rounded-md">
                    <p className="text-muted-foreground text-center text-sm font-medium">
                        {getLabel('likes_subtitle', language)}
                    </p>
                </div>

                {likesReceived.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>{getLabel('no_new_likes', language)}</p>
                    </div>
                )}

                {likesReceived.map((profile) => (
                    <Card key={profile.id} className="overflow-hidden shadow-sm flex flex-col sm:flex-row h-auto animate-in slide-in-from-bottom duration-300">
                        {/* Photo Area */}
                        <div className="relative h-64 sm:h-auto sm:w-1/3 bg-muted">
                            <Image
                                src={profile.imageUrl}
                                alt={profile.name}
                                fill
                                className={cn(
                                    "object-cover transition-all duration-700",
                                    loadingImages[profile.id] !== false ? "blur-xl" : "blur-0"
                                )}
                                onLoad={() => setLoadingImages(prev => ({ ...prev, [profile.id]: false }))}
                            />
                        </div>

                        {/* Details Area */}
                        <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold">
                                            {profile.name}, {profile.age}
                                        </h3>
                                        <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
                                            <MapPin className="w-3 h-3" />
                                            <span>{profile.location}</span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">
                                        {getLabel(profile.intention, language)}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{getLabel(profile.job, language)}</span>
                                </div>

                                <p className="text-muted-foreground italic text-sm leading-relaxed line-clamp-2">
                                    &quot;{profile.bio}&quot;
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Separator className="mt-4" />
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => rejectMatch(profile.id)}
                                        className="flex-1 text-destructive hover:bg-destructive/10"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        {getLabel('btn_pass', language)}
                                    </Button>
                                    <Button
                                        onClick={() => approveMatch(profile)}
                                        className="flex-1"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        {getLabel('btn_meet', language)}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </main>
        </div>
    );
}
