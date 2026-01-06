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
    <div className="bg-background min-h-screen pb-20" data-testid="likes-page-container">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex items-center gap-4 border-b p-4 px-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h3 className="text-xl font-bold">{getLabel("likes_title", language)}</h3>
      </header>

      <main className="mx-auto w-full max-w-2xl space-y-6 p-4" data-testid="likes-main">
        <div className="bg-muted rounded-md p-4">
          <p className="text-muted-foreground text-center text-sm font-medium">
            {getLabel("likes_subtitle", language)}
          </p>
        </div>

        {likesReceived.length === 0 && (
          <div className="text-muted-foreground py-20 text-center" data-testid="likes-empty-state">
            <p>{getLabel("no_new_likes", language)}</p>
          </div>
        )}

        {likesReceived.map((profile) => (
          <Card
            key={profile.id}
            className="animate-in slide-in-from-bottom flex h-auto flex-col overflow-hidden shadow-sm duration-300 sm:flex-row"
            data-testid="like-card"
          >
            {/* Photo Area */}
            <div className="bg-muted relative h-64 sm:h-auto sm:w-1/3">
              <Image
                src={profile.imageUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                fill
                className={cn(
                  "object-cover transition-all duration-700",
                  loadingImages[profile.id] !== false ? "blur-xl" : "blur-0"
                )}
                onLoad={() => setLoadingImages((prev) => ({ ...prev, [profile.id]: false }))}
              />
            </div>

            {/* Details Area */}
            <CardContent className="flex flex-1 flex-col justify-between p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">
                      {profile.firstName} {profile.lastName}, {profile.age}
                    </h3>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                      <MapPin className="h-3 w-3" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{getLabel(profile.intention, language)}</Badge>
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                  <Briefcase className="h-4 w-4" />
                  <span>{getLabel(profile.job, language)}</span>
                </div>

                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed italic">
                  &quot;{profile.bio}&quot;
                </p>
              </div>

              <div className="space-y-4">
                <Separator className="mt-4" />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => rejectMatch(profile.id)}
                    className="text-destructive hover:bg-destructive/10 flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {getLabel("btn_pass", language)}
                  </Button>
                  <Button onClick={() => approveMatch(profile)} className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    {getLabel("btn_meet", language)}
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
