"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Camera, Save, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MARITAL_STATUSES, EDUCATIONS, INTENTIONS, MaritalStatusId, EducationId, IntentionId } from "@/lib/mock-data";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { APP_CONFIG } from "@/lib/config";
import { updateUserProfile } from "@/lib/actions/userActions";
import { getHobbies } from "@/lib/actions/contentActions";

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
    const [isSaving, setIsSaving] = useState(false);

    // Dynamic content state
    const [hobbiesList, setHobbiesList] = useState<string[]>([]);

    // Fetch dynamic content on mount
    useEffect(() => {
        const loadContent = async () => {
            const dbHobbies = await getHobbies();
            setHobbiesList(dbHobbies);
        };
        loadContent();
    }, []);

    // Sync with store data when component mounts or currentUser changes
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setAge(currentUser.age?.toString() || "");
            setCity(currentUser.city || "");
            setJob(currentUser.job?.name || "");
            setBio(currentUser.bio || "");
            setMaritalStatus(currentUser.maritalStatus as MaritalStatusId || "ms_private");
            setEducation(currentUser.education as EducationId || "edu_elementary");
            setIntention(currentUser.intention as IntentionId || "int_chat");

            if (currentUser.hobbies) {
                setSelectedHobbies(currentUser.hobbies.map(h => h.name));
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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserProfile({
                name,
                age: parseInt(age),
                city,
                job,
                bio,
                maritalStatus,
                education,
                intention,
                hobbies: selectedHobbies,
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
                {/* Profile Photo Section */}
                <section className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-purple-100 flex items-center justify-center">
                            {currentUser?.imageUrl ? (
                                <Image
                                    src={currentUser.imageUrl}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <Camera className="w-12 h-12 text-purple-300" />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <Typography variant="h2" className="text-xl font-bold">{name || getLabel('guest', language)}, {age}</Typography>
                    <Typography variant="caption" className="text-gray-500">{city}</Typography>
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
                            <input
                                type="text"
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-slate-50/50"
                                data-testid="profile-edit-job"
                            />
                        </div>
                    </div>
                </section>

                {/* Bio Section */}
                <section className="space-y-3">
                    <Typography variant="h3" className="text-base font-semibold text-gray-700">{getLabel('bio', language)}</Typography>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full h-32 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 bg-white shadow-sm"
                        placeholder={getLabel('placeholder_bio', language)}
                        data-testid="profile-edit-bio"
                    />
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
                            {INTENTIONS.map(i => <option key={i} value={i}>{getLabel(i, language)}</option>)}
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
                            {EDUCATIONS.map(e => <option key={e} value={e}>{getLabel(e, language)}</option>)}
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
                            {MARITAL_STATUSES.map(s => <option key={s} value={s}>{getLabel(s, language)}</option>)}
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
                                {hobby}
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
