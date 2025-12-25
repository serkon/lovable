"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  User,
  Sparkles,
  Heart,
  GraduationCap,
  BookOpen,
  Check,
  ChevronLeft,
  Camera
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MARITAL_STATUSES, EDUCATIONS, INTENTIONS } from "@/lib/mock-data";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { APP_CONFIG } from "@/lib/config";
import { updateUserProfile } from "@/lib/actions/userActions";
import { getBioTemplates, getHobbies } from "@/lib/actions/contentActions";

type OnboardingData = {
  name: string;
  age: string;
  city: string;
  job: string;
  gender: string;
  bio: string;
  intention: string;
  education: string;
  maritalStatus: string;
  hobbies: string[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const { language } = useAppStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    city: "",
    job: "",
    gender: "",
    bio: "",
    intention: "",
    education: "",
    maritalStatus: "",
    hobbies: [],
  });

  const [bioTemplates, setBioTemplates] = useState<string[]>([]);
  const [hobbiesList, setHobbiesList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dbBioTemplates = await getBioTemplates();
      const dbHobbies = await getHobbies();
      setBioTemplates(dbBioTemplates);
      setHobbiesList(dbHobbies);
    };
    fetchData();
  }, []);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleFinish = async () => {
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
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert(getLabel('error_generic', language));
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
        // Remove template and clean up extra spaces
        const newBio = prev.bio.replace(template, "").replace(/\s\s+/g, ' ').trim();
        return { ...prev, bio: newBio };
      } else {
        // Add template
        const newBio = prev.bio ? `${prev.bio} ${template}` : template;
        return { ...prev, bio: newBio };
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
      <Logo size={48} className="mb-6" />

      {/* Progress Stepper */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 px-2" data-testid="onboarding-stepper">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none" data-testid={`step-indicator-${s}`}>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step >= s ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-400"
              )}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 6 && (
              <div
                className={cn(
                  "h-1 flex-1 mx-2 rounded-full",
                  step > s ? "bg-purple-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        {step > 1 && step < 6 && (
          <button
            onClick={prevStep}
            className="flex items-center gap-1 text-gray-500 hover:text-purple-600 mb-4 transition-colors text-sm font-medium"
            data-testid="onboarding-prev-btn"
          >
            <ChevronLeft className="w-4 h-4" /> {getLabel('back', language)}
          </button>
        )}

        {/* STEP 1: GENDER */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <Typography variant="h2" className="text-purple-900">{getLabel('welcome', language)}</Typography>
              <Typography variant="body-large" className="text-gray-600">{getLabel('start_with_gender', language)}</Typography>
            </div>
            <div className="grid gap-4">
              {[getLabel('gender_female', language), getLabel('gender_male', language)].map((g) => (
                <Card
                  key={g}
                  onClick={() => { setData({ ...data, gender: g }); nextStep(); }}
                  className={cn(
                    "p-6 cursor-pointer flex items-center gap-6 transition-all border-2",
                    data.gender === g ? "border-purple-600 bg-purple-50" : "border-transparent hover:border-gray-200 hover:shadow-md"
                  )}
                  data-testid={`gender-option-${g.toLowerCase()}`}
                >
                  <div className={cn("p-4 rounded-full", g === getLabel('gender_male', language) ? "bg-blue-100" : "bg-pink-100")}>
                    <User className={cn("w-8 h-8", g === getLabel('gender_male', language) ? "text-blue-600" : "text-pink-600")} />
                  </div>
                  <Typography variant="h3" className="text-gray-700">{g}</Typography>
                  <ArrowRight className="ml-auto w-6 h-6 text-gray-300" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BASIC INFO */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <Typography variant="h2" className="text-purple-900">{getLabel('introduce_yourself', language)}</Typography>
              <Typography variant="body-large" className="text-gray-600">{getLabel('how_to_address', language)}</Typography>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">{getLabel('label_name', language)}</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                    placeholder={getLabel('placeholder_name', language)}
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{getLabel('label_age', language)}</label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-mono"
                    placeholder={getLabel('placeholder_age', language)}
                    min={APP_CONFIG.MIN_AGE}
                    max={APP_CONFIG.MAX_AGE}
                    data-testid="input-age"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{getLabel('label_city', language)}</label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                    placeholder={getLabel('placeholder_city', language)}
                    data-testid="input-city"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">{getLabel('label_job', language)}</label>
                  <input
                    type="text"
                    value={data.job}
                    onChange={(e) => setData({ ...data, job: e.target.value })}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                    placeholder={getLabel('placeholder_job', language)}
                    data-testid="input-job"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={nextStep}
              disabled={!data.name || !data.age || !data.city || !data.job}
              className="w-full h-14 rounded-2xl bg-purple-600 text-lg font-bold disabled:bg-gray-200"
              data-testid="step-2-next-btn"
            >
              {getLabel('btn_continue', language)}
            </Button>
          </div>
        )}

        {/* STEP 3: BIO / ABOUT ME */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <Typography variant="h2" className="text-purple-900">{getLabel('about_me', language)}</Typography>
              <Typography variant="caption" className="text-gray-500">
                {getLabel('ready_sentences', language)}
              </Typography>
            </div>

            <div className="space-y-4">
              <textarea
                value={data.bio}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
                className="w-full h-28 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-white shadow-inner resize-none text-sm"
                placeholder={getLabel('input_placeholder_bio', language)}
                data-testid="input-bio"
              />

              <div className="bg-slate-50 border border-gray-100 rounded-2xl p-3">
                <Typography variant="caption" className="text-gray-400 mb-3 block px-1">{getLabel('suggested_sentences', language)}</Typography>
                <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {bioTemplates.map((t, i) => {
                      const isSelected = data.bio.includes(t);
                      return (
                        <button
                          key={i}
                          onClick={() => toggleBioTemplate(t)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all text-left border flex items-center gap-1.5",
                            isSelected
                              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                              : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                          )}
                          data-testid={`bio-template-${i}`}
                        >
                          {isSelected ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-purple-400 opacity-60" />}
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-purple-600 text-lg font-bold" data-testid="step-3-next-btn">
              {getLabel('btn_continue', language)}
            </Button>
          </div>
        )}

        {/* STEP 4: DETAILS (Intention, Education, Marital) */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <Typography variant="h2" className="text-purple-900">{getLabel('more_details', language)}</Typography>
              <Typography variant="caption" className="text-gray-500">{getLabel('help_us_find', language)}</Typography>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-500" /> {getLabel('label_intention', language)}
                </label>
                <select
                  value={data.intention}
                  onChange={(e) => setData({ ...data, intention: e.target.value })}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white"
                  data-testid="select-intention"
                >
                  <option value="">{getLabel('select_default', language)}</option>
                  {INTENTIONS.map(i => <option key={i} value={i}>{getLabel(i, language)}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-500" /> {getLabel('education', language)}
                </label>
                <select
                  value={data.education}
                  onChange={(e) => setData({ ...data, education: e.target.value })}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white"
                  data-testid="select-education"
                >
                  <option value="">{getLabel('select_default', language)}</option>
                  {EDUCATIONS.map(e => <option key={e} value={e}>{getLabel(e, language)}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500" /> {getLabel('maritalStatus', language)}
                </label>
                <select
                  value={data.maritalStatus}
                  onChange={(e) => setData({ ...data, maritalStatus: e.target.value })}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white"
                  data-testid="select-marital-status"
                >
                  <option value="">{getLabel('select_default', language)}</option>
                  {MARITAL_STATUSES.map(s => <option key={s} value={s}>{getLabel(s, language)}</option>)}
                </select>
              </div>
            </div>

            <Button
              onClick={nextStep}
              disabled={!data.intention || !data.education || !data.maritalStatus}
              className="w-full h-14 rounded-2xl bg-purple-600 text-lg font-bold disabled:bg-gray-200"
              data-testid="step-4-next-btn"
            >
              {getLabel('btn_continue', language)}
            </Button>
          </div>
        )}

        {/* STEP 5: HOBBIES */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <Typography variant="h2" className="text-purple-900">{getLabel('hobbies', language)}</Typography>
              <Typography variant="caption" className="text-gray-500">{getLabel('min_hobbies_req', language, { min: APP_CONFIG.MIN_HOBBIES_COUNT })}</Typography>
            </div>

            <div className="flex flex-wrap gap-2 justify-center py-4">
              {hobbiesList.map(hobby => (
                <button
                  key={hobby}
                  onClick={() => toggleHobby(hobby)}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                    data.hobbies.includes(hobby)
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
                  )}
                  data-testid={`hobby-option-${hobby}`}
                >
                  {hobby}
                </button>
              ))}
            </div>

            <Button
              onClick={nextStep}
              disabled={data.hobbies.length < APP_CONFIG.MIN_HOBBIES_COUNT}
              className="w-full h-14 rounded-2xl bg-purple-600 text-lg font-bold disabled:bg-gray-200"
              data-testid="step-5-next-btn"
            >
              {getLabel('btn_looks_great', language)}
            </Button>
          </div>
        )}

        {/* STEP 6: FINAL PREVIEW / PHOTO */}
        {step === 6 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center">
            <div className="space-y-2">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-12 h-12 text-green-600" />
              </div>
              <Typography variant="h2" className="text-purple-900">{getLabel('profile_ready', language)}</Typography>
              <Typography variant="body-large" className="text-gray-600">{getLabel('best_candidates', language)}</Typography>
            </div>

            <Card className="p-6 text-left border-purple-100 bg-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Logo size={120} />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-purple-200 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <Typography variant="h3" className="text-gray-900">{data.name || getLabel('guest', language)}, {data.age || '40'}</Typography>
                    <div className="flex items-center gap-2">
                      <Typography variant="caption" className="text-purple-600 font-bold">{getLabel(data.intention, language)}</Typography>
                      <span className="text-gray-300">•</span>
                      <Typography variant="caption" className="text-gray-500">{data.city}</Typography>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-3 h-3 text-purple-400" />
                    {data.job}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-3 h-3 text-purple-400" />
                    {getLabel(data.education, language)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl italic text-sm text-gray-600 line-clamp-3">
                  &quot;{data.bio || getLabel('no_bio_yet', language)}&quot;
                </div>
                <div className="flex flex-wrap gap-1.5 opacity-70">
                  {data.hobbies.slice(0, 3).map(h => (
                    <span key={h} className="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full">{h}</span>
                  ))}
                  {data.hobbies.length > 3 && <span className="text-[10px] text-gray-400">+{data.hobbies.length - 3}</span>}
                </div>
              </div>
            </Card>

            <Button onClick={handleFinish} className="w-full h-16 rounded-2xl bg-purple-600 hover:bg-purple-700 text-xl font-bold shadow-xl shadow-purple-200 animate-bounce transition-all" data-testid="complete-onboarding-btn">
              {getLabel('start_meeting', language)}
            </Button>
          </div>
        )}

        <div className="text-center pt-8">
          <Typography variant="caption" className="text-gray-400">
            {getLabel('step_count', language, { step: step })}
          </Typography>
        </div>
      </div>
    </div>
  );
}
