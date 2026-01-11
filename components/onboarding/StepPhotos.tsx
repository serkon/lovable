"use client";

import { getLabel } from "@/lib/translations";
import { useAppStore } from "@/context/AppStore";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingData } from "@/app/onboarding/page";
import { Dispatch, SetStateAction, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { StepDescription } from "@/components/ui/step-description";

interface StepProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  nextStep: () => void;
}

export function StepPhotos({ data, setData, nextStep }: StepProps) {
  const { language } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (data.photos.length >= 6) {
        toast.error(
          getLabel("error_max_photos", language) || "Maksimum 6 fotoğraf ekleyebilirsiniz."
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setData((prev) => ({
          ...prev,
          photos: [...prev.photos, base64String],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          {getLabel("step_photos_title", language) || "Fotoğraflarını Ekle"}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("step_photos_subtitle", language) ||
            "Seni en iyi yansıtan fotoğrafları seç. En az 1 fotoğraf gereklidir."}
        </p>
      </div>

      <div className="mb-10 grid w-full grid-cols-2 gap-4 md:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
          const photo = data.photos[slotIndex];
          const isEmpty = !photo;

          return (
            <motion.div
              key={slotIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: slotIndex * 0.05 }}
              className="relative aspect-square"
            >
              {isEmpty ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:border-primary/50 group flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 transition-all hover:bg-neutral-50"
                >
                  <div className="rounded-full bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                    <Plus className="text-primary h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-500">
                    {slotIndex === 0
                      ? getLabel("photo_cover", language)
                      : getLabel("photo_number", language, { number: slotIndex + 1 })}
                  </span>
                </button>
              ) : (
                <div className="group hover:border-primary/50 relative h-full w-full overflow-hidden rounded-3xl border-2 border-transparent bg-neutral-100 shadow-md transition-all">
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => removePhoto(slotIndex)}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {slotIndex === 0 && (
                    <div className="bg-primary/90 absolute bottom-2 left-2 rounded-lg px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      {getLabel("photo_cover_badge", language)}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      <StepDescription
        text={getLabel("photos_safe_notice", language) || "Fotoğrafların güvenle saklanır."}
        icon={<ImageIcon className="h-4 w-4" />}
        data-test-id="photos-notice"
      />

      <Button
        onClick={nextStep}
        disabled={data.photos.length === 0}
        size="lg"
        className="w-full max-w-[400px] shadow-lg transition-all"
      >
        {getLabel("btn_continue", language)}
      </Button>
    </>
  );
}
