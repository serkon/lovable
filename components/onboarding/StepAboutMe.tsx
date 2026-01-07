import { getLabel } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";
import LifestyleCardComponent, { LifestyleCard } from "@/components/ui/card-carousel";
import { Dispatch, SetStateAction, useState } from "react";
import { FormGroup } from "@/components/ui/form-group";

interface StepAboutMeProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  bioTemplates: string[];
  nextStep: () => void;
}

export function StepAboutMe({ data, setData, bioTemplates, nextStep }: StepAboutMeProps) {
  const { language } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const toggleBioTemplate = (template: string) => {
    setData((prev) => {
      const exists = prev.bio.includes(template);
      if (exists) {
        const newBio = prev.bio.replace(template, "").replace(/\s\s+/g, " ").trim();
        return { ...prev, bio: newBio };
      } else {
        const newBio = prev.bio ? `${prev.bio} ${template}` : template;
        return { ...prev, bio: newBio };
      }
    });
  };

  const handleNext = () => {
    if (bioTemplates.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % bioTemplates.length);
  };

  const handlePrev = () => {
    if (bioTemplates.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + bioTemplates.length) % bioTemplates.length);
  };

  const currentTemplate = bioTemplates[activeIndex] || "";
  const isSelected = data.bio.includes(currentTemplate);

  const currentCard: LifestyleCard = {
    id: currentTemplate,
    category: getLabel("suggested_sentences", language),
    content: currentTemplate,
  };

  return (
    <>
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          {getLabel("about_me", language)}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("ready_sentences", language)}
        </p>
      </div>

      <div className="mb-10 w-full">
        <FormGroup label={getLabel("bio", language)}>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            placeholder={getLabel("input_placeholder_bio", language)}
            className="min-h-[120px]"
          />
        </FormGroup>

        {bioTemplates.length > 0 && (
          <div className="flex w-full justify-center py-4">
            <LifestyleCardComponent
              card={currentCard}
              onAdd={() => toggleBioTemplate(currentTemplate)}
              onNext={handleNext}
              onPrev={handlePrev}
              isAdded={isSelected}
              direction={direction}
            />
          </div>
        )}
      </div>

      <Button onClick={nextStep} className="w-full">
        {getLabel("btn_continue", language)}
      </Button>
    </>
  );
}
