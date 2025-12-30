import { getLabel } from "@/lib/translations";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";
import { Check } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface StepAboutMeProps {
    data: OnboardingData;
    setData: Dispatch<SetStateAction<OnboardingData>>;
    bioTemplates: string[];
    toggleBioTemplate: (template: string) => void;
    nextStep: () => void;
}

export function StepAboutMe({ data, setData, bioTemplates, toggleBioTemplate, nextStep }: StepAboutMeProps) {
    const { language } = useAppStore();
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{getLabel('about_me', language)}</h2>
                <p className="text-muted-foreground">
                    {getLabel('ready_sentences', language)}
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="bio">{getLabel('bio', language)}</Label>
                    <Textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData({ ...data, bio: e.target.value })}
                        placeholder={getLabel('input_placeholder_bio', language)}
                    />
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-3">
                    <span className="text-xs font-semibold text-muted-foreground">{getLabel('suggested_sentences', language)}</span>
                    <div className="flex flex-wrap gap-2">
                        {bioTemplates.map((t, i) => {
                            const isSelected = data.bio.includes(t);
                            return (
                                <Button
                                    key={i}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleBioTemplate(t)}
                                    className="text-xs"
                                >
                                    {isSelected && <Check className="mr-1 w-3 h-3" />}
                                    {t}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Button onClick={nextStep} className="w-full">
                {getLabel('btn_continue', language)}
            </Button>
        </div>
    )
}