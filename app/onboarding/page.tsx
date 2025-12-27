"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  User,
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

const COUNTRIES = ["Türkiye", "Germany", "United Kingdom", "United States", "Netherlands", "France", "Other"];

type OnboardingData = {
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
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{getLabel('welcome', language)}</h2>
              <p className="text-muted-foreground">{getLabel('start_with_gender', language)}</p>
            </div>
            <div className="grid gap-4">
              {['gender_female', 'gender_male'].map((gid) => (
                <Card
                  key={gid}
                  onClick={() => { setData({ ...data, gender: gid }); nextStep(); }}
                  className={cn(
                    "p-4 cursor-pointer flex items-center gap-4",
                    data.gender === gid ? "border-primary bg-muted" : "hover:bg-accent"
                  )}
                >
                  <User className="w-6 h-6" />
                  <h3 className="font-semibold">{getLabel(gid, language)}</h3>
                  <ArrowRight className="ml-auto w-4 h-4 text-muted-foreground" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BASIC INFO */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{getLabel('introduce_yourself', language)}</h2>
              <p className="text-muted-foreground">{getLabel('how_to_address', language)}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">{getLabel('label_name', language)}</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder={getLabel('placeholder_name', language)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">{getLabel('label_age', language)}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    placeholder={getLabel('placeholder_age', language)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{getLabel('label_country', language)}</Label>
                  <Select
                    value={data.country}
                    onValueChange={(val) => setData({ ...data, country: val })}
                  >
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="city">{getLabel('label_city', language)}</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                    placeholder={getLabel('placeholder_city', language)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="job">{getLabel('label_job', language)}</Label>
                  <Select
                    value={data.job}
                    onValueChange={(val) => setData({ ...data, job: val })}
                  >
                    <SelectTrigger id="job">
                      <SelectValue placeholder={getLabel('select_default', language)} />
                    </SelectTrigger>
                    <SelectContent>
                      {jobsList.map(j => <SelectItem key={j} value={j}>{getLabel(j, language)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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
        )}

        {/* STEP 3: BIO / ABOUT ME */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{getLabel('about_me', language)}</h2>
              <p className="text-muted-foreground">
                {getLabel('ready_sentences', language)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">{getLabel('bio', language)}</Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                  placeholder={getLabel('input_placeholder_bio', language)}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-muted-foreground">{getLabel('suggested_sentences', language)}</span>
                <div className="flex flex-wrap gap-2">
                  {bioTemplates.map((t, i) => {
                    const isSelected = data.bio.includes(t);
                    return (
                      <Button
                        key={i}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleBioTemplate(t)}
                        className="text-xs"
                      >
                        {isSelected && <Check className="mr-1 w-3 h-3" />}
                        {t}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button onClick={nextStep} className="w-full">
              {getLabel('btn_continue', language)}
            </Button>
          </div>
        )}

        {/* STEP 4: DETAILS */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{getLabel('more_details', language)}</h2>
              <p className="text-muted-foreground">{getLabel('help_us_find', language)}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="intention" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> {getLabel('label_intention', language)}
                </Label>
                <Select
                  value={data.intention}
                  onValueChange={(val) => setData({ ...data, intention: val })}
                >
                  <SelectTrigger id="intention">
                    <SelectValue placeholder={getLabel('select_default', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {intentionsList.map(i => <SelectItem key={i} value={i}>{getLabel(i, language)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> {getLabel('education', language)}
                </Label>
                <Select
                  value={data.education}
                  onValueChange={(val) => setData({ ...data, education: val })}
                >
                  <SelectTrigger id="education">
                    <SelectValue placeholder={getLabel('select_default', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {educationsList.map(e => <SelectItem key={e} value={e}>{getLabel(e, language)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marital" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> {getLabel('maritalStatus', language)}
                </Label>
                <Select
                  value={data.maritalStatus}
                  onValueChange={(val) => setData({ ...data, maritalStatus: val })}
                >
                  <SelectTrigger id="marital">
                    <SelectValue placeholder={getLabel('select_default', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatusesList.map(s => <SelectItem key={s} value={s}>{getLabel(s, language)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={nextStep}
              disabled={!data.intention || !data.education || !data.maritalStatus}
              className="w-full"
            >
              {getLabel('btn_continue', language)}
            </Button>
          </div>
        )}

        {/* STEP 5: HOBBIES */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{getLabel('hobbies', language)}</h2>
              <p className="text-sm text-muted-foreground">{getLabel('min_hobbies_req', language, { min: APP_CONFIG.MIN_HOBBIES_COUNT })}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center py-4">
              {hobbiesList.map(hobby => (
                <Badge
                  key={hobby}
                  variant={data.hobbies.includes(hobby) ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => toggleHobby(hobby)}
                >
                  {getLabel(hobby, language)}
                </Badge>
              ))}
            </div>

            <Button
              onClick={nextStep}
              disabled={data.hobbies.length < APP_CONFIG.MIN_HOBBIES_COUNT}
              className="w-full"
            >
              {getLabel('btn_looks_great', language)}
            </Button>
          </div>
        )}

        {/* STEP 6: PREVIEW */}
        {step === 6 && (
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">{getLabel('profile_ready', language)}</h2>
              <p className="text-muted-foreground">{getLabel('best_candidates', language)}</p>
            </div>

            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted flex items-center justify-center">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">{data.name || getLabel('guest', language)}, {data.age || '40'}</h3>
                  <p className="text-xs text-muted-foreground">{data.city}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                &quot;{data.bio || getLabel('no_bio_yet', language)}&quot;
              </p>
            </Card>

            <Button onClick={nextStep} className="w-full">
              {getLabel('btn_continue', language)}
            </Button>
          </div>
        )}

        {/* STEP 7: SECURE ACCOUNT */}
        {step === 7 && (
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
                <Label htmlFor="email">{getLabel('label_email', language)}</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder={getLabel('placeholder_email', language)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{getLabel('label_password', language)}</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  placeholder={getLabel('placeholder_password', language)}
                />
              </div>
            </div>

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
