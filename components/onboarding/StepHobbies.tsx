import { getLabel } from "@/lib/translations";
import { APP_CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingData } from "@/app/onboarding/page";
import { useAppStore } from "@/context/AppStore";
import { Dispatch, SetStateAction } from "react";

interface Hobbies {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  hobbiesList: string[];
  nextStep: () => void;
}

export function StepHobbies({ data, setData, nextStep, hobbiesList }: Hobbies) {
  const { language } = useAppStore();

  const toggleHobby = (hobby: string) => {
    setData((prev: OnboardingData) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter((h) => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{getLabel("hobbies", language)}</h2>
        <p className="text-muted-foreground text-sm">
          {getLabel("min_hobbies_req", language, { min: APP_CONFIG.MIN_HOBBIES_COUNT })}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 py-4">
        {hobbiesList.map((hobby) => (
          <Badge
            key={hobby}
            variant={data.hobbies.includes(hobby) ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => toggleHobby(hobby)}
          >
            {getLabel(hobby, language)}
          </Badge>
        ))}
      </div>

      <Button
        onClick={nextStep}
        disabled={data.hobbies.length < APP_CONFIG.MIN_HOBBIES_COUNT}
        className="w-full"
      >
        {getLabel("btn_looks_great", language)}
      </Button>
    </div>
  );
}
