"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
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
import { getCurrentUser, createGuestUser } from "@/lib/actions/userActions";
import { JobMetadata, BioTemplateMetadata } from "@/lib/constants";

import { StepGender } from "@/components/onboarding/StepGender";
import { StepBasicInfo } from "@/components/onboarding/StepBasicInfo";
import { StepAboutMe } from "@/components/onboarding/StepAboutMe";
import { StepHobbies } from "@/components/onboarding/StepHobbies";
import { StepPreview } from "@/components/onboarding/StepPreview";
import StepPassword from "@/components/onboarding/StepPassword";
import { StepIndicator } from "@/components/ui/step-indicator";
import React from "react";

export type OnboardingData = {
  firstName: string;
  lastName: string;
  age: string;
  city: string;
  district: string;
  country: string;
  job: string;
  gender: string;
  bio: string;
  intention: string;
  education: string;
  maritalStatus: string;
  hobbies: string[];
  email?: string;
  phone?: string;
  password?: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const { language, refreshCurrentUser } = useAppStore();
  const [step, setStep] = useState(1);
  const [jobsList, setJobsList] = useState<JobMetadata[]>([]);
  const [gendersList, setGendersList] = useState<string[]>([]);
  const [bioTemplates, setBioTemplates] = useState<BioTemplateMetadata[]>([]);
  const [hobbiesList, setHobbiesList] = useState<string[]>([]);
  const [maritalStatusesList, setMaritalStatusesList] = useState<string[]>([]);
  const [educationsList, setEducationsList] = useState<string[]>([]);
  const [intentionsList, setIntentionsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    district: "",
    country: "Türkiye",
    job: "",
    gender: gendersList[0] || "",
    bio: "",
    intention: "",
    education: "",
    maritalStatus: "",
    hobbies: [],
    email: "",
    phone: "",
    password: "",
  });
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  const handleFinish = async (skipAuth = false) => {
    setLoading(true);
    try {
      // Ensure we have a valid session before updating
      const user = await getCurrentUser();
      if (!user) {
        console.info("No session found, creating guest user...");
        await createGuestUser();
      }

      await updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        age: parseInt(data.age),
        city: data.city,
        district: data.district,
        job: data.job,
        gender: data.gender,
        bio: data.bio,
        intention: data.intention,
        education: data.education,
        maritalStatus: data.maritalStatus,
        hobbies: data.hobbies,
        phone: data.phone,
        email: data.email,
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

      await refreshCurrentUser();
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Failed to save profile:", error);
      const err = error as Error & { message?: string };
      if (err?.message === "Bu e-posta adresi zaten kullanımda.") {
        alert(err.message);
      } else {
        alert(getLabel("error_generic", language));
      }
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
      setBioTemplates(dbBioTemplates ? [...dbBioTemplates].sort(() => 0.5 - Math.random()) : []);
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
    <React.Fragment>
      <Header
        variant="landing"
        onBack={step > 1 ? prevStep : undefined}
        backHref={step === 1 ? "/" : undefined}
      />

      <div className="flex w-full flex-col items-center" data-testid="onboarding">
        {/* Progress Stepper */}
        <StepIndicator
          currentStep={step}
          totalSteps={6}
          onStepClick={setStep}
          data-testid="onboarding-progress"
        />

        {/* Content */}
        <div
          className="flex w-full max-w-lg flex-col items-center"
          data-testid="onboarding-content"
        >
          {/* STEP 1: GENDER */}
          {step === 1 && (
            <StepGender
              data={data}
              setData={setData}
              nextStep={nextStep}
              getGendersList={() => gendersList}
            />
          )}

          {/* STEP 2: BASIC INFO & DETAILS */}
          {step === 2 && (
            <StepBasicInfo
              data={data}
              setData={setData}
              nextStep={nextStep}
              jobsList={jobsList}
              intentionsList={intentionsList}
              educationsList={educationsList}
              maritalStatusesList={maritalStatusesList}
            />
          )}

          {/* STEP 3: BIO / ABOUT ME */}
          {step === 3 && (
            <StepAboutMe
              key={bioTemplates.length}
              data={data}
              hobbies={hobbiesList}
              setData={setData}
              bioTemplates={bioTemplates}
              nextStep={nextStep}
            />
          )}

          {/* STEP 4: HOBBIES */}
          {step === 4 && (
            <StepHobbies
              data={data}
              setData={setData}
              hobbiesList={hobbiesList}
              nextStep={nextStep}
            />
          )}

          {/* STEP 5: PREVIEW */}
          {step === 5 && <StepPreview data={data} setData={setData} nextStep={nextStep} />}

          {/* STEP 6: SECURE ACCOUNT */}
          {step === 6 && <StepPassword data={data} setData={setData} nextStep={nextStep} />}

          {/* STEP 6: FINISH */}
          {step === 6 && (
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
    </React.Fragment>
  );
}
