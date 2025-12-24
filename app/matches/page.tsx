"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Video, MessageCircle, MoreVertical } from "lucide-react";
import { useAppStore } from "@/context/AppStore"; // Use Store
import { DateScheduler } from "@/components/video-date/DateScheduler";
import Link from "next/link";

export default function MatchesPage() {
  const { matches } = useAppStore(); // Get matches from context
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState("");

  const handleVideoClick = (name: string) => {
    setSelectedPartner(name);
    setSchedulerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 px-6 sticky top-0 z-10">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-6 h-6 text-purple-700" />
          </Button>
        </Link>
        <Typography variant="h3" className="text-purple-700">
          Eşleşmelerim
        </Typography>
      </header>

      <main className="max-w-md mx-auto w-full p-4 space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>Henüz eşleşmeniz yok.</p>
            <p className="text-sm">Beğenmeye devam edin!</p>
          </div>
        ) : null}

        {matches.map((profile) => (
          <Card data-testid={`match-card-${profile.id}`} key={profile.id} className="p-4 flex items-center gap-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            {/* Photo Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Typography variant="h3" className="text-base truncate">
                {profile.name}
              </Typography>
              <p className="text-sm text-gray-500 truncate">
                {profile.job} • {profile.location.split(',')[0]}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/chat/${profile.id}`}>
                <Button size="icon" variant="ghost" className="text-purple-600 hover:bg-purple-50" data-testid={`match-chat-btn-${profile.id}`}>
                  <MessageCircle className="w-6 h-6" />
                </Button>
              </Link>
              <Button
                size="icon"
                onClick={() => handleVideoClick(profile.name)}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full w-10 h-10"
                data-testid={`match-video-btn-${profile.id}`}
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
