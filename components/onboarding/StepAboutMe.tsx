import { getLabel } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";
import LifestyleCardComponent from "@/components/ui/card-carousel";
import { Dispatch, SetStateAction, useState } from "react";
import { FormGroup } from "@/components/ui/form-group";
import { fetchBioSuggestions } from "@/lib/actions/aiActions";
import { BioTemplateMetadata } from "@/lib/constants";

interface StepAboutMeProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  bioTemplates: BioTemplateMetadata[];
  hobbies: string[];
  nextStep: () => void;
}

export function StepAboutMe({ data, bioTemplates, hobbies, setData, nextStep }: StepAboutMeProps) {
  const { language } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [shuffledTemplates, setShuffledTemplates] = useState(bioTemplates);
  const [isImproving, setIsImproving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  console.log("hobbies", hobbies);

  const handleAIImprove = () => {
    setIsImproving(true);
    // Mock AI improvement delay which would call an endpoint
    setTimeout(() => {
      setIsImproving(false);
      // In a real app, this would update data.bio with the improved version
      // For now, we simulate the action completing
    }, 1500);
  };

  const handleAISuggestmore = async () => {
    console.log("bioSuggestions", bioTemplates, shuffledTemplates);

    setIsSuggesting(true);
    setShuffledTemplates((prev) => [...prev].sort(() => 0.5 - Math.random()));
    const bioSuggestions = await fetchBioSuggestions(shuffledTemplates, hobbies, language);
    setShuffledTemplates(bioSuggestions);
    console.log("bioSuggestions", bioSuggestions, shuffledTemplates);
    setActiveIndex(0);
    setIsSuggesting(false);
  };

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
    if (shuffledTemplates.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % shuffledTemplates.length);
  };

  const handlePrev = () => {
    if (shuffledTemplates.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + shuffledTemplates.length) % shuffledTemplates.length);
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

        <div className="mt-[-25px] mb-8 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIImprove}
            disabled={isImproving || !data.bio}
            className="text-primary hover:bg-primary/5 gap-2 text-xs"
          >
            {isImproving ? (
              <span className="material-icons-round animate-spin text-sm">autorenew</span>
            ) : (
              <span className="material-icons-round text-sm">auto_awesome</span>
            )}
            {getLabel("ai_improve", language) || "AI ile İyileştir"}
          </Button>
        </div>

        {/* Category Label - Separator Style */}
        <div className="m-auto flex w-full max-w-[20rem] items-center gap-4 sm:max-w-[24rem]">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {getLabel("suggested_sentences", language)}
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
        </div>

        {shuffledTemplates.length > 0 && (
          <div className="flex w-full flex-col items-center justify-center py-4">
            <LifestyleCardComponent
              items={shuffledTemplates}
              activeIndex={activeIndex}
              onAdd={() =>
                shuffledTemplates[activeIndex] &&
                toggleBioTemplate(shuffledTemplates[activeIndex].content)
              }
              onNext={handleNext}
              onPrev={handlePrev}
              isAdded={
                shuffledTemplates[activeIndex]
                  ? data.bio.includes(shuffledTemplates[activeIndex].content)
                  : false
              }
              direction={direction}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAISuggestmore}
              disabled={isSuggesting}
              className="text-muted-foreground hover:text-primary mt-2 gap-2 text-xs"
            >
              {isSuggesting ? (
                <span className="material-icons-round animate-spin text-sm">refresh</span>
              ) : (
                <span className="material-icons-round text-sm">tips_and_updates</span>
              )}
              {getLabel("ai_suggest_more", language) || "AI ile Daha Fazla Öner"}
            </Button>
          </div>
        )}
      </div>

      <Button onClick={nextStep} className="w-full">
        {getLabel("btn_continue", language)}
      </Button>
    </>
  );
}
