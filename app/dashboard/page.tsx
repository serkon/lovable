"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Check, X, MapPin, Briefcase, GraduationCap, Heart, SlidersHorizontal, Eye, EyeOff, User, BookOpen, MessageCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { FilterModal, FilterState } from "@/components/dashboard/FilterModal";
import { IceBreakerModal } from "@/components/dashboard/IceBreakerModal";
import { useAppStore } from "@/context/AppStore"; // Use Store
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { getLabel } from "@/lib/translations";
import { Profile } from "@/lib/mock-data";

export default function DashboardPage() {
  const { profiles, sendLike, passProfile, matches, resetProfiles, language, setLanguage } = useAppStore(); // Get from context
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isIceBreakerOpen, setIsIceBreakerOpen] = useState(false);
  const [lastLikedName, setLastLikedName] = useState("");
  const [isGhostMode, setIsGhostMode] = useState(false);
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

  const currentProfile: any = filteredProfiles[currentIndex];
  const isFinished = !currentProfile;

  const handlePass = () => {
    // If we're passing (X button), remove from store
    if (currentProfile) {
      passProfile(currentProfile.id);
      // Since the current one is removed, the next one slides into currentIndex. 
      // We might want to ensure currentIndex is still valid, but React re-render will handle bounds check via isFinished check implicitly if list empties.
      // However, if we are at the end of list and remove one, logic might need check. But typically filteredProfiles changes.
    }
  };

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
      setIsIceBreakerOpen(false);
      setIsMatched(true);
      setTimeout(() => {
        setIsMatched(false);
      }, 2000);
    }
  };

  const toggleGhostMode = () => setIsGhostMode(!isGhostMode);

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col transition-colors duration-500">

        {/* Header - Reused for consistency */}
        <header className={cn("h-20 px-4 shadow-sm flex justify-between items-center sticky top-0 z-30 transition-colors bg-white")}>
          <Link href="/" className="flex items-center gap-2">
            <Logo size={40} />
            <Typography variant="h3" className="transition-colors text-base font-bold text-purple-700">
              İkinci Bahar
            </Typography>
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/sent-requests">
              <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" title="Gönderilen İstekler" data-testid="sent-requests-link">
                <Clock className="w-4 h-4 text-gray-600" />
              </Button>
            </Link>

            <Link href="/matches">
              <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 relative" title="Sohbet ve Eşleşmeler">
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
            Kriterlerinize uygun aday kalmadı.
          </Typography>
          <Typography variant="body-large" className="text-gray-600 max-w-md">
            Filtreleri genişleterek veya listeyi başa sararak tekrar inceleyebilirsiniz.
          </Typography>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="w-full">
              Filtreleri Değiştir
            </Button>

            <Button onClick={() => {
              resetProfiles();
              setCurrentIndex(0);
            }} className="w-full bg-purple-600 hover:bg-purple-700">
              Listeyi Başa Sar
            </Button>
          </div>
        </div>
        <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={setFilters} />
        <IceBreakerModal
          isOpen={isIceBreakerOpen}
          onClose={() => setIsIceBreakerOpen(false)}
          onSend={handleSendIceBreaker}
          targetName={currentProfile?.name || ""}
        />
      </div>
    );
  }

  if (isMatched) {
    return (
      <div className="min-h-screen bg-purple-600 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in zoom-in duration-300">
        <div className="bg-white p-8 rounded-full shadow-2xl">
          <Heart className="w-16 h-16 text-purple-600 fill-purple-600 animate-pulse" />
        </div>
        <Typography variant="h1" className="text-white">
          Harika!
        </Typography>
        <Typography variant="h3" className="text-purple-100">
          {lastLikedName} ile tanışma isteğiniz iletildi.
        </Typography>
        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 max-w-sm">
          <Typography variant="caption" className="text-purple-200 uppercase font-bold tracking-wider mb-1 block">Gönderilen Soru</Typography>
          <p className="text-white italic">&quot;{lastQuestion}&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 transition-colors duration-500", isGhostMode && "bg-gray-900")}>

      {/* Header - Refined & Compact */}
      <header className={cn("h-20 px-4 shadow-sm flex justify-between items-center sticky top-0 z-30 transition-colors", isGhostMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
        <Link href="/" className="flex items-center gap-2">
          <Logo size={40} className={isGhostMode ? "brightness-90 invert-[.15]" : ""} />
          <Typography variant="h3" className={cn("transition-colors text-base font-bold", isGhostMode ? "text-white" : "text-purple-700")}>
            İkinci Bahar
          </Typography>
        </Link>
        {isGhostMode && <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">Gizli</span>}

        <div className="flex items-center gap-1">
          <button
            onClick={toggleGhostMode}
            className={cn("p-1.5 rounded-full transition-colors",
              isGhostMode ? "text-white hover:bg-gray-700" : "text-purple-700 hover:bg-purple-50"
            )}
            title="Gizli Mod"
            data-testid="ghost-mode-toggle"
          >
            {isGhostMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" onClick={() => setIsFilterOpen(true)} title="Filtreler" data-testid="filter-button">
            <SlidersHorizontal className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
          </Button>

          <Link href="/sent-requests">
            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" title="Gönderilen İstekler" data-testid="sent-requests-link">
              <Clock className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
            </Button>
          </Link>

          <Link href="/matches">
            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 relative" title="Sohbet ve Eşleşmeler" data-testid="matches-link">
              <MessageCircle className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
              {matches.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
            </Button>
          </Link>

          <Link href="/likes">
            <div className="w-8 h-8 flex items-center justify-center cursor-pointer relative" title="Beğeniler">
              <div className="bg-purple-100 p-1.5 rounded-full hover:bg-purple-200 transition-colors">
                <Heart className="text-purple-600 w-4 h-4 fill-purple-600" />
              </div>
              {/* Notification dot */}
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
            title="Dili Değiştir / Change Language"
            data-testid="language-toggle"
          >
            {language.toUpperCase()}
          </button>

          <Link href="/profile">
            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" title="Profilim" data-testid="profile-link">
              <User className={cn("w-4 h-4", isGhostMode ? "text-white" : "text-gray-600")} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Filter Modal */}
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

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full flex flex-col items-center px-4 md:px-0 relative">

        {/* Navigation - Left */}
        {
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
        }

        <Card data-testid="active-profile-card" className="border-0 flex flex-col w-full h-auto animate-in slide-in-from-right duration-300 relative rounded-[32px] my-6 mb-32" key={currentProfile.id}>



          {/* Photo Area - Sticky Background */}
          <div className="sticky top-12 h-[60vh] w-full bg-gray-200 z-0 rounded-t-[32px] overflow-hidden shadow-2xl ">

            {/* Badge: Intention - Sticky relative to card */}
            <div className="fixed top-12 left-2 z-20 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-semibold text-purple-700 shadow-sm flex items-center gap-1 md:absolute md:top-4 md:left-4">
              <Heart className="w-3 h-3 fill-purple-700" />
              {getLabel(currentProfile.intention, language)}
            </div>

            {/* Badge: Distance - Sticky relative to card */}
            <div className="fixed top-12 right-2 z-20 bg-black/60 backdrop-blur px-2 py-0.5 rounded-full text-xs font-medium text-white shadow-sm flex items-center gap-1 md:absolute md:top-4 md:right-4">
              <MapPin className="w-3 h-3 text-white" />
              {currentProfile.distance} km
            </div>
            <img
              src={currentProfile.imageUrl}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
          </div>


          <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-24 z-1 mt-[-194px]">
            <Typography variant="h1" className="text-white drop-shadow-lg text-4xl font-extrabold tracking-tight">
              {currentProfile.name}, {currentProfile.age}
            </Typography>
            <div className="flex items-center gap-1 text-white/90 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span className="text-base">{currentProfile.location}</span>
            </div>
          </div>


          {/* Details Area - Scrolls OVER the image */}
          <div className="relative z-10 bg-white rounded-t-3xl rounded-b-[32px] -mt-4 p-5 space-y-5 min-h-0 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">



            {/* Tiny drag handle indicator for aesthetics */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-1 opacity-50" />



            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
              <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                <Briefcase className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{currentProfile.job}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{getLabel(currentProfile.education, language)}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg col-span-2">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{getLabel(currentProfile.maritalStatus, language)}</span>
              </div>
            </div>

            {/* Hobbies Tags */}
            <div className="flex flex-wrap gap-1.5">
              {currentProfile.hobbies.map((hobby: string) => (
                <span key={hobby} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                  {hobby}
                </span>
              ))}
            </div>

            <div className="space-y-1">
              <Typography variant="h3" className="text-base text-black">{getLabel('bio', language)}</Typography>
              <p className="text-lg text-gray-600 leading-relaxed font-serif">
                {currentProfile.bio}
              </p>
            </div>
          </div>

        </Card>

        {/* Navigation - Right (Desktop) */}
        {currentIndex < filteredProfiles.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full md:translate-x-12 z-20 hidden md:flex rounded-full bg-white/80 hover:bg-white shadow-sm right-6 cursor-pointer"
            data-testid="desktop-next-button"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </Button>
        )}

        {/* Mobile Navigation Controls - Inline with card or below? Let's put them above FABs or integration */}
        <div className="flex md:hidden w-full justify-between px-4 absolute top-1/2 -translate-y-1/2 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={cn("pointer-events-auto rounded-full bg-white/50 backdrop-blur-sm p-2 h-10 w-10 shadow-sm", currentIndex === 0 && "opacity-0")}
            data-testid="mobile-prev-button"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= filteredProfiles.length - 1}
            className={cn("pointer-events-auto rounded-full bg-white/50 backdrop-blur-sm p-2 h-10 w-10 shadow-sm", currentIndex >= filteredProfiles.length - 1 && "opacity-0")}
            data-testid="mobile-next-button"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </Button>
        </div>

      </main>

      {/* Sticky Action Buttons - Compact */}
      {/* Floating Action Buttons (FAB) - Centered & Equal */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8 animate-in slide-in-from-bottom-10 duration-500">
        {/* Pass Button */}
        <Button
          onClick={handlePass}
          className="h-16 w-16 rounded-full bg-white border-2 border-red-100 hover:bg-red-50 text-red-500 shadow-xl shadow-red-500/10 transition-transform active:scale-90 flex items-center justify-center relative overlow-hidden"
          data-testid="pass-button"
        >
          <X className="w-8 h-8 relative z-10" strokeWidth={3} />
          <span className="sr-only">Pas Geç</span>
        </Button>

        {/* Like Button */}
        <Button
          onClick={handleLike}
          className="h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-500/40 transition-transform active:scale-90 flex items-center justify-center relative overlow-hidden"
          data-testid="like-button"
        >
          <Check className="w-8 h-8 relative z-10" strokeWidth={3} />
          <span className="sr-only">Tanışmak İsterim</span>
        </Button>
      </div>
    </div >
  );
}
