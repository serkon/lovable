"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  BookOpen,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { FilterModal, FilterState } from "@/components/dashboard/FilterModal";
import { IceBreakerModal } from "@/components/dashboard/IceBreakerModal";
import { useAppStore } from "@/context/AppStore"; // Use Store
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Header } from "@/components/layout/Header";
import { getLabel } from "@/lib/translations";
import { Profile, USER_STATUS } from "@/lib/constants";
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
    return profiles.filter((p) => {
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
      setLastLikedName(`${currentProfile.firstName} ${currentProfile.lastName}`);
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
      title: `${currentProfile.firstName} ${currentProfile.lastName} - ${getLabel("app_name", language)}`,
      text: `${currentProfile.firstName} ${currentProfile.lastName} (${currentProfile.age}) profilini gör!`,
      url: `${window.location.origin}/profile/${currentProfile.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert(getLabel("share_success", language));
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-background flex min-h-screen flex-col" data-testid="dashboard-empty-state">
        {/* Header - Compact for empty state */}
        <header className="bg-background flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-sm font-bold">{getLabel("app_name", language)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/sent-requests">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                title={getLabel("tooltip_sent_requests", language)}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/matches">
              <Button
                size="icon"
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                title={getLabel("tooltip_matches", language)}
              >
                <MessageCircle className="h-4 w-4" />
                {matches.length > 0 && (
                  <span className="bg-destructive border-background absolute top-1.5 right-1.5 h-2 w-2 rounded-full border"></span>
                )}
              </Button>
            </Link>
          </div>
        </header>

        <div
          className="flex flex-1 flex-col items-center justify-center space-y-6 p-6 text-center"
          data-testid="dashboard-empty-content"
        >
          <div className="bg-muted rounded-full p-6">
            <Heart className="text-muted-foreground h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold">{getLabel("no_candidates_title", language)}</h2>
          <p className="text-muted-foreground max-w-md">
            {getLabel("no_candidates_subtitle", language)}
          </p>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="w-full">
              {getLabel("btn_change_filters", language)}
            </Button>

            <Button
              onClick={() => {
                resetProfiles();
                setCurrentIndex(0);
              }}
              className="w-full"
            >
              {getLabel("btn_reset_list", language)}
            </Button>
          </div>
        </div>
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={setFilters}
        />
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
      <div
        className="bg-primary animate-in zoom-in flex min-h-screen flex-col items-center justify-center space-y-8 p-6 text-center duration-300"
        data-testid="dashboard-match-success"
      >
        <div className="bg-background rounded-full p-8 shadow-2xl">
          <Heart className="text-primary fill-primary h-16 w-16 animate-pulse" />
        </div>
        <h1 className="text-primary-foreground text-3xl font-extrabold">
          {getLabel("match_success_title", language)}
        </h1>
        <h3 className="text-primary-foreground/90 text-xl">
          {getLabel("match_success_subtitle", language, { name: lastLikedName })}
        </h3>
        <div className="bg-primary-foreground/10 border-primary-foreground/20 max-w-sm rounded-2xl border p-4">
          <span className="text-primary-foreground/70 mb-1 block text-xs font-bold tracking-wider uppercase">
            {getLabel("sent_question", language)}
          </span>
          <p className="text-primary-foreground italic">&quot;{lastQuestion}&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 flex min-h-screen flex-col" data-testid="dashboard-container">
      {/* Header - Refined & Compact */}
      <Header
        variant="auth"
        onOpenFilters={() => setIsFilterOpen(true)}
        isGhostMode={isGhostMode}
        onToggleGhostMode={() => setIsGhostMode(!isGhostMode)}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setCurrentIndex(0); // Reset list on filter change
        }}
      />

      <IceBreakerModal
        isOpen={isIceBreakerOpen}
        onClose={() => setIsIceBreakerOpen(false)}
        onSend={handleSendIceBreaker}
        targetName={`${currentProfile?.firstName} ${currentProfile?.lastName}`}
      />

      <main
        className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 md:px-0"
        data-testid="dashboard-main"
      >
        {/* Navigation - Left */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="bg-background/80 hover:bg-background absolute top-1/2 left-0 z-20 hidden -translate-x-full -translate-y-1/2 cursor-pointer rounded-full shadow-sm md:flex md:-translate-x-12"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Card
          className="my-6 flex w-full flex-col overflow-hidden border"
          key={currentProfile.id}
          data-testid="dashboard-profile-card"
        >
          <div className="bg-muted relative h-[60vh] w-full" data-testid="profile-photo-area">
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <Badge variant="secondary">{getLabel(currentProfile.intention, language)}</Badge>
              <Badge variant="outline">
                <MapPin className="mr-1 h-3 w-3" />
                {currentProfile.distance} km
              </Badge>
            </div>

            {displayImages.length > 1 && (
              <>
                <div className="absolute top-4 right-0 left-0 z-10 flex justify-center gap-1 px-4">
                  {displayImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        idx === imageIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                      )}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 z-5 flex">
                  <div
                    className="h-full w-1/2 cursor-pointer"
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
                    className="h-full w-1/2 cursor-pointer"
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

            <div className="relative h-full w-full">
              <Image
                key={`${currentProfile.id}-${imageIndex}`}
                src={displayImages[imageIndex]}
                alt={`${currentProfile.firstName} ${currentProfile.lastName}`}
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

            <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-3">
              <Button onClick={handleLike} size="icon" title={getLabel("like", language)}>
                <Heart className="h-6 w-6 fill-current" />
              </Button>

              <Button
                onClick={handleShare}
                size="icon"
                variant="secondary"
                title={getLabel("share", language)}
              >
                <Share2 className="h-5 w-5" />
              </Button>

              <Button
                onClick={handlePass}
                size="icon"
                variant="outline"
                title={getLabel("pass", language)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="bg-background/80 absolute right-0 bottom-0 left-0 border-t p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                {currentProfile.firstName} {currentProfile.lastName}, {currentProfile.age}
                <span
                  className={cn(
                    "ml-2 inline-block h-4 w-4 rounded-full shadow-sm ring-2 ring-white",
                    {
                      "bg-green-500": currentProfile.userStatus === USER_STATUS.ONLINE,
                      "bg-orange-500": currentProfile.userStatus === USER_STATUS.AWAY,
                      "bg-red-500":
                        currentProfile.userStatus === USER_STATUS.OFFLINE ||
                        currentProfile.userStatus === USER_STATUS.INVISIBLE ||
                        !currentProfile.userStatus,
                    }
                  )}
                  title={
                    currentProfile.userStatus === USER_STATUS.ONLINE
                      ? getLabel("status_online", language) || "Çevrimiçi"
                      : currentProfile.userStatus === USER_STATUS.AWAY
                        ? getLabel("status_away", language) || "Uzakta"
                        : getLabel("status_offline", language) || "Çevrimdışı"
                  }
                />
              </h2>
              <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{currentProfile.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-background space-y-6 p-6" data-testid="dashboard-profile-details">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 flex items-center gap-2 rounded-xl p-3">
                <Briefcase className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">
                  {getLabel(currentProfile.job, language)}
                </span>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-xl p-3">
                <BookOpen className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">
                  {getLabel(currentProfile.maritalStatus, language)}
                </span>
              </div>
              <div className="bg-muted/50 col-span-2 flex items-center gap-2 rounded-xl p-3">
                <GraduationCap className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">
                  {getLabel(currentProfile.education, language)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {getLabel("hobbies", language)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="bg-muted rounded-full border px-3 py-1 text-xs font-medium"
                  >
                    {getLabel(hobby, language)}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {getLabel("bio", language)}
              </h3>
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
          className="bg-background/80 hover:bg-background absolute top-1/2 right-0 z-20 hidden translate-x-full -translate-y-1/2 cursor-pointer rounded-full shadow-sm md:flex md:translate-x-12"
          disabled={currentIndex === filteredProfiles.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </main>
    </div>
  );
}
