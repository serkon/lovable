import { getLabel } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";
import LifestyleCardComponent from "@/components/ui/card-carousel";
import { SectionSeparator } from "@/components/ui/section-separator";
import { Dispatch, SetStateAction, useState } from "react";
import { FormGroup } from "@/components/ui/form-group";
import { aiActionFetchBioSuggestions, aiActionImproveBio } from "@/lib/actions/aiActions";
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
  const improveBioWithAI = async () => {
    setIsImproving(true);
    // Mock AI improvement delay which would call an endpoint
    const improvedBio = await aiActionImproveBio(data.bio);
    setIsImproving(false);
    setData({ ...data, bio: improvedBio.bio });
  };

  const handleAISuggestmore = async () => {
    setIsSuggesting(true);
    setShuffledTemplates((prev) => [...prev].sort(() => 0.5 - Math.random()));
    const bioSuggestions = await aiActionFetchBioSuggestions(shuffledTemplates, hobbies, language);
    setShuffledTemplates(bioSuggestions);
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

      <div className="mb-10 flex w-full flex-col gap-8">
        <FormGroup label={getLabel("bio", language)} className="relative">
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            placeholder={getLabel("input_placeholder_bio", language)}
            className="min-h-[120px] pb-12"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={improveBioWithAI}
            disabled={isImproving || !data.bio}
            className="text-primary absolute right-4 bottom-[1px] left-2 gap-2 bg-white text-xs"
          >
            {isImproving ? (
              <span className="material-icons-round animate-spin text-sm">autorenew</span>
            ) : (
              <span className="material-icons-round text-sm">auto_awesome</span>
            )}
            {getLabel("ai_improve", language) || "AI ile İyileştir"}
          </Button>
        </FormGroup>

        {/* Category Label - Separator Style */}
        <SectionSeparator
          label={getLabel("suggested_sentences", language)}
          maxWidth="sm"
          data-test-id="about-me-separator"
        />

        {shuffledTemplates.length > 0 && (
          <div className="flex w-full flex-col items-center justify-center">
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
              variant="link"
              size="sm"
              onClick={handleAISuggestmore}
              disabled={isSuggesting}
              className="mt-6 text-xs"
              data-test-id="ai-suggest-more-button"
            >
              {isSuggesting ? (
                <span className="material-icons-round animate-spin">refresh</span>
              ) : (
                <span className="material-icons-round">tips_and_updates</span>
              )}
              {getLabel("ai_suggest_more", language) || "AI ile Daha Fazla Öner"}
            </Button>
          </div>
        )}
      </div>

      <Button onClick={nextStep} className="w-full max-w-[400px] shadow-lg transition-all">
        {getLabel("btn_continue", language)}
      </Button>
    </>
  );
}
