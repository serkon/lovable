"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { getUserById } from "@/lib/actions/userActions";
import { Profile } from "@/lib/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { language, sendLike } = useAppStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const id = params.id as string;
      setImageIndex(0);
      setIsImageLoading(true);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbUser = (await getUserById(id)) as any;
        if (dbUser) {
          const mapped: Profile = {
            id: dbUser.id,
            firstName: dbUser.firstName || "İsimsiz",
            lastName: dbUser.lastName || "",
            age: dbUser.age || 0,
            location: dbUser.city || "",
            distance: 0,
            job: dbUser.job?.id || "",
            education: dbUser.education?.id || "edu_elementary",
            maritalStatus: dbUser.maritalStatus?.id || "ms_private",
            intention: dbUser.intention?.id || "int_chat",
            bio: dbUser.bio || "",
            hobbies: Array.isArray(dbUser.hobbies)
              ? dbUser.hobbies.map((h: { id: string }) => h.id)
              : [],
            imageUrl: dbUser.images?.[0]?.url || "https://via.placeholder.com/400",
            images: Array.isArray(dbUser.images)
              ? dbUser.images.map((img: { url: string }) => img.url)
              : [],
            iceBreaker: "",
          };
          setProfile(mapped);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("DB fetch failed", err);
      }

      setLoading(false);
    };

    loadProfile();
  }, [params.id]);

  const displayImages =
    profile?.images && profile.images.length > 0
      ? profile.images
      : profile?.imageUrl
        ? [profile.imageUrl]
        : [];

  const handleLike = () => {
    if (profile) {
      sendLike(profile);
      alert(getLabel("match_success_subtitle", language, { name: profile.firstName }));
    }
  };

  const handleShare = async () => {
    if (!profile) return;
    const shareData = {
      title: `${profile.firstName} ${profile.lastName} - ${getLabel("app_name", language)}`,
      text: `${profile.firstName} ${profile.lastName} (${profile.age}) seni bekliyor!`,
      url: window.location.href,
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

  if (loading) {
    return (
      <div
        className="bg-background flex min-h-screen flex-col items-center justify-center space-y-4 p-6"
        data-testid="profile-loading"
      >
        <Skeleton className="h-[60vh] w-full max-w-md rounded-xl" />
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="bg-background flex min-h-screen flex-col items-center justify-center space-y-4 p-6 text-center"
        data-testid="profile-not-found"
      >
        <h2 className="text-2xl font-bold">Profil Bulunamadı</h2>
        <p className="text-muted-foreground">Aradığınız kişi artık aramızda olmayabilir.</p>
        <Link href="/dashboard">
          <Button>Keşfetmeye Geri Dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20" data-testid="public-profile-page-container">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h3 className="text-sm font-bold tracking-tight">
          {profile.firstName} {profile.lastName}
        </h3>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="text-muted-foreground h-5 w-5" />
        </Button>
      </header>

      <main className="mx-auto max-w-md space-y-6 p-4" data-testid="public-profile-main">
        {/* Photo Card */}
        <Card className="relative aspect-[3/4] overflow-hidden border p-0">
          {displayImages.length > 1 && (
            <>
              <div className="absolute top-4 right-0 left-0 z-30 flex justify-center gap-1 px-4">
                {displayImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1 rounded-full",
                      idx === imageIndex ? "w-8 bg-white shadow-sm" : "w-2 bg-white/40"
                    )}
                  />
                ))}
              </div>

              <div className="absolute inset-0 z-20 flex">
                <div
                  className="h-full w-1/2 cursor-pointer"
                  onClick={() =>
                    setImageIndex((prev) => {
                      const newIdx = prev > 0 ? prev - 1 : displayImages.length - 1;
                      if (newIdx !== prev) setIsImageLoading(true);
                      return newIdx;
                    })
                  }
                />
                <div
                  className="h-full w-1/2 cursor-pointer"
                  onClick={() =>
                    setImageIndex((prev) => {
                      const newIdx = prev < displayImages.length - 1 ? prev + 1 : 0;
                      if (newIdx !== prev) setIsImageLoading(true);
                      return newIdx;
                    })
                  }
                />
              </div>
            </>
          )}

          <div className="bg-muted relative h-full w-full">
            <Image
              key={`${profile.id}-${imageIndex}`}
              src={displayImages[imageIndex]}
              alt={`${profile.firstName} ${profile.lastName}`}
              fill
              className={cn(
                "object-cover transition-all duration-700",
                isImageLoading ? "blur-xl" : "blur-0"
              )}
              priority
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute right-6 bottom-6 left-6 z-20 text-white">
            <h2 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}, {profile.age}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 text-sm opacity-90">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-xl border p-4 shadow-none">
            <div className="flex items-center gap-3">
              <Briefcase className="text-muted-foreground h-5 w-5" />
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  {getLabel("job", language)}
                </p>
                <p className="truncate text-xs font-semibold">{getLabel(profile.job, language)}</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-xl border p-4 shadow-none">
            <div className="flex items-center gap-3">
              <GraduationCap className="text-muted-foreground h-5 w-5" />
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  {getLabel("education", language)}
                </p>
                <p className="truncate text-xs font-semibold">
                  {getLabel(profile.education, language)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bio Section */}
        <Card className="rounded-xl border shadow-none">
          <CardContent className="space-y-3 p-6">
            <h3 className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {getLabel("bio", language)}
            </h3>
            <p className="text-foreground text-sm leading-relaxed italic">
              &quot;{profile.bio}&quot;
            </p>
          </CardContent>
        </Card>

        {/* Hobbies Section */}
        <Card className="rounded-xl border shadow-none">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {getLabel("hobbies", language)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby) => (
                <Badge
                  key={hobby}
                  variant="secondary"
                  className="px-2.5 py-0.5 text-[10px] font-bold uppercase"
                >
                  {getLabel(hobby, language)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={handleLike} className="flex-1 gap-2">
            <Heart className="h-5 w-5 fill-current" />
            Beğen
          </Button>
          <Link href={`/chat/${profile.id}`} className="flex-none">
            <Button variant="outline" size="icon">
              <MessageCircle className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
