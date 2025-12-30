import { getLabel } from "@/lib/translations";
import { useAppStore } from "@/context/AppStore";
import { cn } from "@/lib/utils";
import { User, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OnboardingData } from "@/app/onboarding/page";
import { Dispatch, SetStateAction } from "react";

interface StepProps {
    data: OnboardingData;
    setData: Dispatch<SetStateAction<OnboardingData>>;
    nextStep: () => void;
}

export function StepGender({ data, setData, nextStep }: StepProps) {
    const { language } = useAppStore();

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">{getLabel("welcome", language)}</h2>
                <p className="text-muted-foreground">{getLabel("start_with_gender", language)}</p>
            </div>
            <div className="grid gap-4">
                {["gender_female", "gender_male"].map((gid) => (
                    <Card
                        key={gid}
                        onClick={() => {
                            setData({ ...data, gender: gid });
                            nextStep();
                        }}
                        className={cn(
                            "flex cursor-pointer items-center gap-4 p-4",
                            data.gender === gid ? "border-primary bg-muted" : "hover:bg-accent"
                        )}
                    >
                        <User className="h-6 w-6" />
                        <h3 className="font-semibold">{getLabel(gid, language)}</h3>
                        <ArrowRight className="text-muted-foreground ml-auto h-4 w-4" />
                    </Card>
                ))}
            </div>
        </div>
    );
}
