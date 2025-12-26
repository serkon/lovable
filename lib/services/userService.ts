"use server";

import { prisma } from "@/lib/prisma";
import { Profile, EducationId, MaritalStatusId, IntentionId } from "@/lib/constants";

// Helper to pick random item (not used if fetching from DB, but kept for potential fallbacks if needed, though we will remove mock logic)

import { getCurrentUser } from "@/lib/actions/userActions";

export const fetchProfilesFromAPI = async (count: number = 20): Promise<Profile[]> => {
  try {
    const currentUser = await getCurrentUser();

    // Fetch users from DB that are NOT the current user
    const users = await prisma.user.findMany({
      take: count,
      // If we want random order, Prisma doesn't support RAND() natively easily without raw query.
      // For MVP, just taking recent ones or skipping current user is fine.
      where: {
        id: {
          not: currentUser?.id,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        job: true,
        hobbies: true,
        gender: true,
        images: true,
        education: true,
        maritalStatus: true,
        intention: true,
      } as any,
    });

    return users.map((user: any) => {
      // Map DB User to Frontend Profile
      return {
        id: user.id,
        name: user.name || "İsimsiz",
        age: user.age || 0,
        location: user.city || "Bilinmiyor",
        distance: Math.floor(Math.random() * 20) + 1, // Fake distance for now as we don't have geo
        job: user.job?.name || user.job?.toString() || "", // Handle relation or fallback
        education: (user.education?.name as EducationId) || "edu_highschool",
        maritalStatus: (user.maritalStatus?.name as MaritalStatusId) || "ms_single",
        intention: (user.intention?.name as IntentionId) || "int_friendship",
        bio: user.bio || "",
        hobbies: user.hobbies.map((h: { name: string }) => h.name),
        imageUrl:
          user.imageUrl ||
          (user.images && user.images.length > 0
            ? user.images[0].url
            : "https://via.placeholder.com/400"),
        images:
          user.images && user.images.length > 0
            ? user.images.map((img: { url: string }) => img.url)
            : user.imageUrl
              ? [user.imageUrl]
              : [],
        iceBreaker: "Merhaba, nasılsın?", // Default or fetch from IceBreaker table if relation existed (it doesn't on User yet, logic was random)
        gender: user.gender?.name,
      } as Profile; // Casting to Profile ensuring it matches shape roughly
    });
  } catch (error) {
    console.error("Failed to fetch profiles from DB:", error);
    return [];
  }
};
