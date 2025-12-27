"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, MapPin, Briefcase } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import Link from "next/link";
import { getLabel } from "@/lib/translations";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SentRequestsPage() {
    const { sentRequests, cancelRequest, language } = useAppStore();
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

    return (
        <div className="min-h-screen bg-background pb-20">

            {/* Header */}
            <header className="bg-background h-16 border-b flex items-center gap-4 px-6 sticky top-0 z-10">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <h3 className="font-bold">
                    {getLabel('sent_requests', language)}
                </h3>
            </header>

            <main className="max-w-4xl mx-auto w-full p-4">

                {sentRequests.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <div className="mx-auto mb-4 flex justify-center">
                            <Clock className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{getLabel('no_sent_requests', language)}</h3>
                        <p className="text-sm">{getLabel('first_step_desc', language)}</p>
                        <Link href="/dashboard" className="mt-6 inline-block">
                            <Button>{getLabel('start_exploring', language)}</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {sentRequests.map((profile) => (
                            <Card key={profile.id} className="overflow-hidden border">
                                <div className="relative h-48 bg-muted">
                                    <Image
                                        src={profile.imageUrl}
                                        alt={profile.name}
                                        fill
                                        className="object-cover"
                                        onLoad={() => setLoadingImages(prev => ({ ...prev, [profile.id]: false }))}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {getLabel('waiting_reply', language)}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4 bg-card">
                                    <h3 className="font-bold">
                                        {profile.name}, {profile.age}
                                    </h3>
                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {profile.location.split(',')[0]}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => cancelRequest(profile.id)}
                                        className="mt-4 w-full text-destructive"
                                    >
                                        {getLabel('cancel_request', language)}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
