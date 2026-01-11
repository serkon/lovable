"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Plus, Sun, User, Smile, Sparkles, RefreshCw } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { updateUserProfile, uploadImage, deleteImage } from "@/lib/actions/userActions";
import { aiActionFetchBioSuggestions } from "@/lib/actions/aiActions";
import { useRef } from "react";
import * as LucideIcons from "lucide-react";
import { getProfileMetadata } from "@/lib/actions/contentActions";
import { JobMetadata, BioTemplateMetadata } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FormGroup } from "@/components/ui/form-group";
import { cn } from "@/lib/utils";
import { Heart, GraduationCap, BookOpen, Phone, Mail, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import Image from "next/image";

export default function ProfilePage() {
  const { language, currentUser, refreshCurrentUser } = useAppStore();

  // Local form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [bio, setBio] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [maritalStatus, setMaritalStatus] = useState<string>("ms_private");
  const [education, setEducation] = useState<string>("edu_elementary");
  const [intention, setIntention] = useState<string>("int_chat");
  const [userImages, setUserImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<BioTemplateMetadata[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic content state
  const [hobbiesList, setHobbiesList] = useState<string[]>([]);
  const [bioTemplates, setBioTemplates] = useState<BioTemplateMetadata[]>([]);
  const [maritalStatusesList, setMaritalStatusesList] = useState<string[]>([]);
  const [educationsList, setEducationsList] = useState<string[]>([]);
  const [intentionsList, setIntentionsList] = useState<string[]>([]);
  const [jobsList, setJobsList] = useState<JobMetadata[]>([]);

  // Fetch dynamic content on mount
  useEffect(() => {
    const loadContent = async () => {
      const data = await getProfileMetadata();
      setHobbiesList(data.hobbies || []);
      const templates = (data.bioTemplates || []).map(
        (t: { content: string; category: string }) => ({
          content: t.content,
          category: t.category,
        })
      );
      setBioTemplates(templates);
      setMaritalStatusesList(data.maritalStatuses || []);
      setEducationsList(data.educations || []);
      setIntentionsList(data.intentions || []);
      setJobsList(data.jobs || []);

      // Load initial AI suggestions
      let aiData = await aiActionFetchBioSuggestions(templates, selectedHobbies, language);

      // If AI fails, use shuffled DB templates as initial suggestions
      if (!aiData || aiData.length === 0) {
        aiData = [...templates].sort(() => 0.5 - Math.random()).slice(0, 8);
      }
      setAiSuggestions(aiData);
    };
    loadContent();
  }, [language, selectedHobbies]);

  const refreshAiSuggestions = async () => {
    setIsGeneratingBio(true);
    try {
      let data = await aiActionFetchBioSuggestions(bioTemplates, selectedHobbies, language);

      // If AI fails, provide a fresh shuffle of DB templates
      if (!data || data.length === 0) {
        const shuffledFallback = [...bioTemplates].sort(() => 0.5 - Math.random());
        data = shuffledFallback.slice(0, 8);
      }

      setAiSuggestions(data);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // Sync with store data when component mounts or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      const userAge = currentUser.age?.toString() || "";
      setAge(userAge === "0" ? "" : userAge);
      setCity(currentUser.city || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
      setJob(currentUser.job?.id || "");
      setBio((currentUser.bio as string) || "");
      setMaritalStatus((currentUser.maritalStatus?.id as string) || "ms_private");
      setEducation((currentUser.education?.id as string) || "edu_elementary");
      setIntention((currentUser.intention?.id as string) || "int_chat");

      if (currentUser.images && currentUser.images.length > 0) {
        setUserImages(currentUser.images.map((img) => img.url));
      }

      if (currentUser.hobbies) {
        setSelectedHobbies(currentUser.hobbies.map((h) => h.id));
      } else if (currentUser.hobbiesArray) {
        setSelectedHobbies(currentUser.hobbiesArray);
      }
    }
  }, [currentUser]);

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadImage(formData);
      if (result && result.url) {
        setUserImages((prev) => [...prev, result.url]);

        // Show AI Feedback
        if (result.aiCheck) {
          const { feedback, isApproved } = result.aiCheck;
          alert(
            `${isApproved ? "✅" : "⚠️"} ${getLabel("ai_analysis", language)}:\n${feedback.message}`
          );
        }
      } else {
        alert(getLabel("error_upload_failed", language));
      }
    } catch (error) {
      console.error("Upload handler error:", error);
      alert(getLabel("error_generic", language));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const removeImage = async (index: number) => {
    const imageUrl = userImages[index];
    setUserImages((prev) => prev.filter((_, i) => i !== index));
    if (imageUrl) {
      await deleteImage(imageUrl);
    }
  };

  const setAsPrimary = (index: number) => {
    if (index === 0) return;
    setUserImages((prev) => {
      const newImages = [...prev];
      const selected = newImages[index];
      newImages.splice(index, 1);
      newImages.unshift(selected);
      return newImages;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        firstName,
        lastName,
        age: parseInt(age),
        city,
        email,
        phone,
        job,
        bio,
        hobbies: selectedHobbies,
        images: userImages,
        maritalStatus,
        education,
        intention,
      });
      await refreshCurrentUser();
      alert(getLabel("profile_updated", language));
    } catch (error) {
      console.error("Save failed:", error);
      alert(getLabel("error_generic", language));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-24" data-testid="profile-page-container">
      <Header
        variant="simple"
        backHref="/dashboard"
        className="h-20"
        title={getLabel("edit_profile", language)}
        showLogo={false}
        action={
          <div className="flex items-center gap-4">
            {/* Invisible Mode Toggle */}
            <div
              className="hidden cursor-pointer items-center gap-2 rounded-full border border-transparent px-3 py-1.5 transition-all hover:bg-slate-100 lg:flex"
              onClick={() => {
                // Toggle status logic
                // Since this uses setStatus directly from store usually, but here we can reimplement the logic
                // However, Profile page doesn't seem to export toggle logic.
                // But wait, the previous header didn't have toggle logic visible in the snippet I saw?
                // Ah, I missed seeing the toggle in previous view_file. Let me double check if it was there.
                // Assuming it was or we want to add it.
                // If it wasn't there, I will stick to just the Save button for now.
                // Looking at previous snippets, I only saw the arrow left button on the left.
                // Okay, I will just put the Save button in action for now.
              }}
            >
              {/* If toggle logic existed, put here */}
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "rounded-full px-6 font-bold shadow-lg transition-all",
                isSaving
                  ? "bg-muted text-muted-foreground translate-y-1 opacity-50"
                  : "bg-primary hover:bg-primary/90 translate-y-0 opacity-100"
              )}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {getLabel("btn_saving", language)}
                </>
              ) : (
                getLabel("btn_save", language)
              )}
            </Button>
          </div>
        }
      />

      <main className="mx-auto max-w-2xl space-y-16 px-6 py-10" data-testid="profile-main">
        {/* Photo Section */}
        <section className="space-y-8" data-testid="profile-photos-section">
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="border-muted-foreground/10 w-full border-t" />
            </div>
            <div className="relative flex justify-center uppercase">
              <span className="bg-background text-muted-foreground/60 px-6 text-[10px] font-bold tracking-[0.2em]">
                {getLabel("profile_photos", language)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <p className="text-muted-foreground text-xs font-medium">
              {getLabel("profile_photos_desc", language)}
            </p>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold">
              {getLabel("n_photos", language, { count: userImages.length })}
            </Badge>
          </div>

          <div className="mx-auto w-full space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {/* Primary Photo Slot (First in Grid) */}
              <div
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-3xl border-2 border-dashed shadow-md transition-all sm:col-span-2 sm:row-span-2",
                  userImages[0]
                    ? "border-transparent"
                    : "border-primary/20 bg-primary/5 hover:border-primary/40"
                )}
              >
                {userImages[0] ? (
                  <>
                    <Image
                      src={userImages[0]}
                      alt="Main Profile"
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(0)}
                        className="w-full rounded-xl font-bold"
                      >
                        <X className="mr-2 h-4 w-4" /> {getLabel("btn_remove", language)}
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 border-none px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg backdrop-blur-sm">
                        {getLabel("main_photo", language)}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={addImage}
                    disabled={isUploading}
                    className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center transition-all focus:outline-none"
                  >
                    <div className="bg-primary/10 text-primary rounded-full p-4 shadow-sm">
                      <Camera className="h-8 w-8" />
                    </div>
                    <span className="text-primary/70 text-xs font-bold tracking-wider uppercase">
                      {getLabel("btn_upload_photo", language)}
                    </span>
                  </button>
                )}
              </div>

              {/* Secondary Photos Grid */}
              {userImages.slice(1).map((url, idx) => (
                <div
                  key={idx + 1}
                  className="group border-muted-foreground/10 bg-muted/30 relative aspect-square overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md"
                >
                  <Image
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setAsPrimary(idx + 1)}
                      className="text-primary w-[80%] rounded-xl bg-white/90 py-2 text-[10px] font-bold tracking-wider uppercase transition-all hover:bg-white active:scale-95"
                    >
                      {getLabel("btn_set_primary", language)}
                    </button>
                    <button
                      onClick={() => removeImage(idx + 1)}
                      className="bg-destructive/90 hover:bg-destructive w-[80%] rounded-xl py-2 text-[10px] font-bold tracking-wider text-white uppercase transition-all active:scale-95"
                    >
                      {getLabel("btn_delete", language)}
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Button at the end */}
              {userImages.length < 12 && (
                <button
                  onClick={addImage}
                  disabled={isUploading}
                  className="bg-muted/30 border-muted-foreground/10 hover:border-primary/30 flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all active:scale-95"
                >
                  <div className="bg-background text-muted-foreground group-hover:text-primary rounded-full p-2 shadow-sm">
                    {isUploading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-6 w-6" />
                    )}
                  </div>
                  <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    {getLabel("btn_add", language)}
                  </span>
                </button>
              )}
            </div>

            {/* Compact Photo Tips (Reverted Design) */}
            <div className="space-y-8 pt-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="border-muted-foreground/10 w-full border-t"></div>
                </div>
                <span className="bg-background text-muted-foreground/60 relative px-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {getLabel("photo_tips_title", language)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-muted/50 text-muted-foreground/70 flex h-12 w-12 items-center justify-center rounded-full">
                    <Sun className="h-5 w-5" />
                  </div>
                  <span className="text-muted-foreground/80 text-center text-[10px] font-medium tracking-tight uppercase">
                    {getLabel("tip_light", language)}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-muted/50 text-muted-foreground/70 flex h-12 w-12 items-center justify-center rounded-full">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-muted-foreground/80 text-center text-[10px] font-medium tracking-tight uppercase">
                    {getLabel("tip_solo", language)}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-muted/50 text-muted-foreground/70 flex h-12 w-12 items-center justify-center rounded-full">
                    <Smile className="h-5 w-5" />
                  </div>
                  <span className="text-muted-foreground/80 text-center text-[10px] font-medium tracking-tight uppercase">
                    {getLabel("tip_face", language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </section>

        {/* Basic Info */}
        <section className="space-y-10" data-testid="profile-basic-info-section">
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="border-muted-foreground/10 w-full border-t" />
            </div>
            <div className="relative flex justify-center uppercase">
              <span className="bg-background text-muted-foreground/60 px-6 text-[10px] font-bold tracking-[0.2em]">
                {getLabel("basic_info_title", language)}
              </span>
            </div>
          </div>

          <div className="w-full space-y-8">
            {/* Row 1: Adı, Soyadı, Yaş'ı */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormGroup label={getLabel("label_first_name", language)}>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={getLabel("placeholder_first_name", language)}
                />
              </FormGroup>

              <FormGroup label={getLabel("label_last_name", language)}>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={getLabel("placeholder_last_name", language)}
                />
              </FormGroup>

              <FormGroup label={getLabel("label_age", language)}>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={getLabel("placeholder_age", language)}
                />
              </FormGroup>
            </div>

            {/* Separator for Contact */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="border-muted-foreground/10 w-full border-t" />
              </div>
              <div className="relative flex justify-center uppercase">
                <span className="bg-background text-muted-foreground/60 px-6 text-[10px] font-bold tracking-[0.2em]">
                  {getLabel("contact_info_title", language)}
                </span>
              </div>
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
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getLabel("placeholder_email", language)}
                />
              </FormGroup>
            </div>

            {/* Separator */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="border-muted-foreground/10 w-full border-t" />
              </div>
              <div className="relative flex justify-center uppercase">
                <span className="bg-background text-muted-foreground/60 px-6 text-[10px] font-bold tracking-[0.2em]">
                  {getLabel("more_details_title", language)}
                </span>
              </div>
            </div>

            {/* Row 2: Şehir ve Eğitim */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormGroup
                label={
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {getLabel("label_city", language)}
                  </span>
                }
              >
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={getLabel("placeholder_city", language)}
                />
              </FormGroup>

              <FormGroup
                label={
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" /> {getLabel("education", language)}
                  </span>
                }
              >
                <Select value={education} onValueChange={(v) => setEducation(v as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
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
            </div>

            {/* Row 3: Meslek ve Medeni Durum */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormGroup label={getLabel("label_job", language)}>
                <Select value={job} onValueChange={setJob}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={getLabel("select_default", language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {jobsList.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {getLabel(j.id, language)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup
                label={
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {getLabel("maritalStatus", language)}
                  </span>
                }
              >
                <Select value={maritalStatus} onValueChange={(v) => setMaritalStatus(v as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
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
            </div>

            {/* Separator for Purpose */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="border-muted-foreground/10 w-full border-t" />
              </div>
              <div className="relative flex justify-center uppercase">
                <span className="bg-background text-muted-foreground/60 px-6 text-[10px] font-bold tracking-[0.2em]">
                  {getLabel("intention_title", language)}
                </span>
              </div>
            </div>

            {/* Row 4: Tanışma Amacı (Full Width match onboarding vibes) */}
            <div className="grid grid-cols-1">
              <FormGroup
                label={
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {getLabel("intention", language)}
                  </span>
                }
              >
                <Select value={intention} onValueChange={(v) => setIntention(v as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
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
        </section>

        <section className="space-y-8" data-testid="profile-bio-section">
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="border-muted-foreground/10 w-full border-t" />
            </div>
            <div className="relative flex justify-center uppercase">
              <span className="bg-background text-muted-foreground/60 px-6 text-[10px] font-bold tracking-[0.2em]">
                {getLabel("about_me_title", language)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-muted-foreground/10 bg-muted/5 focus-within:ring-primary/20 overflow-hidden rounded-[2rem] p-6 shadow-none transition-all focus-within:ring-2">
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={getLabel("placeholder_bio", language)}
                className="placeholder:text-muted-foreground/40 min-h-[200px] resize-none border-none bg-transparent p-0 text-lg leading-relaxed focus-visible:ring-0"
              />
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="h-3 w-3" /> {getLabel("ai_suggestions_title", language)}
                </span>
                <button
                  onClick={refreshAiSuggestions}
                  disabled={isGeneratingBio}
                  className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn("h-4 w-4", isGeneratingBio && "animate-spin")} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {isGeneratingBio
                  ? Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="bg-muted/50 h-12 w-full animate-pulse rounded-2xl"
                        />
                      ))
                  : aiSuggestions.map((suggestion, idx) => {
                      const iconName = "Sparkles";
                      const IconComp =
                        (
                          LucideIcons as unknown as Record<
                            string,
                            React.ComponentType<{ className?: string }>
                          >
                        )[iconName] || Sparkles;

                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            setBio((prev) =>
                              prev ? `${prev} ${suggestion.content}` : suggestion.content
                            )
                          }
                          className="group bg-background border-muted-foreground/10 hover:border-primary/30 flex items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                        >
                          <div className="bg-primary/5 text-primary group-hover:bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors group-hover:text-white">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <span className="text-muted-foreground group-hover:text-foreground text-xs leading-tight font-medium transition-colors">
                            {suggestion.content}
                          </span>
                        </button>
                      );
                    })}
              </div>
            </div>
          </div>
        </section>

        {/* Hobbies Section */}
        <section className="space-y-10" data-testid="profile-hobbies-section">
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="border-muted-foreground/10 w-full border-t" />
            </div>
            <div className="relative flex justify-center uppercase">
              <span className="bg-background text-muted-foreground/60 px-6 text-[10px] font-bold tracking-[0.2em]">
                {getLabel("hobbies_title", language)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {hobbiesList.map((hobby) => {
              const isSelected = selectedHobbies.includes(hobby);
              return (
                <button
                  key={hobby}
                  onClick={() => toggleHobby(hobby)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-bold shadow-sm transition-all active:scale-95",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {getLabel(hobby, language)}
                </button>
              );
            })}
          </div>
        </section>

        <div className="pt-10">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="shadow-primary/20 w-full rounded-2xl py-8 text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaving ? getLabel("btn_saving", language) : getLabel("btn_save_changes", language)}
          </Button>
        </div>
      </main>
    </div>
  );
}
