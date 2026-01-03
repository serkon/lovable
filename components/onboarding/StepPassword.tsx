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
      <div className="space-y-2 text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Shield className="text-primary h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">{getLabel("auth_title", language)}</h2>
        <p className="text-muted-foreground">{getLabel("auth_desc", language)}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <FormGroup label={getLabel("label_password", language)}>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder={getLabel("placeholder_password", language)}
            />
          </FormGroup>
        </div>
      </div>
    </div>
  );
}
