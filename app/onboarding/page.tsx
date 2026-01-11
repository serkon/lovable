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
  getCountries,
} from "@/lib/actions/contentActions";
import { getCurrentUser, createGuestUser } from "@/lib/actions/userActions";
import { JobMetadata, BioTemplateMetadata } from "@/lib/constants";

import { StepGender } from "@/components/onboarding/StepGender";
import { StepBasicInfo } from "@/components/onboarding/StepBasicInfo";
import { StepAboutMe } from "@/components/onboarding/StepAboutMe";
import { StepHobbies } from "@/components/onboarding/StepHobbies";
import { StepPreview } from "@/components/onboarding/StepPreview";
import StepPassword from "@/components/onboarding/StepPassword";
import { StepPhotos } from "@/components/onboarding/StepPhotos";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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
  photos: string[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const { language, refreshCurrentUser } = useAppStore();
  const [step, setStep] = useState(1);
  const step_count = 7;
  const [jobsList, setJobsList] = useState<JobMetadata[]>([]);
  const [gendersList, setGendersList] = useState<string[]>([]);
  const [bioTemplates, setBioTemplates] = useState<BioTemplateMetadata[]>([]);
  const [hobbiesList, setHobbiesList] = useState<string[]>([]);
  const [maritalStatusesList, setMaritalStatusesList] = useState<string[]>([]);
  const [educationsList, setEducationsList] = useState<string[]>([]);
  const [intentionsList, setIntentionsList] = useState<string[]>([]);
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    district: "",
    country: "Türkiye",
    job: "",
    gender: "",
    bio: "",
    intention: "",
    education: "",
    maritalStatus: "",
    hobbies: [],
    email: "",
    phone: "",
    password: "",
    photos: [],
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleFinish = async (skipAuth = false) => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
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
        // photos can be added to updateUserProfile if supported, for now they are in local state
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

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    if (step === step_count) {
      const timer = setTimeout(() => triggerConfetti(), 400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        dbBioTemplates,
        dbHobbies,
        dbMarital,
        dbEdu,
        dbIntention,
        dbJobs,
        dbGenders,
        dbCountries,
      ] = await Promise.all([
        getBioTemplates(),
        getHobbies(),
        getMaritalStatuses(),
        getEducations(),
        getIntentions(),
        getJobs(),
        getGenders(),
        getCountries(),
      ]);
      setBioTemplates(dbBioTemplates ? [...dbBioTemplates].sort(() => 0.5 - Math.random()) : []);
      setHobbiesList(dbHobbies || []);
      setMaritalStatusesList(dbMarital || []);
      setEducationsList(dbEdu || []);
      setIntentionsList(dbIntention || []);
      setJobsList(dbJobs || []);
      setGendersList(dbGenders || []);
      setCountriesList(dbCountries || []);

      if (dbGenders && dbGenders.length > 0) {
        setData((prev) => ({ ...prev, gender: dbGenders[0] }));
      }
      setIsDataLoaded(true);
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
        <StepIndicator
          currentStep={step}
          totalSteps={step_count}
          onStepClick={setStep}
          data-testid="onboarding-progress"
        />

        <div
          className="flex w-full max-w-lg flex-col items-center"
          data-testid="onboarding-content"
        >
          {!isDataLoaded ? (
            <div className="w-full animate-pulse space-y-8">
              <div className="flex flex-col items-center space-y-3">
                <Skeleton className="h-10 w-2/3 rounded-full" />
                <Skeleton className="h-6 w-1/2 rounded-full" />
              </div>
              <div className="w-full space-y-4">
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
              </div>
              <Skeleton className="mt-10 h-12 w-full rounded-2xl" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex w-full flex-col items-center"
              >
                {step === 1 && (
                  <StepGender
                    data={data}
                    setData={setData}
                    nextStep={nextStep}
                    getGendersList={() => gendersList}
                  />
                )}
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
                {step === 3 && <StepPhotos data={data} setData={setData} nextStep={nextStep} />}
                {step === 4 && (
                  <StepAboutMe
                    key={bioTemplates.length}
                    data={data}
                    hobbies={hobbiesList}
                    setData={setData}
                    bioTemplates={bioTemplates}
                    nextStep={nextStep}
                  />
                )}
                {step === 5 && (
                  <StepHobbies
                    data={data}
                    setData={setData}
                    hobbiesList={hobbiesList}
                    nextStep={nextStep}
                  />
                )}
                {step === 6 && (
                  <StepPreview
                    data={data}
                    setData={setData}
                    nextStep={nextStep}
                    countriesList={countriesList}
                  />
                )}
                {step === step_count && (
                  <>
                    <StepPassword data={data} setData={setData} nextStep={nextStep} />
                    <div className="w-full space-y-3 pt-6">
                      <Button
                        onClick={() => handleFinish(false)}
                        disabled={loading || !data.email || !data.password}
                        className="w-full"
                      >
                        {loading
                          ? getLabel("saving", language)
                          : getLabel("btn_complete_auth", language)}
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
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="pt-8 text-center">
            <p className="text-muted-foreground text-xs font-medium">
              {getLabel("step_count", language, { step, step_count })}
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
