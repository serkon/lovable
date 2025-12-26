"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { X, MapPin, Briefcase, GraduationCap, Heart, SlidersHorizontal, Eye, EyeOff, User, BookOpen, MessageCircle, Clock, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { FilterModal, FilterState } from "@/components/dashboard/FilterModal";
import { IceBreakerModal } from "@/components/dashboard/IceBreakerModal";
import { useAppStore } from "@/context/AppStore"; // Use Store
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { getLabel } from "@/lib/translations";
import { Profile } from "@/lib/constants";
import Image from "next/image";

export default function DashboardPage() {
  const { profiles, sendLike, passProfile, matches, resetProfiles, language, setLanguage } = useAppStore(); // Get from context
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

  const toggleGhostMode = () => {
    setIsGhostMode(prev => !prev);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header - Compact for empty state */}
        <header className="h-16 px-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <Typography variant="h3" className="text-purple-700 text-sm font-bold">{getLabel('app_name', language)}</Typography>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/sent-requests">
              <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" title={getLabel('tooltip_sent_requests', language)}>
                <Clock className="w-4 h-4 text-gray-600" />
              </Button>
            </Link>

            <Link href="/matches">
              <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 relative" title={getLabel('tooltip_matches', language)}>
                <MessageCircle className="w-4 h-4 text-gray-600" />
                {matches.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
              </Button>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="bg-purple-100 p-6 rounded-full animate-bounce">
            <Heart className="w-12 h-12 text-purple-600" />
          </div>
          <Typography variant="h2" className="text-purple-900">
            {getLabel('no_candidates_title', language)}
          </Typography>
          <Typography variant="body-large" className="text-gray-600 max-w-md">
            {getLabel('no_candidates_subtitle', language)}
          </Typography>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="w-full" data-testid="empty-state-change-filters-btn">
              {getLabel('btn_change_filters', language)}
            </Button>

            <Button onClick={() => {
              resetProfiles();
              setCurrentIndex(0);
            }} className="w-full bg-purple-600 hover:bg-purple-700" data-testid="empty-state-reset-btn">
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
      <div className="min-h-screen bg-purple-600 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in zoom-in duration-300" data-testid="match-success-container">
        <div className="bg-white p-8 rounded-full shadow-2xl">
          <Heart className="w-16 h-16 text-purple-600 fill-purple-600 animate-pulse" />
        </div>
        <Typography variant="h1" className="text-white">
          {getLabel('match_success_title', language)}
        </Typography>
        <Typography variant="h3" className="text-purple-100" data-testid="match-success-name">
          {getLabel('match_success_subtitle', language, { name: lastLikedName })}
        </Typography>
        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 max-w-sm">
          <Typography variant="caption" className="text-purple-200 uppercase font-bold tracking-wider mb-1 block">{getLabel('sent_question', language)}</Typography>
          <p className="text-white italic" data-testid="match-success-question">&quot;{lastQuestion}&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col md:pb-0 transition-colors duration-500", isGhostMode && "bg-gray-900")}>

      {/* Header - Refined & Compact */}
      <header data-testid="dashboard-header" className={cn("h-20 px-4 shadow-sm flex justify-between items-center sticky top-0 z-30 transition-colors", isGhostMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
        <Link href="/" className="flex items-center gap-2">
          <Logo size={40} className={isGhostMode ? "brightness-90 invert-[.15]" : ""} />
          <Typography variant="h3" className={cn("transition-colors text-base font-bold", isGhostMode ? "text-white" : "text-purple-700")}>
            {getLabel('app_name', language)}
          </Typography>
        </Link>
        {isGhostMode && <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{getLabel('ghost_mode', language)}</span>}

        <div className="flex items-center gap-1">
          <button
            onClick={toggleGhostMode}
            className={cn("p-1.5 rounded-full transition-colors",
              isGhostMode ? "text-white hover:bg-gray-700" : "text-purple-700 hover:bg-purple-50"
            )}
            title={getLabel('tooltip_ghost_mode', language)}
            data-testid="ghost-mode-toggle"
          >
            {isGhostMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" onClick={() => setIsFilterOpen(true)} title={getLabel('tooltip_filters', language)} data-testid="filter-button">
            <SlidersHorizontal className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
          </Button>

          <Link href="/sent-requests">
            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" title={getLabel('tooltip_sent_requests', language)} data-testid="sent-requests-link">
              <Clock className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
            </Button>
          </Link>

          <Link href="/matches">
            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 relative" title={getLabel('tooltip_matches', language)} data-testid="matches-link">
              <MessageCircle className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
              {matches.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
            </Button>
          </Link>

          <Link href="/likes">
            <div className="w-8 h-8 flex items-center justify-center cursor-pointer relative" title={getLabel('tooltip_likes', language)}>
              <div className="bg-purple-100 p-1.5 rounded-full hover:bg-purple-200 transition-colors">
                <Heart className="text-purple-600 w-4 h-4 fill-purple-600" />
              </div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
            </div>
          </Link>

          <button
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors",
              isGhostMode
                ? "text-white border-gray-600 hover:bg-gray-700"
                : "text-purple-700 border-purple-100 hover:bg-purple-50"
            )}
            title={getLabel('tooltip_language', language)}
            data-testid="language-toggle"
          >
            {language.toUpperCase()}
          </button>

          <Link href="/profile">
            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" title={getLabel('tooltip_profile', language)} data-testid="profile-link">
              <User className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
            </Button>
          </Link>
        </div>
      </header>

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

      <main data-testid="dashboard-main-content" className="flex-1 max-w-2xl mx-auto w-full flex flex-col items-center px-4 md:px-0 relative">

        {/* Navigation - Left */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full md:-translate-x-12 z-20 hidden md:flex rounded-full bg-white/80 hover:bg-white shadow-sm left-6 cursor-pointer"
          data-testid="desktop-prev-button"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </Button>

        <Card data-testid="active-profile-card" className="border-0 flex flex-col w-full h-auto animate-in slide-in-from-right duration-300 relative rounded-[16px] my-6" key={currentProfile.id}>
          <div className="sticky top-12 h-[60vh] w-full bg-gray-200 z-0 rounded-t-[16px] overflow-hidden shadow-2xl " data-testid="profile-photo-area">

            <div className="z-20 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-semibold text-purple-700 shadow-sm flex items-center gap-1 absolute top-4 left-4" data-testid="badge-intention">
              <Heart className="w-3 h-3 fill-purple-700" />
              {getLabel(currentProfile.intention, language)}
            </div>

            <div className="z-20 bg-black/60 backdrop-blur px-2 py-0.5 rounded-full text-xs font-medium text-white shadow-sm flex items-center gap-1 absolute top-12 left-4" data-testid="badge-distance">
              <MapPin className="w-3 h-3 text-white" />
              {currentProfile.distance} km
            </div>

            {displayImages.length > 1 && (
              <>
                <div className="absolute top-4 left-0 right-0 z-4 flex justify-center gap-1 px-4">
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

                <div className="absolute inset-0 z-1 flex">
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

            <div data-testid="profile-image-container" className="relative w-full h-full">
              <Image
                key={`${currentProfile.id}-${imageIndex}`}
                src={displayImages[imageIndex]}
                alt={currentProfile.name}
                fill
                className={cn(
                  "object-cover transition-[opacity,filter,transform] duration-1000 ease-in-out",
                  isImageLoading ? "blur-2xl opacity-0 scale-110" : "blur-0 opacity-100 scale-100"
                )}
                data-testid="profile-image"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
                onLoad={() => setIsImageLoading(false)}
              />
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-[2px] z-10 transition-opacity duration-800 pointer-events-none",
                  isImageLoading ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin shadow-lg" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-48 right-4 flex flex-col gap-3 z-2" data-testid="action-buttons">
              <Button
                onClick={handleLike}
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-purple-500 hover:border-purple-500 text-white shadow-lg transition-all active:scale-90 flex items-center justify-center p-0 group"
                data-testid="like-button"
                title={getLabel('like', language)}
              >
                <Heart className="w-6 h-6 group-hover:fill-white text-white" strokeWidth={2.5} />
              </Button>

              <Button
                onClick={handleShare}
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-blue-500 hover:border-blue-500 text-white shadow-lg transition-all active:scale-90 flex items-center justify-center p-0"
                data-testid="share-button"
                title={getLabel('share', language)}
              >
                <Share2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </Button>

              <Button
                onClick={handlePass}
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-black/40 text-white shadow-lg transition-all active:scale-90 flex items-center justify-center p-0"
                data-testid="dislike-button"
                title={getLabel('pass', language)}
              >
                <X className="w-6 h-6 text-white" strokeWidth={2.5} />
              </Button>
            </div>

            <div data-testid="profile-info-overlay" className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-24 z-1 mt-[-194px]">
              <Typography variant="h1" className="text-white drop-shadow-lg text-4xl font-extrabold tracking-tight" data-testid="profile-name-age">
                {currentProfile.name}, {currentProfile.age}
              </Typography>
              <div className="flex items-center gap-1 text-white/90 mt-0.5" data-testid="profile-location">
                <MapPin className="w-3 h-3" />
                <span className="text-base">{currentProfile.location}</span>
              </div>
            </div>
          </div>

          <div data-testid="profile-details-container" className="relative z-10 bg-white rounded-t-[16px] rounded-b-[16px] -mt-4 p-5 space-y-5 min-h-0 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-1 opacity-50" />

            <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm" data-testid="profile-stats-grid">
              <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg" data-testid="profile-stat-job">
                <Briefcase className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{getLabel(currentProfile.job, language)}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg" data-testid="profile-stat-education">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{getLabel(currentProfile.education, language)}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg col-span-2" data-testid="profile-stat-marital-status">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{getLabel(currentProfile.maritalStatus, language)}</span>
              </div>
            </div>

            <div className="space-y-3" data-testid="profile-hobbies-section">
              <Typography variant="h3" className="text-xs font-bold text-gray-400 uppercase tracking-widest">{getLabel('hobbies', language)}</Typography>
              <div className="flex flex-wrap gap-2">
                {currentProfile.hobbies.map(hobby => (
                  <span key={hobby} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100" data-testid={`profile-hobby-${hobby}`}>
                    {getLabel(hobby, language)}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2" data-testid="profile-bio-section">
              <Typography variant="h3" className="text-xs font-bold text-gray-400 uppercase tracking-widest">{getLabel('bio', language)}</Typography>
              <Typography variant="body" className="text-gray-600 leading-relaxed italic">
                &quot;{currentProfile.bio}&quot;
              </Typography>
            </div>
          </div>
        </Card>

        {/* Navigation - Right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full md:translate-x-12 z-20 hidden md:flex rounded-full bg-white/80 hover:bg-white shadow-sm right-6 cursor-pointer"
          data-testid="desktop-next-button"
          disabled={currentIndex === filteredProfiles.length - 1}
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </Button>
      </main>
    </div>
  );
}
