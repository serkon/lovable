"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Profile, USER_STATUS, HEARTBEAT_INTERVAL, UserStatus } from "@/lib/constants";
import { fetchProfilesFromAPI } from "@/lib/services/userService";
import {
  getCurrentUser,
  sendLike as dbSendLike,
  logoutUser,
  updateHeartbeat,
  updateStatus as dbUpdateStatus,
} from "@/lib/actions/userActions";
import { useSessionManager } from "@/hooks/useSessionManager";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";

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
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  userStatus?: string | null;
  lastActiveAt?: Date | null;
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
  logout: () => Promise<void>;
  setStatus: (status: UserStatus) => Promise<void>;

  language: "tr" | "en";
  setLanguage: (lang: "tr" | "en") => void;
  getLastActivity: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [likesReceived, setLikesReceived] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [sentRequests, setSentRequests] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [language, setLanguage] = useState<"tr" | "en">("tr");

  // Session Management via Web Worker
  const autoAwayMs = (Number(process.env.NEXT_PUBLIC_AUTO_AWAY_MINUTES) || 5) * 60 * 1000;
  // Default 15 mins for warning
  const warningMs = (Number(process.env.NEXT_PUBLIC_AUTO_LOGOUT_MINUTES) || 15) * 60 * 1000;
  // Default 30 secs countdown
  const logoutCountdownMs = (Number(process.env.NEXT_PUBLIC_LOGOUT_WARNING_SECONDS) || 30) * 1000;

  const refreshCurrentUser = async () => {
    try {
      const user = (await getCurrentUser()) as unknown as ExtendedUser;

      if (user) {
        if (Array.isArray(user.hobbies)) {
          user.hobbiesArray = user.hobbies.map((h: { id: string }) => h.id);
        } else {
          user.hobbiesArray = [];
        }

        const dbSentRequests =
          user.likesSent
            ?.map((like) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const target = like.receiver as any;
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                gender: (target as any).gender?.id || "",
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

  const setStatus = async (status: UserStatus) => {
    try {
      await dbUpdateStatus(status);
      await refreshCurrentUser();
    } catch (error) {
      console.error("Failed to update status:", error);
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

  const { resetTimer, getLastActivity } = useSessionManager({
    awayTimeoutMs: autoAwayMs,
    warningTimeoutMs: warningMs,
    logoutTimeoutMs: warningMs + logoutCountdownMs,
    onStatusChange: (newStatus) => {
      if (!currentUser) return;
      // Only auto-update if not invisible & not manual offline (though manual offline usually means logged out)
      if (
        currentUser.userStatus !== USER_STATUS.INVISIBLE &&
        currentUser.userStatus !== USER_STATUS.OFFLINE
      ) {
        // If we are coming back ONLINE from AWAY, or going AWAY
        // We trust the manager's state transition
        const targetStatus = newStatus === "ONLINE" ? USER_STATUS.ONLINE : USER_STATUS.AWAY;
        if (currentUser.userStatus !== targetStatus) {
          setStatus(targetStatus).catch(console.error);
        }
      }
    },
    onLogoutWarning: () => {
      if (!currentUser) return;
      toast.warning("Hareketsiz kaldınız.", {
        description: "Oturumunuz 30 saniye içinde kapatılacak.",
        action: {
          label: "Uzat",
          onClick: () => {
            resetTimer(); // Reset the timer on user action
            toast.success("Oturum süreniz uzatıldı.");
          },
        },
        duration: logoutCountdownMs, // Show exactly for the duration of the countdown
      });
    },
    onLogout: () => {
      if (!currentUser) return;
      toast.dismiss(); // Close any potential warning toasts
      toast.error("Oturum süreniz doldu.");
      logout();
    },
  });

  // Heartbeat mechanism
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      // Don't send heartbeat if invisible or offline
      if (
        currentUser.userStatus !== USER_STATUS.INVISIBLE &&
        currentUser.userStatus !== USER_STATUS.OFFLINE
      ) {
        // cast to UserStatus to be safe, though USER_STATUS constants should align
        await updateHeartbeat(currentUser.userStatus as UserStatus);
      }
    }, HEARTBEAT_INTERVAL);

    return () => clearInterval(interval);
  }, [currentUser]);

  const sendLike = async (profile: Profile) => {
    try {
      await dbSendLike({
        ...profile,
        city: profile.location,
      });
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

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // logoutUser calls redirect, but we'll also force a hard reload below
    } finally {
      setCurrentUser(null);
      setSentRequests([]);
      setMatches([]);
      setLikesReceived([]);
      window.location.href = "/";
    }
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
        logout,
        setStatus,
        language,
        setLanguage,
        getLastActivity,
        // Note: The hook returns resetTimer, currentState, getLastActivity.
        // We need to destructure correctly from useSessionManager.
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
