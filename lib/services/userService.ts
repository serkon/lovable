"use server";

import { prisma } from "@/lib/prisma";
import { Profile, UserStatus } from "@/lib/constants";
import { getCurrentUser } from "@/lib/actions/userActions";

export const fetchProfilesFromAPI = async (count: number = 20): Promise<Profile[]> => {
  try {
    const currentUser = await getCurrentUser();

    // Fetch users from DB that are NOT the current user
    const users = await prisma.user.findMany({
      take: count,
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
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return users.map((user: any) => {
      // Map DB User to Frontend Profile using slugs (IDs) for i18n
      return {
        id: user.id,
        firstName: user.firstName || "İsimsiz",
        lastName: user.lastName || "",
        age: user.age || 0,
        location: user.city || "Bilinmiyor",
        distance: Math.floor(Math.random() * 20) + 1,
        job: user.job?.id || "",
        education: user.education?.id || "edu_highschool",
        maritalStatus: user.maritalStatus?.id || "ms_single",
        intention: user.intention?.id || "int_friendship",
        bio: user.bio || "",
        hobbies: user.hobbies.map((h: { id: string }) => h.id),
        imageUrl:
          user.images && user.images.length > 0
            ? user.images[0].url
            : "https://via.placeholder.com/400",
        images:
          user.images && user.images.length > 0
            ? user.images.map((img: { url: string }) => img.url)
            : [],
        iceBreaker: "Merhaba, nasılsın?",
        gender: user.gender?.id,
        userStatus: user.userStatus as UserStatus,
        lastActiveAt: user.lastActiveAt,
      } as Profile;
    });
  } catch (error) {
    console.error("Failed to fetch profiles from DB:", error);
    return [];
  }
};
