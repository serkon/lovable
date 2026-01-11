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
    <>
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          {getLabel("auth_title", language)}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("auth_desc", language)}
        </p>
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
    </>
  );
}
