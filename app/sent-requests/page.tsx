"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import Link from "next/link";
import { getLabel } from "@/lib/translations";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function SentRequestsPage() {
  const { sentRequests, cancelRequest, language } = useAppStore();

  return (
    <div className="bg-background min-h-screen pb-20" data-testid="sent-requests-page-container">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h3 className="font-bold">{getLabel("sent_requests", language)}</h3>
      </header>

      <main className="mx-auto w-full max-w-4xl p-4" data-testid="sent-requests-main">
        {sentRequests.length === 0 ? (
          <div
            className="text-muted-foreground py-20 text-center"
            data-testid="sent-requests-empty-state"
          >
            <div className="mx-auto mb-4 flex justify-center">
              <Clock className="text-muted-foreground/30 h-12 w-12" />
            </div>
            <h3 className="mb-2 text-xl font-bold">{getLabel("no_sent_requests", language)}</h3>
            <p className="text-sm">{getLabel("first_step_desc", language)}</p>
            <Link href="/dashboard" className="mt-6 inline-block">
              <Button>{getLabel("start_exploring", language)}</Button>
            </Link>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
            data-testid="sent-requests-grid"
          >
            {sentRequests.map((profile) => (
              <Card
                key={profile.id}
                className="overflow-hidden border"
                data-testid="sent-request-card"
              >
                <div className="bg-muted relative h-48">
                  <Image
                    src={profile.imageUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getLabel("waiting_reply", language)}
                    </Badge>
                  </div>
                </div>
                <div className="bg-card p-4">
                  <h3 className="font-bold">
                    {profile.firstName} {profile.lastName}, {profile.age}
                  </h3>
                  <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    {profile.location.split(",")[0]}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelRequest(profile.id)}
                    className="text-destructive mt-4 w-full"
                  >
                    {getLabel("cancel_request", language)}
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
