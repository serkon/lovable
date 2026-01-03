import { getLabel } from "@/lib/translations";
import { useAppStore } from "@/context/AppStore";
import { Lock, Venus, Mars, NonBinary } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChoiceCard, ChoiceOption } from "@/components/ui/choice-card";
import { OnboardingData } from "@/app/onboarding/page";
import { Dispatch, SetStateAction, useMemo } from "react";

interface StepProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  nextStep: () => void;
  getGendersList: () => string[];
}

// Gender ID to icon mapping
const genderIconMap: Record<string, React.ReactNode> = {
  gender_female: <Venus />,
  gender_male: <Mars />,
  gender_non_binary: <NonBinary />,
};

export function StepGender({ data, setData, nextStep, getGendersList }: StepProps) {
  const { language } = useAppStore();

  const gendersList = getGendersList();

  const options = useMemo<ChoiceOption[]>(() => {
    return gendersList.map((genderId) => ({
      id: genderId,
      label: getLabel(genderId, language),
      icon: genderIconMap[genderId] || <Mars />,
    }));
  }, [gendersList, language]);

  return (
    <>
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          {getLabel("gender_question", language)}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("gender_subtitle", language)}
        </p>
      </div>

      <div className="mb-10 flex w-full flex-col gap-6">
        {options.map((opt) => (
          <ChoiceCard
            key={opt.id}
            option={opt}
            isSelected={data.gender === opt.id}
            onSelect={() => setData({ ...data, gender: opt.id })}
            size="lg"
          />
        ))}
      </div>

      <div className="mb-8 flex items-center justify-center gap-2 text-xs font-medium text-neutral-400">
        <Lock className="h-4 w-4" />
        <span>{getLabel("gender_visible_notice", language)}</span>
      </div>

      <Button
        onClick={nextStep}
        disabled={!data.gender}
        className="h-14 w-full max-w-[400px] rounded-xl text-lg font-medium shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
      >
        {getLabel("btn_continue", language)}
      </Button>
    </>
  );
}
