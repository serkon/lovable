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
import { motion } from "framer-motion";
import { SectionSeparator } from "@/components/ui/section-separator";

interface StepPreviewProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  nextStep: () => void;
  countriesList: string[];
}

export function StepPreview({ data, setData, nextStep, countriesList }: StepPreviewProps) {
  const { language } = useAppStore();
  const [isDetecting, setIsDetecting] = useState(false);

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
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const isLocationValid = data.city && data.district && data.country;
  const mainPhoto = data.photos[0];

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
          <Card
            className="group overflow-hidden rounded-[2.5rem] border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            data-test-id="preview-profile-card"
          >
            <div className="relative h-[22rem] w-full overflow-hidden">
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt="Profile"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-100">
                  <Camera className="text-muted-foreground/40 h-16 w-16" />
                </div>
              )}

              {/* Photo indicator if multiple */}
              {data.photos.length > 1 && (
                <div className="absolute top-4 right-4 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  1 / {data.photos.length}
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-left">
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
            <div className="border-t border-neutral-50 bg-white p-8 text-left dark:border-neutral-800 dark:bg-neutral-900">
              <div className="text-primary mb-2 text-xs font-bold tracking-widest uppercase">
                Hakkımda
              </div>
              <p className="text-muted-foreground line-clamp-3 text-lg leading-relaxed italic">
                &quot;{data.bio || getLabel("no_bio_yet", language)}&quot;
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
            Sana en yakın kişileri bulmamıza yardımcı ol.
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
