"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Profile } from "@/lib/constants";
import { fetchProfilesFromAPI } from "@/lib/services/userService";
import { getCurrentUser, sendLike as dbSendLike } from "@/lib/actions/userActions";
import { Prisma } from "@prisma/client";

export type ExtendedUser = Prisma.UserGetPayload<{
  include: {
    job: true;
    gender: true;
    hobbies: true;
    images: true;
    education: true;
    maritalStatus: true;
    intention: true;
    likesSent: {
      include: {
        receiver: {
          include: {
            job: true;
            hobbies: true;
            images: true;
            education: true;
            maritalStatus: true;
            intention: true;
          };
        };
      };
    };
    likesReceived: {
      include: {
        sender: {
          include: {
            job: true;
            hobbies: true;
            images: true;
            education: true;
            maritalStatus: true;
            intention: true;
          };
        };
      };
    };
  };
}> & {
  hobbiesArray?: string[];
};

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
  const [likesReceived, setLikesReceived] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [sentRequests, setSentRequests] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [language, setLanguage] = useState<"tr" | "en">("tr");

  const refreshCurrentUser = async () => {
    try {
      const user = (await getCurrentUser()) as unknown as ExtendedUser;

      if (user) {
        // Transform hobbies from Relation[] to string[] if needed for display helper
        if (Array.isArray(user.hobbies)) {
          user.hobbiesArray = user.hobbies.map((h: { id: string }) => h.id);
        } else {
          user.hobbiesArray = [];
        }

        // Transform likesSent to Profile objects for sentRequests
        const dbSentRequests =
          user.likesSent
            ?.map((like) => {
              const target = like.receiver;
              if (!target) return null;
              return {
                id: target.id,
                firstName: target.firstName || "",
                lastName: target.lastName || "",
                age: target.age || 0,
                location: target.city || "",
                distance: 0,
                job: target.job?.id || "",
                bio: target.bio || "",
                imageUrl: target.images?.[0]?.url || "https://via.placeholder.com/400",
                images: Array.isArray(target.images)
                  ? target.images.map((img: { url: string }) => img.url)
                  : [],
                education: target.education?.id || "edu_elementary",
                maritalStatus: target.maritalStatus?.id || "ms_private",
                intention: target.intention?.id || "int_chat",
                hobbies: Array.isArray(target.hobbies)
                  ? target.hobbies.map((h: { id: string }) => h.id)
                  : [],
                gender: target.gender?.id || "",
                iceBreaker: "",
              } as Profile;
            })
            .filter((p): p is Profile => p !== null) || [];

        setSentRequests(dbSentRequests);
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
      setProfiles(newProfiles);
    };
    loadData();
  }, []);

  const sendLike = async (profile: Profile) => {
    try {
      await dbSendLike({
        ...profile,
        city: profile.location,
      });
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
    setProfiles(newProfiles);
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
        setLanguage,
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
