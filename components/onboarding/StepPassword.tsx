import { getLabel } from "@/lib/translations";
import { Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";

interface StepPasswordProps {
    data: OnboardingData;
    setData: (data: OnboardingData) => void;
    nextStep: () => void;
}

export default function StepPassword({ data, setData }: StepPasswordProps) {
    const { language } = useAppStore();
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{getLabel('auth_title', language)}</h2>
                <p className="text-muted-foreground">{getLabel('auth_desc', language)}</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <FormGroup label={getLabel('label_email', language)}>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder={getLabel('placeholder_email', language)}
                        />
                    </FormGroup>
                </div>
                <div className="space-y-2">
                    <FormGroup label={getLabel('label_password', language)}>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            placeholder={getLabel('placeholder_password', language)}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}