"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Camera, Save, Settings, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MaritalStatusId, EducationId, IntentionId } from "@/lib/constants";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { APP_CONFIG } from "@/lib/config";
import { updateUserProfile } from "@/lib/actions/userActions";
import { getHobbies, getBioTemplates, getMaritalStatuses, getEducations, getIntentions, getJobs } from "@/lib/actions/contentActions";

import Image from "next/image";

export default function ProfilePage() {
    const { language, currentUser, refreshCurrentUser } = useAppStore();

    // Local form state
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [city, setCity] = useState("");
    const [job, setJob] = useState("");
    const [bio, setBio] = useState("");
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [maritalStatus, setMaritalStatus] = useState<MaritalStatusId>("ms_private");
    const [education, setEducation] = useState<EducationId>("edu_elementary");
    const [intention, setIntention] = useState<IntentionId>("int_chat");
    const [userImages, setUserImages] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Dynamic content state
    const [hobbiesList, setHobbiesList] = useState<string[]>([]);
    const [bioTemplates, setBioTemplates] = useState<string[]>([]);
    const [maritalStatusesList, setMaritalStatusesList] = useState<string[]>([]);
    const [educationsList, setEducationsList] = useState<string[]>([]);
    const [intentionsList, setIntentionsList] = useState<string[]>([]);
    const [jobsList, setJobsList] = useState<string[]>([]);

    // Fetch dynamic content on mount
    useEffect(() => {
        const loadContent = async () => {
            const [dbHobbies, dbTemplates, dbMarital, dbEdu, dbIntention, dbJobs] = await Promise.all([
                getHobbies(),
                getBioTemplates(),
                getMaritalStatuses(),
                getEducations(),
                getIntentions(),
                getJobs()
            ]);
            setHobbiesList(dbHobbies);
            setBioTemplates(dbTemplates);
            setMaritalStatusesList(dbMarital);
            setEducationsList(dbEdu);
            setIntentionsList(dbIntention);
            setJobsList(dbJobs);
        };
        loadContent();
    }, []);

    // Sync with store data when component mounts or currentUser changes
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setAge(currentUser.age?.toString() || "");
            setCity(currentUser.city || "");
            setJob(currentUser.job?.id || "");
            setBio(currentUser.bio || "");
            setMaritalStatus(currentUser.maritalStatus?.id || (currentUser.maritalStatus as unknown as string) || "ms_private");
            setEducation(currentUser.education?.id || (currentUser.education as unknown as string) || "edu_elementary");
            setIntention(currentUser.intention?.id || (currentUser.intention as unknown as string) || "int_chat");

            if (currentUser.images && currentUser.images.length > 0) {
                setUserImages(currentUser.images.map(img => img.url));
            } else if (currentUser.imageUrl) {
                setUserImages([currentUser.imageUrl]);
            }

            if (currentUser.hobbies) {
                setSelectedHobbies(currentUser.hobbies.map(h => h.id));
            } else if (currentUser.hobbiesArray) {
                setSelectedHobbies(currentUser.hobbiesArray);
            }
        }
    }, [currentUser]);

    const toggleHobby = (hobby: string) => {
        setSelectedHobbies(prev =>
            prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
        );
    };

    const addImage = () => {
        const url = prompt(getLabel('prompt_image_url', language) || "Lütfen bir resim URL'si girin:");
        if (url && url.startsWith('http')) {
            setUserImages(prev => [...prev, url].slice(0, 6));
        }
    };

    const removeImage = (index: number) => {
        setUserImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const parsedAge = parseInt(age);
            await updateUserProfile({
                name,
                age: isNaN(parsedAge) ? undefined : parsedAge,
                city,
                job,
                bio,
                maritalStatus,
                education,
                intention,
                hobbies: selectedHobbies,
                images: userImages,
            });
            await refreshCurrentUser();
            alert(getLabel('profile_updated', language));
        } catch (error) {
            console.error("Save failed:", error);
            alert(getLabel('error_generic', language));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
            {/* Header */}
            <header className="h-20 px-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </Button>
                    </Link>
                    <Typography variant="h3" className="text-gray-900 font-bold">{getLabel('edit_profile', language)}</Typography>
                </div>
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Settings className="w-6 h-6 text-gray-600" />
                    </Button>
                </Link>
            </header>

            <main className="max-w-2xl mx-auto w-full p-6 space-y-8">
                {/* Profile Photo Section - Enhanced for multiple images */}
                <section className="space-y-4">
                    <Typography variant="h3" className="text-base font-semibold text-gray-700">{getLabel('profile_photos', language)}</Typography>
                    <div className="grid grid-cols-3 gap-3">
                        {userImages.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 group">
                                <Image
                                    src={url}
                                    alt={`Profile ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    data-testid={`profile-image-remove-${index}`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {userImages.length < 6 && (
                            <button
                                onClick={addImage}
                                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-purple-600 hover:border-purple-200 transition-all bg-white"
                                data-testid="profile-image-add"
                            >
                                <Camera className="w-6 h-6" />
                                <span className="text-[10px] font-bold uppercase">{getLabel('add_photo', language)}</span>
                            </button>
                        )}
                    </div>
                </section>

                {/* Personal Info Section */}
                <section className="space-y-4">
                    <Typography variant="h3" className="text-base font-semibold text-gray-700">{getLabel('personal_info', language)}</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{getLabel('label_name', language)}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-slate-50/50"
                                data-testid="profile-edit-name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{getLabel('label_age', language)}</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min={APP_CONFIG.MIN_AGE}
                                max={APP_CONFIG.MAX_AGE}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-slate-50/50"
                                data-testid="profile-edit-age"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{getLabel('label_city', language)}</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-slate-50/50"
                                data-testid="profile-edit-city"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{getLabel('label_job', language)}</label>
                            <select
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-slate-50/50"
                                data-testid="profile-edit-job"
                            >
                                <option value="">{getLabel('select_default', language)}</option>
                                {jobsList.map(j => <option key={j} value={j}>{getLabel(j, language)}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Bio Section */}
                <section className="space-y-3">
                    <div className="flex justify-between items-end">
                        <Typography variant="h3" className="text-base font-semibold text-gray-700">{getLabel('bio', language)}</Typography>
                        <Typography variant="caption" className="text-purple-600 font-medium">{bio.length} / 500</Typography>
                    </div>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full h-32 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-white shadow-sm transition-all"
                        placeholder={getLabel('placeholder_bio', language)}
                        maxLength={500}
                        data-testid="profile-edit-bio"
                    />

                    {bioTemplates.length > 0 && (
                        <div className="space-y-2">
                            <Typography variant="caption" className="text-gray-500 font-medium block">
                                {getLabel('suggested_sentences', language)}
                            </Typography>
                            <div className="flex flex-wrap gap-2">
                                {bioTemplates.map((template, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            const newBio = bio ? `${bio}\n${template}` : template;
                                            if (newBio.length <= 500) setBio(newBio);
                                        }}
                                        className="text-[11px] px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-100 transition-colors text-left sm:text-center"
                                        data-testid={`bio-template-${idx}`}
                                    >
                                        + {template}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Status & Intention Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Typography variant="h3" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{getLabel('intention', language)}</Typography>
                        <select
                            value={intention}
                            onChange={(e) => setIntention(e.target.value as IntentionId)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                            data-testid="profile-edit-intention"
                        >
                            <option value="">{getLabel('select_default', language)}</option>
                            {intentionsList.map(i => <option key={i} value={i}>{getLabel(i, language)}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Typography variant="h3" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{getLabel('education', language)}</Typography>
                        <select
                            value={education}
                            onChange={(e) => setEducation(e.target.value as EducationId)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                            data-testid="profile-edit-education"
                        >
                            <option value="">{getLabel('select_default', language)}</option>
                            {educationsList.map(e => <option key={e} value={e}>{getLabel(e, language)}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Typography variant="h3" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{getLabel('maritalStatus', language)}</Typography>
                        <select
                            value={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.value as MaritalStatusId)}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                            data-testid="profile-edit-marital-status"
                        >
                            <option value="">{getLabel('select_default', language)}</option>
                            {maritalStatusesList.map(s => <option key={s} value={s}>{getLabel(s, language)}</option>)}
                        </select>
                    </div>
                </section>

                {/* Hobbies Section */}
                <section className="space-y-3">
                    <Typography variant="h3" className="text-base font-semibold text-gray-700">{getLabel('hobbies', language)}</Typography>
                    <div className="flex flex-wrap gap-2">
                        {hobbiesList.map(hobby => (
                            <button
                                key={hobby}
                                onClick={() => toggleHobby(hobby)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                    selectedHobbies.includes(hobby)
                                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                                )}
                                data-testid={`profile-edit-hobby-${hobby}`}
                            >
                                {getLabel(hobby, language)}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Save Button */}
                <div className="pt-6">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || selectedHobbies.length < APP_CONFIG.MIN_HOBBIES_COUNT}
                        className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-lg font-bold shadow-xl shadow-purple-100 flex items-center justify-center gap-2 disabled:bg-gray-300 transition-all"
                        data-testid="profile-save-btn"
                    >
                        <Save className={cn("w-5 h-5", isSaving && "animate-spin")} />
                        {isSaving ? getLabel('saving', language) : getLabel('save', language)}
                    </Button>
                    {selectedHobbies.length < APP_CONFIG.MIN_HOBBIES_COUNT && (
                        <Typography variant="caption" className="text-red-500 text-center block mt-2 font-medium">
                            {getLabel('min_hobbies_error', language, { min: APP_CONFIG.MIN_HOBBIES_COUNT })}
                        </Typography>
                    )}
                </div>
            </main>
        </div>
    );
}
