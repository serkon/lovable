"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MOCK_PROFILES, MOCK_LIKED_BY_PROFILES, MOCK_MATCHES, Profile } from "@/lib/mock-data";
import { fetchProfilesFromAPI } from "@/lib/services/userService";

// Define the shape of our context
interface AppContextType {
  // Data Lists
  profiles: Profile[];
  likesReceived: Profile[];
  matches: Profile[];
  sentRequests: Profile[];

  // Actions
  sendLike: (profile: Profile) => void;
  passProfile: (profileId: number) => void;
  approveMatch: (profile: Profile) => void;
  rejectMatch: (profileId: number) => void;
  cancelRequest: (profileId: number) => void;
  resetProfiles: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [likesReceived, setLikesReceived] = useState<Profile[]>(MOCK_LIKED_BY_PROFILES);
  const [matches, setMatches] = useState<Profile[]>(MOCK_MATCHES); // Mutual matches
  const [sentRequests, setSentRequests] = useState<Profile[]>([]); // "Tanışmak İsterim" sent by me

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      // Try fetching new data
      const newProfiles = await fetchProfilesFromAPI(20);
      if (newProfiles.length > 0) {
        setProfiles(newProfiles);
      } else {
        setProfiles(MOCK_PROFILES); // Fallback
      }
    };
    loadData();
  }, []);

  // Action: User clicks "Tanışmak İsterim" on Dashboard
  const sendLike = (profile: Profile) => {
    // Add to my sent requests
    setSentRequests((prev) => [...prev, profile]);
    // Remove from discoverable profiles to show next
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  // Action: User clicks "Pass" on Dashboard
  const passProfile = (profileId: number) => {
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
  };

  // Action: User approves a "Like Received" -> Becomes a Match
  const approveMatch = (profile: Profile) => {
    // Add to Matches
    setMatches((prev) => [...prev, profile]);
    // Remove from Likes Received list
    setLikesReceived((prev) => prev.filter((p) => p.id !== profile.id));
  };

  // Action: User passes a "Like Received"
  const rejectMatch = (profileId: number) => {
    setLikesReceived((prev) => prev.filter((p) => p.id !== profileId));
  };

  // Action: User cancels a sent request
  const cancelRequest = (profileId: number) => {
    setSentRequests((prev) => prev.filter((p) => p.id !== profileId));
  };

  // Action: Reset Profiles (Fetch new batch)
  const resetProfiles = async () => {
    setProfiles([]); // Clear current
    const newProfiles = await fetchProfilesFromAPI(20);
    if (newProfiles.length > 0) {
      setProfiles(newProfiles);
    } else {
      setProfiles(MOCK_PROFILES);
    }
  };

  return (
    <AppContext.Provider
      value={{
        profiles,
        likesReceived,
        matches,
        sentRequests,
        sendLike,
        passProfile,
        approveMatch,
        rejectMatch,
        cancelRequest,
        resetProfiles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook for easy usage
export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
