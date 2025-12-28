"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Briefcase, GraduationCap, Heart, BookOpen, MessageCircle, Clock, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { FilterModal, FilterState } from "@/components/dashboard/FilterModal";
import { IceBreakerModal } from "@/components/dashboard/IceBreakerModal";
import { useAppStore } from "@/context/AppStore"; // Use Store
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Header } from "@/components/layout/Header";
import { getLabel } from "@/lib/translations";
import { Profile } from "@/lib/constants";
import Image from "next/image";

export default function DashboardPage() {
  const { profiles, sendLike, passProfile, matches, resetProfiles, language } = useAppStore(); // Get from context
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isIceBreakerOpen, setIsIceBreakerOpen] = useState(false);
  const [lastLikedName, setLastLikedName] = useState("");
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [40, 80],
    maxDistance: 100,
  });

  // Filter Logic
  const filteredProfiles: Profile[] = useMemo(() => {
    return profiles.filter(p => {
      if (p.age < filters.ageRange[0] || p.age > filters.ageRange[1]) return false;
      if (p.distance > filters.maxDistance) return false;
      if (filters.education && p.education !== filters.education) return false;
      if (filters.maritalStatus && p.maritalStatus !== filters.maritalStatus) return false;
      return true;
    });
  }, [filters, profiles]);

  const currentProfile = filteredProfiles[currentIndex] as Profile | undefined;
  const isFinished = !currentProfile;
  const [imageIndex, setImageIndex] = useState(0);
  const [prevId, setPrevId] = useState(currentProfile?.id);

  if (currentProfile?.id !== prevId) {
    setPrevId(currentProfile?.id);
    setImageIndex(0);
    setIsImageLoading(true);
  }

  const displayImages = useMemo(() => {
    if (!currentProfile) return [];
    return currentProfile.images && currentProfile.images.length > 0
      ? currentProfile.images
      : [currentProfile.imageUrl];
  }, [currentProfile]);

  const handlePass = useCallback(() => {
    if (currentProfile) {
      passProfile(currentProfile.id);
    }
  }, [currentProfile, passProfile]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(filteredProfiles.length - 1, prev + 1));
  }, [filteredProfiles.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  const handleLike = () => {
    if (currentProfile) {
      setIsIceBreakerOpen(true);
    }
  };

  const [lastQuestion, setLastQuestion] = useState("");

  const handleSendIceBreaker = (question: string) => {
    if (currentProfile) {
      setLastLikedName(currentProfile.name);
      setLastQuestion(question);
      sendLike(currentProfile);
      setIsMatched(true);
      setTimeout(() => {
        setIsMatched(false);
        handleNext();
      }, 3000);
    }
  };

  const handleShare = async () => {
    if (!currentProfile) return;
    const shareData = {
      title: `${currentProfile.name} - ${getLabel('app_name', language)}`,
      text: `${currentProfile.name} (${currentProfile.age}) profilini gör!`,
      url: `${window.location.origin}/profile/${currentProfile.id}`,
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



  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header - Compact for empty state */}
        <header className="h-16 px-4 border-b flex justify-between items-center bg-background">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-sm font-bold">{getLabel('app_name', language)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/sent-requests">
              <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" title={getLabel('tooltip_sent_requests', language)}>
                <Clock className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/matches">
              <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 relative" title={getLabel('tooltip_matches', language)}>
                <MessageCircle className="w-4 h-4" />
                {matches.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>}
              </Button>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="bg-muted p-6 rounded-full">
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">
            {getLabel('no_candidates_title', language)}
          </h2>
          <p className="text-muted-foreground max-w-md">
            {getLabel('no_candidates_subtitle', language)}
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="w-full">
              {getLabel('btn_change_filters', language)}
            </Button>

            <Button onClick={() => {
              resetProfiles();
              setCurrentIndex(0);
            }} className="w-full">
              {getLabel('btn_reset_list', language)}
            </Button>
          </div>
        </div>
        <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={setFilters} />
        <IceBreakerModal
          isOpen={isIceBreakerOpen}
          onClose={() => setIsIceBreakerOpen(false)}
          onSend={handleSendIceBreaker}
          targetName={""}
        />
      </div>
    );
  }

  if (isMatched) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in zoom-in duration-300">
        <div className="bg-background p-8 rounded-full shadow-2xl">
          <Heart className="w-16 h-16 text-primary fill-primary animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-primary-foreground">
          {getLabel('match_success_title', language)}
        </h1>
        <h3 className="text-xl text-primary-foreground/90">
          {getLabel('match_success_subtitle', language, { name: lastLikedName })}
        </h3>
        <div className="bg-primary-foreground/10 p-4 rounded-2xl border border-primary-foreground/20 max-w-sm">
          <span className="text-xs uppercase font-bold tracking-wider mb-1 block text-primary-foreground/70">{getLabel('sent_question', language)}</span>
          <p className="text-primary-foreground italic">&quot;{lastQuestion}&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">

      {/* Header - Refined & Compact */}
      <Header
        variant="dashboard"
        onOpenFilters={() => setIsFilterOpen(true)}
        isGhostMode={isGhostMode}
        onToggleGhostMode={() => setIsGhostMode(!isGhostMode)}
      />

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={(newFilters) => {
        setFilters(newFilters);
        setCurrentIndex(0); // Reset list on filter change
      }} />

      <IceBreakerModal
        isOpen={isIceBreakerOpen}
        onClose={() => setIsIceBreakerOpen(false)}
        onSend={handleSendIceBreaker}
        targetName={currentProfile?.name}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full flex flex-col items-center px-4 md:px-0 relative">

        {/* Navigation - Left */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full md:-translate-x-12 z-20 hidden md:flex rounded-full bg-background/80 hover:bg-background shadow-sm cursor-pointer"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Card className="flex flex-col w-full my-6 overflow-hidden border" key={currentProfile.id}>
          <div className="h-[60vh] w-full bg-muted relative" data-testid="profile-photo-area">

            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <Badge variant="secondary">
                {getLabel(currentProfile.intention, language)}
              </Badge>
              <Badge variant="outline">
                <MapPin className="w-3 h-3 mr-1" />
                {currentProfile.distance} km
              </Badge>
            </div>

            {displayImages.length > 1 && (
              <>
                <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-1 px-4">
                  {displayImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        idx === imageIndex ? "bg-white w-6" : "bg-white/40 w-2"
                      )}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 z-5 flex">
                  <div
                    className="w-1/2 h-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageIndex((prev) => {
                        const newIdx = prev > 0 ? prev - 1 : displayImages.length - 1;
                        if (newIdx !== prev) setIsImageLoading(true);
                        return newIdx;
                      });
                    }}
                  />
                  <div
                    className="w-1/2 h-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageIndex((prev) => {
                        const newIdx = prev < displayImages.length - 1 ? prev + 1 : 0;
                        if (newIdx !== prev) setIsImageLoading(true);
                        return newIdx;
                      });
                    }}
                  />
                </div>
              </>
            )}

            <div className="relative w-full h-full">
              <Image
                key={`${currentProfile.id}-${imageIndex}`}
                src={displayImages[imageIndex]}
                alt={currentProfile.name}
                fill
                className={cn(
                  "object-cover transition-all duration-700",
                  isImageLoading ? "blur-xl" : "blur-0"
                )}
                sizes="(max-width: 768px) 100vw, 672px"
                priority
                onLoad={() => setIsImageLoading(false)}
              />
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-20">
              <Button
                onClick={handleLike}
                size="icon"
                title={getLabel('like', language)}
              >
                <Heart className="w-6 h-6 fill-current" />
              </Button>

              <Button
                onClick={handleShare}
                size="icon"
                variant="secondary"
                title={getLabel('share', language)}
              >
                <Share2 className="w-5 h-5" />
              </Button>

              <Button
                onClick={handlePass}
                size="icon"
                variant="outline"
                title={getLabel('pass', language)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-6 border-t">
              <h2 className="text-2xl font-bold">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <div className="flex items-center gap-1 text-muted-foreground mt-1 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{currentProfile.location}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 bg-background">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{getLabel(currentProfile.job, language)}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{getLabel(currentProfile.education, language)}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl col-span-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{getLabel(currentProfile.maritalStatus, language)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{getLabel('hobbies', language)}</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.hobbies.map(hobby => (
                  <span key={hobby} className="px-3 py-1 bg-muted rounded-full text-xs font-medium border">
                    {getLabel(hobby, language)}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{getLabel('bio', language)}</h3>
              <p className="text-foreground leading-relaxed italic">
                &quot;{currentProfile.bio}&quot;
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation - Right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full md:translate-x-12 z-20 hidden md:flex rounded-full bg-background/80 hover:bg-background shadow-sm cursor-pointer"
          disabled={currentIndex === filteredProfiles.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </main>
    </div>
  );
}
