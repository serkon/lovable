import { getLabel } from "@/lib/translations";
import { Sparkles, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";

interface StepPreviewProps {
    data: OnboardingData;
    nextStep: () => void;
}

export function StepPreview({ data, nextStep }: StepPreviewProps) {
    const { language } = useAppStore();
    return (
        <div className="space-y-8 text-center">
            <div className="space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{getLabel('profile_ready', language)}</h2>
                <p className="text-muted-foreground">{getLabel('best_candidates', language)}</p>
            </div>

            <Card className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted flex items-center justify-center">
                        <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="font-bold">{data.name || getLabel('guest', language)}, {data.age || '40'}</h3>
                        <p className="text-xs text-muted-foreground">{data.city}</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    &quot;{data.bio || getLabel('no_bio_yet', language)}&quot;
                </p>
            </Card>

            <Button onClick={nextStep} className="w-full">
                {getLabel('btn_continue', language)}
            </Button>
        </div>
    )
}