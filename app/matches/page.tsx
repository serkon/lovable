"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Video, MessageCircle } from "lucide-react";
import { useAppStore } from "@/context/AppStore"; // Use Store
import { DateScheduler } from "@/components/video-date/DateScheduler";
import Link from "next/link";
import { getLabel } from "@/lib/translations";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function MatchesPage() {
  const { matches, language } = useAppStore();
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  const handleVideoClick = (name: string) => {
    setSelectedPartner(name);
    setSchedulerOpen(true);
  };

  return (
    <div className="bg-background min-h-screen pb-20" data-testid="matches-page-container">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex items-center gap-4 border-b p-4 px-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h3 className="text-xl font-bold">{getLabel("my_matches", language)}</h3>
      </header>

      <main className="mx-auto w-full max-w-md space-y-4 p-4" data-testid="matches-main">
        {matches.length === 0 ? (
          <div
            className="text-muted-foreground py-20 text-center"
            data-testid="matches-empty-state"
          >
            <p>{getLabel("no_matches", language)}</p>
            <p className="text-sm">{getLabel("keep_liking", language)}</p>
          </div>
        ) : null}

        {matches.map((profile) => (
          <Card
            key={profile.id}
            className="flex items-center gap-4 border p-4 shadow-sm transition-shadow hover:shadow-md"
            data-testid="match-card"
          >
            {/* Photo Avatar */}
            <div className="bg-muted relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
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

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-muted-foreground truncate text-sm">
                {getLabel(profile.job, language)} • {profile.location.split(",")[0]}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/chat/${profile.id}`}>
                <Button size="icon" variant="ghost">
                  <MessageCircle className="h-6 w-6" />
                </Button>
              </Link>
              <Button
                size="icon"
                onClick={() => handleVideoClick(`${profile.firstName} ${profile.lastName}`)}
                variant="secondary"
                className="h-10 w-10 rounded-full"
              >
                <Video className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        ))}
      </main>

      <DateScheduler
        isOpen={schedulerOpen}
        onClose={() => setSchedulerOpen(false)}
        partnerName={selectedPartner}
      />
    </div>
  );
}
