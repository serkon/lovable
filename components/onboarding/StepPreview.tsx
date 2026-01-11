import { getLabel } from "@/lib/translations";
import { Camera, MapPin, Navigation, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { FormGroup } from "@/components/ui/form-group";
import { AutoComplete } from "@/components/ui/auto-complete";
import { TURKEY_DATA } from "@/lib/data/turkey";
import { motion, AnimatePresence } from "framer-motion";
import { SectionSeparator } from "@/components/ui/section-separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StepPreviewProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  nextStep: () => void;
  countriesList: string[];
}

export function StepPreview({ data, setData, nextStep, countriesList }: StepPreviewProps) {
  const { language } = useAppStore();
  const [isDetecting, setIsDetecting] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setImageIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = data.photos.length - 1;
      if (next >= data.photos.length) next = 0;
      return next;
    });
    setIsImageLoading(true);
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const baseUrl =
              process.env.NEXT_PUBLIC_REVERSE_GEOCODE_URL ||
              "https://nominatim.openstreetmap.org/reverse";
            const response = await fetch(
              `${baseUrl}?lat=${latitude}&lon=${longitude}&format=json&accept-language=${language}`
            );
            const resData = await response.json();

            if (resData && resData.address) {
              const addr = resData.address;
              const city = addr.province || addr.city || addr.state || "";
              const district = addr.town || addr.borough || addr.suburb || addr.district || "";
              const country = addr.country === "Turkey" ? "Türkiye" : addr.country || "Türkiye";

              setData((prev) => ({
                ...prev,
                city: city,
                district: district,
                country: country,
              }));

              toast.success(getLabel("location_detected", language) || "Location detected!");
            }
          } catch (error) {
            console.error("Error in reverse geocoding:", error);
            toast.error(getLabel("location_error", language) || "Could not detect location.");
          } finally {
            setIsDetecting(false);
          }
        },
        (error) => {
          console.error("Error detecting location:", error);
          setIsDetecting(false);
          toast.error(getLabel("location_error", language) || "Could not detect location.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsDetecting(false);
      toast.error(getLabel("geolocation_not_supported", language));
    }
  };

  const isLocationValid = data.city && data.district && data.country;

  return (
    <>
      <div className="mb-10 space-y-3 text-center">
        <h1
          className="text-foreground text-4xl font-bold tracking-tight md:text-5xl"
          data-test-id="preview-step-title"
        >
          {getLabel("profile_ready", language)}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("best_candidates", language)}
        </p>
      </div>

      <div className="mb-10 flex w-full flex-col gap-8">
        {/* PREMIUM PROFILE CARD */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="group overflow-hidden pt-0" data-test-id="preview-profile-card">
            <div className="relative h-[22rem] w-full overflow-hidden">
              {data.photos.length > 0 ? (
                <>
                  {/* Image indicators */}
                  {data.photos.length > 1 && (
                    <div className="absolute top-4 right-0 left-0 z-10 flex justify-center gap-1 px-4">
                      {data.photos.map((_, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "h-1 rounded-full transition-all duration-300",
                            idx === imageIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {/* Click areas for navigation */}
                  {data.photos.length > 1 && (
                    <div className="absolute inset-0 z-20 flex">
                      <div
                        className="h-full w-1/2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          paginate(-1);
                        }}
                      />
                      <div
                        className="h-full w-1/2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          paginate(1);
                        }}
                      />
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-full w-full">
                    <AnimatePresence initial={false} custom={direction}>
                      <motion.div
                        key={`preview-${imageIndex}`}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(_, { offset, velocity }) => {
                          const swipeThreshold = 50;
                          const swipe = offset.x;

                          if (swipe < -swipeThreshold) {
                            paginate(1);
                          } else if (swipe > swipeThreshold) {
                            paginate(-1);
                          }
                        }}
                        className="absolute h-full w-full cursor-grab active:cursor-grabbing"
                      >
                        <Image
                          src={data.photos[imageIndex]}
                          alt="Profile"
                          fill
                          className={cn(
                            "pointer-events-none object-cover transition-all duration-700 group-hover:scale-105",
                            isImageLoading ? "blur-xl" : "blur-0"
                          )}
                          sizes="(max-width: 768px) 100vw, 512px"
                          priority
                          onLoad={() => setIsImageLoading(false)}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-100">
                  <Camera className="text-muted-foreground/40 h-16 w-16" />
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-left">
                <h3 className="text-3xl font-bold text-white drop-shadow-md">
                  {data.firstName || data.lastName
                    ? `${data.firstName} ${data.lastName}`
                    : getLabel("guest", language)}
                  , <span className="font-medium opacity-90">{data.age || "40"}</span>
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-white/90">
                  <MapPin className="text-primary-400 h-4 w-4" />
                  <span className="text-sm font-medium tracking-wide">
                    {data.city
                      ? `${data.city}, ${data.district}`
                      : getLabel("location_not_set", language)}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-8" data-test-id="preview-bio">
              <div className="text-primary mb-4 text-xs font-bold tracking-widest uppercase">
                {getLabel("about_me", language)}
              </div>
              <p className="text-muted-foreground">
                {data.bio || getLabel("no_bio_yet", language)}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Separator Header */}
        <SectionSeparator
          label={getLabel("location", language)}
          icon={<MapPin className="h-3.5 w-3.5" />}
          data-test-id="preview-location-separator"
        />

        {/* LOCATION SECTION */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-6"
        >
          <p className="text-muted-foreground -mt-2 text-center text-sm">
            {getLabel("location_help_text", language)}
          </p>

          {/* Location Detect Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary/30 bg-primary/5 text-primary hover:bg-primary h-11 gap-2 rounded-full px-6 font-bold shadow-sm transition-all hover:text-white"
              onClick={handleDetectLocation}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {getLabel("detect_location", language)}
            </Button>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormGroup label={getLabel("label_country", language)}>
              <Select
                value={data.country}
                onValueChange={(val) => setData({ ...data, country: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getLabel("select_default", language)} />
                </SelectTrigger>
                <SelectContent>
                  {countriesList.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup label={getLabel("label_city", language)}>
              <AutoComplete
                options={Object.keys(TURKEY_DATA)}
                value={data.city}
                onChange={(val) => setData({ ...data, city: val, district: "" })}
                placeholder={getLabel("placeholder_city", language)}
              />
            </FormGroup>

            <FormGroup label={getLabel("label_district", language)} className="md:col-span-2">
              <AutoComplete
                options={TURKEY_DATA[data.city] || []}
                value={data.district}
                onChange={(val) => setData({ ...data, district: val })}
                placeholder={getLabel("placeholder_district", language)}
              />
            </FormGroup>
          </div>
        </motion.div>
      </div>

      <Button
        onClick={nextStep}
        disabled={!isLocationValid || isDetecting}
        size="lg"
        data-test-id="preview-finish-button"
        className="w-full max-w-[400px] shadow-lg transition-all"
      >
        {getLabel("btn_continue", language)}
      </Button>
    </>
  );
}
