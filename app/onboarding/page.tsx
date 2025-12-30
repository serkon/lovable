"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  GraduationCap,
  BookOpen,
  Check,
  ChevronLeft,
  Camera,
  Shield
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { APP_CONFIG } from "@/lib/config";
import { updateUserProfile, registerUser } from "@/lib/actions/userActions";
import { getBioTemplates, getHobbies, getMaritalStatuses, getEducations, getIntentions, getJobs } from "@/lib/actions/contentActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StepGender } from "@/components/onboarding/StepGender";
import { StepBasicInfo } from "@/components/onboarding/StepBasicInfo";
import { StepAboutMe } from "@/components/onboarding/StepAboutMe";
import { StepDetails } from "@/components/onboarding/StepDetails";
import { StepHobbies } from "@/components/onboarding/StepHobbies";
import { StepPreview } from "@/components/onboarding/StepPreview";
import StepPassword from "@/components/onboarding/StepPassword";

const COUNTRIES = ["Türkiye", "Germany", "United Kingdom", "United States", "Netherlands", "France", "Other"];

export type OnboardingData = {
  name: string;
  age: string;
  city: string;
  country: string;
  job: string;
  gender: string;
  bio: string;
  intention: string;
  education: string;
  maritalStatus: string;
  hobbies: string[];
  email?: string;
  password?: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const { language } = useAppStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    city: "",
    country: "Türkiye",
    job: "",
    gender: "",
    bio: "",
    intention: "",
    education: "",
    maritalStatus: "",
    hobbies: [],
    email: "",
    password: "",
  });
  const [jobsList, setJobsList] = useState<string[]>([]);

  const [bioTemplates, setBioTemplates] = useState<string[]>([]);
  const [hobbiesList, setHobbiesList] = useState<string[]>([]);
  const [maritalStatusesList, setMaritalStatusesList] = useState<string[]>([]);
  const [educationsList, setEducationsList] = useState<string[]>([]);
  const [intentionsList, setIntentionsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [dbBioTemplates, dbHobbies, dbMarital, dbEdu, dbIntention, dbJobs] = await Promise.all([
        getBioTemplates(),
        getHobbies(),
        getMaritalStatuses(),
        getEducations(),
        getIntentions(),
        getJobs()
      ]);
      setBioTemplates(dbBioTemplates || []);
      setHobbiesList(dbHobbies || []);
      setMaritalStatusesList(dbMarital || []);
      setEducationsList(dbEdu || []);
      setIntentionsList(dbIntention || []);
      setJobsList(dbJobs || []);
    };
    fetchData();
  }, []);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleFinish = async (skipAuth = false) => {
    setLoading(true);
    try {
      await updateUserProfile({
        name: data.name,
        age: parseInt(data.age),
        city: data.city,
        job: data.job,
        gender: data.gender,
        bio: data.bio,
        intention: data.intention,
        education: data.education,
        maritalStatus: data.maritalStatus,
        hobbies: data.hobbies,
      });

      if (!skipAuth && data.email && data.password) {
        const res = await registerUser({
          email: data.email,
          password: data.password,
          country: data.country,
        });

        if (!res.success) {
          alert(res.error);
          setLoading(false);
          return;
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert(getLabel('error_generic', language));
      setLoading(false);
    }
  };

  const toggleHobby = (hobby: string) => {
    setData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter((h) => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const toggleBioTemplate = (template: string) => {
    setData((prev) => {
      const exists = prev.bio.includes(template);
      if (exists) {
        const newBio = prev.bio.replace(template, "").replace(/\s\s+/g, ' ').trim();
        return { ...prev, bio: newBio };
      } else {
        const newBio = prev.bio ? `${prev.bio} ${template}` : template;
        return { ...prev, bio: newBio };
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4">
      <Logo size={48} className="mb-6" />

      {/* Progress Stepper */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 px-2">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 7 && (
              <div
                className={cn(
                  "h-1 flex-1 mx-2 rounded-full",
                  step > s ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        {step > 1 && (
          <Button
            variant="ghost"
            onClick={prevStep}
            className="flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> {getLabel('back', language)}
          </Button>
        )}

        {/* STEP 1: GENDER */}
        {step === 1 && (
          <StepGender data={data} setData={setData} nextStep={nextStep} />
        )}

        {/* STEP 2: BASIC INFO */}
        {step === 2 && (
          <StepBasicInfo data={data} setData={setData} nextStep={nextStep} jobsList={jobsList} />
        )}

        {/* STEP 3: BIO / ABOUT ME */}
        {step === 3 && (
          <StepAboutMe data={data} setData={setData} bioTemplates={bioTemplates} toggleBioTemplate={toggleBioTemplate} nextStep={nextStep} />
        )}

        {/* STEP 4: DETAILS */}
        {step === 4 && (
          <StepDetails data={data} setData={setData} nextStep={nextStep} intentionsList={intentionsList} educationsList={educationsList} maritalStatusesList={maritalStatusesList} />
        )}

        {/* STEP 5: HOBBIES */}
        {step === 5 && (
          <StepHobbies data={data} setData={setData} hobbiesList={hobbiesList} nextStep={nextStep} />
        )}

        {/* STEP 6: PREVIEW */}
        {step === 6 && (
          <StepPreview data={data} nextStep={nextStep} />
        )}

        {/* STEP 7: SECURE ACCOUNT */}
        {step === 7 && (
          <StepPassword data={data} setData={setData} nextStep={nextStep} />
        )}

        {/* STEP 7: FINISH */}
        {step === 7 && (
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => handleFinish(false)}
              disabled={loading || !data.email || !data.password}
              className="w-full"
            >
              {loading ? getLabel('saving', language) : getLabel('btn_complete_auth', language)}
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleFinish(true)}
              disabled={loading}
              className="w-full"
            >
              {getLabel('btn_skip_auth', language)}
            </Button>
          </div>
        )}

        <div className="text-center pt-8">
          <p className="text-xs text-muted-foreground font-medium">
            {getLabel('step_count', language, { step: step })}
          </p>
        </div>
      </div>
    </div>
  );
}
