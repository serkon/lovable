import { getLabel } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingData } from "@/app/onboarding/page";
import { useAppStore } from "@/context/AppStore";
import { FormGroup } from "@/components/ui/form-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, GraduationCap, BookOpen, Phone, Mail } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface StepBasicInfoProps {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  nextStep: () => void;
  jobsList: string[];
  intentionsList: string[];
  educationsList: string[];
  maritalStatusesList: string[];
}

export function StepBasicInfo({
  data,
  setData,
  nextStep,
  jobsList,
  intentionsList,
  educationsList,
  maritalStatusesList,
}: StepBasicInfoProps) {
  const { language } = useAppStore();

  const isFormValid =
    data.firstName &&
    data.lastName &&
    data.age &&
    data.email &&
    data.phone &&
    data.job &&
    data.intention &&
    data.education &&
    data.maritalStatus;

  return (
    <>
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          {getLabel("introduce_yourself", language)}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-lg leading-relaxed">
          {getLabel("how_to_address", language)}
        </p>
      </div>

      <div className="mb-10 w-full space-y-8">
        {/* Row 1: Adı, Soyadı, Yaş'ı */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormGroup label={getLabel("label_first_name", language)}>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              placeholder={getLabel("placeholder_first_name", language)}
            />
          </FormGroup>

          <FormGroup label={getLabel("label_last_name", language)}>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              placeholder={getLabel("placeholder_last_name", language)}
            />
          </FormGroup>

          <FormGroup label={getLabel("label_age", language)}>
            <Input
              id="age"
              type="number"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              placeholder={getLabel("placeholder_age", language)}
            />
          </FormGroup>
        </div>

        {/* Row 1.5: Telefon ve Email */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormGroup
            label={
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {getLabel("label_phone", language)}
              </span>
            }
          >
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder={getLabel("placeholder_phone", language)}
            />
          </FormGroup>

          <FormGroup
            label={
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {getLabel("label_email", language)}
              </span>
            }
          >
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder={getLabel("placeholder_email", language)}
            />
          </FormGroup>
        </div>

        {/* Separator */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="border-muted-foreground/20 w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2 font-bold tracking-widest">
              {getLabel("more_details", language)}
            </span>
          </div>
        </div>

        {/* Row 2: Eğitim, Mesleği */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormGroup
            label={
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> {getLabel("education", language)}
              </span>
            }
          >
            <Select
              value={data.education}
              onValueChange={(val) => setData({ ...data, education: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getLabel("select_default", language)} />
              </SelectTrigger>
              <SelectContent>
                {educationsList.map((e) => (
                  <SelectItem key={e} value={e}>
                    {getLabel(e, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>

          <FormGroup label={getLabel("label_job", language)}>
            <Select value={data.job} onValueChange={(val) => setData({ ...data, job: val })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getLabel("select_default", language)} />
              </SelectTrigger>
              <SelectContent>
                {jobsList.map((j) => (
                  <SelectItem key={j} value={j}>
                    {getLabel(j, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
        </div>

        {/* Row 3: Medeni durumu ve tanışma amacı */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormGroup
            label={
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> {getLabel("maritalStatus", language)}
              </span>
            }
          >
            <Select
              value={data.maritalStatus}
              onValueChange={(val) => setData({ ...data, maritalStatus: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getLabel("select_default", language)} />
              </SelectTrigger>
              <SelectContent>
                {maritalStatusesList.map((s) => (
                  <SelectItem key={s} value={s}>
                    {getLabel(s, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>

          <FormGroup
            label={
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {getLabel("intention", language)}
              </span>
            }
          >
            <Select
              value={data.intention}
              onValueChange={(val) => setData({ ...data, intention: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getLabel("select_default", language)} />
              </SelectTrigger>
              <SelectContent>
                {intentionsList.map((i) => (
                  <SelectItem key={i} value={i}>
                    {getLabel(i, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
        </div>
      </div>

      <div className="flex w-full justify-center">
        <Button
          onClick={nextStep}
          disabled={!isFormValid}
          size="lg"
          className="w-full max-w-[400px] shadow-lg transition-all"
        >
          {getLabel("btn_continue", language)}
        </Button>
      </div>
    </>
  );
}
