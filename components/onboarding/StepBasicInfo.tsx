import { getLabel } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingData } from "@/app/onboarding/page";
import { useAppStore } from "@/context/AppStore";
import { FormGroup } from "@/components/ui/form-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface StepBasicInfoProps {
    data: OnboardingData;
    setData: Dispatch<SetStateAction<OnboardingData>>;
    nextStep: () => void;
    jobsList: string[];
}

const COUNTRIES = ["Türkiye", "Germany", "United Kingdom", "United States", "Netherlands", "France", "Other"];

export function StepBasicInfo({ data, setData, nextStep, jobsList }: StepBasicInfoProps) {
    const { language } = useAppStore();

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{getLabel('introduce_yourself', language)}</h2>
                <p className="text-muted-foreground">{getLabel('how_to_address', language)}</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup
                        label={getLabel('label_name', language)}
                        className="col-span-2"
                    >
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            placeholder={getLabel('placeholder_name', language)}
                        />
                    </FormGroup>

                    <FormGroup label={getLabel('label_age', language)}>
                        <Input
                            id="age"
                            type="number"
                            value={data.age}
                            onChange={(e) => setData({ ...data, age: e.target.value })}
                            placeholder={getLabel('placeholder_age', language)}
                        />
                    </FormGroup>

                    <FormGroup label={getLabel('label_country', language)}>
                        <Select
                            value={data.country}
                            onValueChange={(val) => setData({ ...data, country: val })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </FormGroup>

                    <FormGroup
                        label={getLabel('label_city', language)}
                        className="col-span-2"
                    >
                        <Input
                            id="city"
                            value={data.city}
                            onChange={(e) => setData({ ...data, city: e.target.value })}
                            placeholder={getLabel('placeholder_city', language)}
                        />
                    </FormGroup>

                    <FormGroup
                        label={getLabel('label_job', language)}
                        className="col-span-2"
                    >
                        <Select
                            value={data.job}
                            onValueChange={(val) => setData({ ...data, job: val })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={getLabel('select_default', language)} />
                            </SelectTrigger>
                            <SelectContent>
                                {jobsList.map(j => <SelectItem key={j} value={j}>{getLabel(j, language)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </FormGroup>
                </div>
            </div>

            <Button
                onClick={nextStep}
                disabled={!data.name || !data.age || !data.city || !data.job || !data.country}
                className="w-full"
            >
                {getLabel('btn_continue', language)}
            </Button>
        </div>
    )
}