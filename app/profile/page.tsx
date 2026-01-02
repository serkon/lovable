"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Settings, X } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { updateUserProfile } from "@/lib/actions/userActions";
import { getHobbies, getBioTemplates, getMaritalStatuses, getEducations, getIntentions, getJobs } from "@/lib/actions/contentActions";
import { MaritalStatusId, EducationId, IntentionId } from "@/lib/constants";
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
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
            setHobbiesList(dbHobbies || []);
            setBioTemplates(dbTemplates || []);
            setMaritalStatusesList(dbMarital || []);
            setEducationsList(dbEdu || []);
            setIntentionsList(dbIntention || []);
            setJobsList(dbJobs || []);
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
            setMaritalStatus(currentUser.maritalStatus?.id as MaritalStatusId || "ms_private");
            setEducation(currentUser.education?.id as EducationId || "edu_elementary");
            setIntention(currentUser.intention?.id as IntentionId || "int_chat");

            if (currentUser.images && currentUser.images.length > 0) {
                setUserImages(currentUser.images.map(img => img.url));
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
            await updateUserProfile({
                name,
                age: parseInt(age),
                city,
                job,
                bio,
                hobbies: selectedHobbies,
                images: userImages,
                maritalStatus,
                education,
                intention
            });
            await refreshCurrentUser();
            alert(getLabel('profile_updated_success', language));
        } catch (error) {
            console.error("Save failed:", error);
            alert(getLabel('error_generic', language));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20" data-testid="profile-page-container">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="font-bold">Profilimi Düzenle</h1>
                </div>
                <div className="flex gap-2">
                    <Link href="/settings">
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Button onClick={handleSave} disabled={isSaving}>
                        Kaydet
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-xl px-4 py-8 space-y-10" data-testid="profile-main">
                {/* Photo Section */}
                <section className="space-y-4" data-testid="profile-photos-section">
                    <div className="flex items-center justify-between px-1">
                        <Label className="text-xs font-bold text-muted-foreground">Fotoğraflar</Label>
                        <span className="text-xs text-muted-foreground">{userImages.length}/6</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {userImages.map((url, idx) => (
                            <div key={idx} className="relative aspect-square bg-muted border overflow-hidden">
                                <Image src={url} alt="Profile" fill className="object-cover" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeImage(idx)}
                                    className="absolute right-1 top-1 h-6 w-6"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                        {userImages.length < 6 && (
                            <Button
                                variant="outline"
                                onClick={addImage}
                                className="aspect-square flex flex-col items-center justify-center border-dashed"
                            >
                                <Camera className="h-6 w-6" />
                                <span className="text-xs">Ekle</span>
                            </Button>
                        )}
                    </div>
                </section>

                <Separator />

                {/* Basic Info */}
                <section className="space-y-6" data-testid="profile-basic-info-section">
                    <h3 className="text-sm font-bold text-muted-foreground">Temel Bilgiler</h3>
                    <Card className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Adınız"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="age">Yaş</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Yaşınız"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Şehir</Label>
                                <Input
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Şehriniz"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job">Meslek</Label>
                            <Select value={job} onValueChange={setJob}>
                                <SelectTrigger id="job">
                                    <SelectValue placeholder="Mesleğinizi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobsList.map(j => <SelectItem key={j} value={j}>{getLabel(j, language)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </section>

                {/* Bio Section */}
                <section className="space-y-4" data-testid="profile-bio-section">
                    <Label htmlFor="bio" className="text-sm font-bold text-muted-foreground">Hakkımda</Label>
                    <Card className="p-4 space-y-4">
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Kendinizden bahsedin..."
                        />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {bioTemplates.slice(0, 3).map((t, idx) => (
                                <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="cursor-pointer text-[10px]"
                                    onClick={() => setBio(prev => prev ? `${prev} ${t}` : t)}
                                >
                                    + {t.substring(0, 15)}...
                                </Badge>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* Details Section */}
                <section className="space-y-6" data-testid="profile-details-section">
                    <h3 className="text-sm font-bold text-muted-foreground">Detaylar</h3>
                    <Card className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="intention">Niyet</Label>
                            <Select value={intention} onValueChange={(v) => setIntention(v as IntentionId)}>
                                <SelectTrigger id="intention">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {intentionsList.map(i => <SelectItem key={i} value={i}>{getLabel(i, language)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="education">Eğitim</Label>
                            <Select value={education} onValueChange={(v) => setEducation(v as EducationId)}>
                                <SelectTrigger id="education">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {educationsList.map(e => <SelectItem key={e} value={e}>{getLabel(e, language)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="marital">Medeni Durum</Label>
                            <Select value={maritalStatus} onValueChange={(v) => setMaritalStatus(v as MaritalStatusId)}>
                                <SelectTrigger id="marital">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {maritalStatusesList.map(s => <SelectItem key={s} value={s}>{getLabel(s, language)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </section>

                {/* Hobbies Section */}
                <section className="space-y-4" data-testid="profile-hobbies-section">
                    <Label className="text-sm font-bold text-muted-foreground">Hobiler</Label>
                    <div className="flex flex-wrap gap-2">
                        {hobbiesList.map(hobby => (
                            <Badge
                                key={hobby}
                                variant={selectedHobbies.includes(hobby) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => toggleHobby(hobby)}
                            >
                                {getLabel(hobby, language)}
                            </Badge>
                        ))}
                    </div>
                </section>

                <div className="pt-8">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full font-bold"
                    >
                        {isSaving ? "Güncelleniyor..." : "Profilimi Güncelle"}
                    </Button>
                </div>
            </main>
        </div>
    );
}
