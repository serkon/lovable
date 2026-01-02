"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { updateUserProfile, registerUser } from "@/lib/actions/userActions";
import {
  getBioTemplates,
  getHobbies,
  getMaritalStatuses,
  getEducations,
  getIntentions,
  getJobs,
  getGenders,
} from "@/lib/actions/contentActions";

import { StepGender } from "@/components/onboarding/StepGender";
import { StepBasicInfo } from "@/components/onboarding/StepBasicInfo";
import { StepAboutMe } from "@/components/onboarding/StepAboutMe";
import { StepDetails } from "@/components/onboarding/StepDetails";
import { StepHobbies } from "@/components/onboarding/StepHobbies";
import { StepPreview } from "@/components/onboarding/StepPreview";
import StepPassword from "@/components/onboarding/StepPassword";
import { StepIndicator } from "@/components/ui/step-indicator";

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
  const [jobsList, setJobsList] = useState<string[]>([]);
  const [gendersList, setGendersList] = useState<string[]>([]);
  const [bioTemplates, setBioTemplates] = useState<string[]>([]);
  const [hobbiesList, setHobbiesList] = useState<string[]>([]);
  const [maritalStatusesList, setMaritalStatusesList] = useState<string[]>([]);
  const [educationsList, setEducationsList] = useState<string[]>([]);
  const [intentionsList, setIntentionsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    city: "",
    country: "Türkiye",
    job: "",
    gender: gendersList[0] || "",
    bio: "",
    intention: "",
    education: "",
    maritalStatus: "",
    hobbies: [],
    email: "",
    password: "",
  });
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
      alert(getLabel("error_generic", language));
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [dbBioTemplates, dbHobbies, dbMarital, dbEdu, dbIntention, dbJobs, dbGenders] =
        await Promise.all([
          getBioTemplates(),
          getHobbies(),
          getMaritalStatuses(),
          getEducations(),
          getIntentions(),
          getJobs(),
          getGenders(),
        ]);
      setBioTemplates(dbBioTemplates || []);
      setHobbiesList(dbHobbies || []);
      setMaritalStatusesList(dbMarital || []);
      setEducationsList(dbEdu || []);
      setIntentionsList(dbIntention || []);
      setJobsList(dbJobs || []);
      setGendersList(dbGenders || []);

      if (dbGenders && dbGenders.length > 0) {
        setData((prev) => ({
          ...prev,
          gender: dbGenders[0],
        }));
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="bg-background flex min-h-screen flex-col items-center px-4 py-8"
      data-testid="onboarding-page-container"
    >
      <Logo size={48} className="mb-6" />

      {/* Progress Stepper */}
      <div className="flex w-full max-w-md justify-center" data-testid="onboarding-progress">
        <StepIndicator currentStep={step} totalSteps={7} onStepClick={setStep} />
      </div>

      <div className="flex w-full max-w-lg flex-col items-center" data-testid="onboarding-content">
        {step > 1 && (
          <Button variant="ghost" onClick={prevStep} className="mb-4 flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> {getLabel("back", language)}
          </Button>
        )}

        {/* STEP 1: GENDER */}
        {step === 1 && (
          <StepGender
            data={data}
            setData={setData}
            nextStep={nextStep}
            getGendersList={() => gendersList}
          />
        )}

        {/* STEP 2: BASIC INFO */}
        {step === 2 && (
          <StepBasicInfo data={data} setData={setData} nextStep={nextStep} jobsList={jobsList} />
        )}

        {/* STEP 3: BIO / ABOUT ME */}
        {step === 3 && (
          <StepAboutMe
            data={data}
            setData={setData}
            bioTemplates={bioTemplates}
            nextStep={nextStep}
          />
        )}

        {/* STEP 4: DETAILS */}
        {step === 4 && (
          <StepDetails
            data={data}
            setData={setData}
            nextStep={nextStep}
            intentionsList={intentionsList}
            educationsList={educationsList}
            maritalStatusesList={maritalStatusesList}
          />
        )}

        {/* STEP 5: HOBBIES */}
        {step === 5 && (
          <StepHobbies
            data={data}
            setData={setData}
            hobbiesList={hobbiesList}
            nextStep={nextStep}
          />
        )}

        {/* STEP 6: PREVIEW */}
        {step === 6 && <StepPreview data={data} nextStep={nextStep} />}

        {/* STEP 7: SECURE ACCOUNT */}
        {step === 7 && <StepPassword data={data} setData={setData} nextStep={nextStep} />}

        {/* STEP 7: FINISH */}
        {step === 7 && (
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => handleFinish(false)}
              disabled={loading || !data.email || !data.password}
              className="w-full"
            >
              {loading ? getLabel("saving", language) : getLabel("btn_complete_auth", language)}
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleFinish(true)}
              disabled={loading}
              className="w-full"
            >
              {getLabel("btn_skip_auth", language)}
            </Button>
          </div>
        )}

        <div className="pt-8 text-center">
          <p className="text-muted-foreground text-xs font-medium">
            {getLabel("step_count", language, { step: step })}
          </p>
        </div>
      </div>
    </div>
  );
}
