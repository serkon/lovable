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
    <div className="min-h-screen bg-background pb-20">

      {/* Header */}
      <header className="bg-background p-4 border-b flex items-center gap-4 px-6 sticky top-0 z-10">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h3 className="text-xl font-bold">
          {getLabel('my_matches', language)}
        </h3>
      </header>

      <main className="max-w-md mx-auto w-full p-4 space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>{getLabel('no_matches', language)}</p>
            <p className="text-sm">{getLabel('keep_liking', language)}</p>
          </div>
        ) : null}

        {matches.map((profile) => (
          <Card key={profile.id} className="p-4 flex items-center gap-4 shadow-sm border hover:shadow-md transition-shadow">
            {/* Photo Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
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

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold truncate">
                {profile.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {getLabel(profile.job, language)} • {profile.location.split(',')[0]}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/chat/${profile.id}`}>
                <Button size="icon" variant="ghost">
                  <MessageCircle className="w-6 h-6" />
                </Button>
              </Link>
              <Button
                size="icon"
                onClick={() => handleVideoClick(profile.name)}
                variant="secondary"
                className="rounded-full w-10 h-10"
              >
                <Video className="w-5 h-5" />
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
