import { getLabel } from "@/lib/translations";
import { Camera, MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

interface StepPreviewProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  nextStep: () => void;
}

const COUNTRIES = [
  "Türkiye",
  "Germany",
  "United Kingdom",
  "United States",
  "Netherlands",
  "France",
  "Other",
];

export function StepPreview({ data, setData, nextStep }: StepPreviewProps) {
  const { language } = useAppStore();
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async () => {
          // Simulate API call for reverse geocoding
          setTimeout(() => {
            setData((prev) => ({
              ...prev,
              city: "İstanbul", // Mock result
              district: "Beşiktaş",
              country: "Türkiye",
            }));
            setIsDetecting(false);
            toast.success(getLabel("location_detected", language) || "Location detected!");
          }, 1500);
        },
        (error) => {
          console.error("Error detecting location:", error);
          setIsDetecting(false);
          toast.error(getLabel("location_error", language) || "Could not detect location.");
        }
      );
    } else {
      setIsDetecting(false);
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const isLocationValid = data.city && data.district && data.country;

  return (
    <>
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          {getLabel("profile_ready", language)}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("best_candidates", language)}
        </p>
      </div>

      <div className="mb-10 flex w-full flex-col gap-6">
        <Card className="overflow-hidden border-2 shadow-xl transition-all hover:shadow-2xl">
          <div className="bg-muted/30 relative h-64 w-full">
            <div className="flex h-full items-center justify-center">
              <Camera className="text-muted-foreground/40 h-12 w-12" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-left">
              <h3 className="text-2xl font-bold text-white">
                {data.firstName || data.lastName
                  ? `${data.firstName} ${data.lastName}`
                  : getLabel("guest", language)}
                , {data.age || "40"}
              </h3>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {data.city || getLabel("location_not_set", language)}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6 text-left">
            <p className="text-muted-foreground leading-relaxed italic">
              &quot;{data.bio || getLabel("no_bio_yet", language)}&quot;
            </p>
          </div>
        </Card>

        {/* Location Confirmation Section */}
        <div className="bg-muted/30 border-muted-foreground/20 space-y-4 rounded-3xl border-2 border-dashed p-6 text-left">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-lg font-bold">
              <MapPin className="text-primary h-5 w-5" />
              {getLabel("location", language)}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary gap-2 font-bold"
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormGroup label={getLabel("label_country", language)}>
              <Select
                value={data.country}
                onValueChange={(val) => setData({ ...data, country: val })}
              >
                <SelectTrigger className="h-11 w-full border-2">
                  <SelectValue placeholder={getLabel("select_default", language)} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup label={getLabel("label_city", language)}>
              <Input
                id="city"
                className="h-11 border-2"
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                placeholder={getLabel("placeholder_city", language)}
              />
            </FormGroup>

            <FormGroup label={getLabel("label_district", language)}>
              <Input
                id="district"
                className="h-11 border-2"
                value={data.district}
                onChange={(e) => setData({ ...data, district: e.target.value })}
                placeholder={getLabel("placeholder_district", language)}
              />
            </FormGroup>
          </div>
        </div>
      </div>

      <Button
        onClick={nextStep}
        disabled={!isLocationValid || isDetecting}
        size="lg"
        className="w-full max-w-[400px] shadow-lg transition-all"
      >
        {getLabel("btn_continue", language)}
      </Button>
    </>
  );
}
