import { getLabel } from "@/lib/translations";
import { Shield, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";
import { useAppStore } from "@/context/AppStore";
import { OnboardingData } from "@/app/onboarding/page";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface StepPasswordProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  nextStep: () => void;
}

export default function StepPassword({ data, setData }: StepPasswordProps) {
  const { language } = useAppStore();

  const strength = useMemo(() => {
    const p = data.password || "";
    let score = 0;
    if (p.length > 5) score++;
    if (p.length > 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [data.password]);

  const strengthConfig = [
    { label: "Çok Zayıf", color: "bg-destructive", text: "text-destructive" },
    { label: "Zayıf", color: "bg-orange-500", text: "text-orange-500" },
    { label: "Orta", color: "bg-yellow-500", text: "text-yellow-500" },
    { label: "Güçlü", color: "bg-emerald-500", text: "text-emerald-500" },
  ];

  const currentStrength = strength > 0 ? strengthConfig[strength - 1] : null;

  return (
    <>
      <div className="mb-10 space-y-3 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-600">
            <Shield className="h-4 w-4" />
            {getLabel("secure_account_badge", language) || "Hesabını Güvenceye Al"}
          </div>
        </div>
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          {getLabel("auth_title", language)}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("auth_desc", language)}
        </p>
      </div>

      <div className="w-full space-y-6">
        <FormGroup label={getLabel("label_password", language)}>
          <div className="group relative">
            <Input
              id="password"
              type="password"
              className="focus:border-primary h-14 rounded-2xl border-2 pl-12 text-lg shadow-sm transition-all"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder={getLabel("placeholder_password", language)}
            />
            <Shield className="group-focus-within:text-primary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400 transition-colors" />
          </div>
        </FormGroup>

        {/* Strength Indicator */}
        {data.password && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-300">
            <div className="flex items-center justify-between px-1 text-xs font-bold tracking-widest uppercase">
              <span className="text-muted-foreground">Şifre Gücü</span>
              <span className={cn(currentStrength?.text)}>{currentStrength?.label}</span>
            </div>
            <div className="flex h-1.5 w-full gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-full flex-1 rounded-full transition-all duration-500",
                    i <= strength ? currentStrength?.color : "bg-neutral-100 dark:bg-neutral-800"
                  )}
                />
              ))}
            </div>
            <ul className="text-muted-foreground mt-4 grid grid-cols-2 gap-2 text-xs font-medium">
              <li className="flex items-center gap-1.5">
                {data.password.length > 8 ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                En az 8 karakter
              </li>
              <li className="flex items-center gap-1.5">
                {/[A-Z]/.test(data.password) ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Büyük harf
              </li>
              <li className="flex items-center gap-1.5">
                {/[0-9]/.test(data.password) ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Rakam
              </li>
              <li className="flex items-center gap-1.5">
                {/[^A-Za-z0-9]/.test(data.password) ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Özel karakter
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
