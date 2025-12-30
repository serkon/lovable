import { getLabel } from "@/lib/translations";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Heart, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingData } from "@/app/onboarding/page";
import { useAppStore } from "@/context/AppStore";
import { FormGroup } from "../ui/form-group";
import React, { Dispatch, SetStateAction } from "react";

interface StepDetailsProps {
    data: OnboardingData;
    setData: Dispatch<SetStateAction<OnboardingData>>;
    intentionsList: string[];
    educationsList: string[];
    maritalStatusesList: string[];
    nextStep: () => void;
}

export function StepDetails({ data, setData, intentionsList, educationsList, maritalStatusesList, nextStep }: StepDetailsProps) {
    const { language } = useAppStore();

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{getLabel('more_details', language)}</h2>
                <p className="text-muted-foreground">{getLabel('help_us_find', language)}</p>
            </div>

            <div className="space-y-6">
                <FormGroup
                    label={
                        <React.Fragment>
                            <Heart className="w-4 h-4" /> {getLabel('intention', language)}
                        </React.Fragment>
                    }
                >
                    <Select
                        value={data.intention}
                        onValueChange={(val) => setData({ ...data, intention: val })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getLabel('select_default', language)} />
                        </SelectTrigger>
                        <SelectContent>
                            {intentionsList.map(i => <SelectItem key={i} value={i}>{getLabel(i, language)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup
                    label={
                        <React.Fragment>
                            <GraduationCap className="w-4 h-4" /> {getLabel('education', language)}
                        </React.Fragment>
                    }
                >
                    <Select
                        value={data.education}
                        onValueChange={(val) => setData({ ...data, education: val })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getLabel('select_default', language)} />
                        </SelectTrigger>
                        <SelectContent>
                            {educationsList.map(e => <SelectItem key={e} value={e}>{getLabel(e, language)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup
                    label={
                        <React.Fragment>
                            <BookOpen className="w-4 h-4" /> {getLabel('maritalStatus', language)}
                        </React.Fragment>
                    }
                >
                    <Select
                        value={data.maritalStatus}
                        onValueChange={(val) => setData({ ...data, maritalStatus: val })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getLabel('select_default', language)} />
                        </SelectTrigger>
                        <SelectContent>
                            {maritalStatusesList.map(s => <SelectItem key={s} value={s}>{getLabel(s, language)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </FormGroup>
            </div>

            <Button
                onClick={nextStep}
                disabled={!data.intention || !data.education || !data.maritalStatus}
                className="w-full"
            >
                {getLabel('btn_continue', language)}
            </Button>
        </div>
    )
}