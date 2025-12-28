"use server";

import { prisma } from "@/lib/prisma";

export interface HeroProfile {
  name: string;
  age: number;
  loc: string; // We'll map city to loc
  img: string; // We'll take the first image
}

export async function getHeroProfiles(): Promise<HeroProfile[]> {
  try {
    // Fetch roughly 12 random users.
    // Since we can't easily do RANDOM() in a cross-db way with Prisma pure API without raw query,
    // and we have a small number of users (~20), we can fetch a subset or all and shuffle.
    // For now, let's just fetch the last 20 created users and shuffle them in JS.
    const users = await prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        age: true,
        city: true,
        images: {
          take: 1,
          orderBy: { order: "asc" },
          select: { url: true },
        },
      },
      where: {
        images: {
          some: {}, // Only users with images
        },
      },
    });

    // Shuffle array
    const shuffled = users.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    return selected.map((u) => ({
      name: u.name || "Misafir",
      age: u.age || 0,
      loc: (u.city || "Bilinmiyor,").split(",")[0].trim(), // "İstanbul, Kadıköy" -> "İstanbul"
      img: u.images[0]?.url || "https://via.placeholder.com/300",
    }));
  } catch (error) {
    console.error("Error fetching hero profiles:", error);
    return [];
  }
}
