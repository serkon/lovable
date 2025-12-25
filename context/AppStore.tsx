"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MOCK_PROFILES, MOCK_LIKED_BY_PROFILES, MOCK_MATCHES, Profile, EducationId, MaritalStatusId, IntentionId } from "@/lib/mock-data";
import { fetchProfilesFromAPI } from "@/lib/services/userService";
import { getCurrentUser, sendLike as dbSendLike } from "@/lib/actions/userActions";
import { User } from "@prisma/client";

export interface ExtendedUser extends User {
  hobbiesArray?: string[];
  job?: { id: string; name: string } | null;
  hobbies?: { id: string; name: string }[];
  likesSent?: { id: string; receiver: unknown }[];
}

interface AppContextType {
  profiles: Profile[];
  likesReceived: Profile[];
  matches: Profile[];
  sentRequests: Profile[];
  currentUser: ExtendedUser | null;

  sendLike: (profile: Profile) => Promise<void>;
  passProfile: (profileId: string | number) => void;
  approveMatch: (profile: Profile) => void;
  rejectMatch: (profileId: string | number) => void;
  cancelRequest: (profileId: string | number) => void;
  resetProfiles: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;

  language: "tr" | "en";
  setLanguage: (lang: "tr" | "en") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [likesReceived, setLikesReceived] = useState<Profile[]>(MOCK_LIKED_BY_PROFILES);
  const [matches, setMatches] = useState<Profile[]>(MOCK_MATCHES);
  const [sentRequests, setSentRequests] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [language, setLanguage] = useState<"tr" | "en">("tr");

  const refreshCurrentUser = async () => {
    try {
      const user = await getCurrentUser() as ExtendedUser;

      if (user) {
        // Transform hobbies from Relation[] to string[] if needed for display helper
        if (Array.isArray(user.hobbies)) {
          user.hobbiesArray = user.hobbies.map(h => (h as any).name);
        } else {
          user.hobbiesArray = [];
        }

        // Transform likesSent to Profile objects for sentRequests
        const dbSentRequests = user.likesSent?.map((like) => {
          const target = (like as any).receiver;
          if (!target) return null;
          return {
            id: target.id,
            name: target.name || "",
            age: target.age || 0,
            location: target.city || "",
            distance: 0,
            job: target.job?.name || target.job || "",
            bio: target.bio || "",
            imageUrl: target.imageUrl || "",
            education: target.education as EducationId,
            maritalStatus: target.maritalStatus as MaritalStatusId,
            intention: target.intention as IntentionId,
            hobbies: Array.isArray(target.hobbies) ? target.hobbies.map((h: any) => h.name) : [],
            gender: target.gender?.name || target.gender,
            iceBreaker: ""
          };
        }).filter(Boolean) || [];

        setSentRequests(dbSentRequests as Profile[]);
      }
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await refreshCurrentUser();
      const newProfiles = await fetchProfilesFromAPI(20);
      setProfiles(newProfiles.length > 0 ? newProfiles : MOCK_PROFILES);
    };
    loadData();
  }, []);

  const sendLike = async (profile: Profile) => {
    try {
      await dbSendLike(profile);
      // We don't need to manually update sentRequests here because revalidatePath and refreshCurrentUser (if called) would handle it, 
      // but for instant UI let's keep local update:
      setSentRequests((prev) => [...prev, profile]);
      setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    } catch (error) {
      console.error("Failed to send like:", error);
    }
  };

  const passProfile = (profileId: string | number) => {
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
  };

  const approveMatch = (profile: Profile) => {
    setMatches((prev) => [...prev, profile]);
    setLikesReceived((prev) => prev.filter((p) => p.id !== profile.id));
  };

  const rejectMatch = (profileId: string | number) => {
    setLikesReceived((prev) => prev.filter((p) => p.id !== profileId));
  };

  const cancelRequest = (profileId: string | number) => {
    setSentRequests((prev) => prev.filter((p) => p.id !== profileId));
  };

  const resetProfiles = async () => {
    setProfiles([]);
    const newProfiles = await fetchProfilesFromAPI(20);
    setProfiles(newProfiles.length > 0 ? newProfiles : MOCK_PROFILES);
  };

  return (
    <AppContext.Provider
      value={{
        profiles,
        likesReceived,
        matches,
        sentRequests,
        currentUser,
        sendLike,
        passProfile,
        approveMatch,
        rejectMatch,
        cancelRequest,
        resetProfiles,
        refreshCurrentUser,
        language,
        setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
