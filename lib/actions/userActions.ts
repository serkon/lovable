"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCurrentUser() {
  // For MVP, we'll just take the first user in the DB
  let user = await prisma.user.findFirst({
    include: {
      job: true,
      gender: true,
      hobbies: true,
      likesSent: {
        include: {
          receiver: {
            include: {
              job: true,
              hobbies: true,
            },
          },
        },
      },
      likesReceived: {
        include: {
          sender: {
            include: {
              job: true,
              hobbies: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Ayşe Yılmaz",
        age: 48,
        city: "İstanbul, Kadıköy",
        bio: "Huzurlu bir hayat süren, doğa aşığı ve kitap kurdu biriyim. Yeni yerler keşfetmeyi severim.",
        education: "edu_bachelors",
        maritalStatus: "ms_divorced",
        intention: "int_chat",
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop",

        job: {
          connectOrCreate: {
            where: { name: "Emekli Öğretmen" },
            create: { name: "Emekli Öğretmen" },
          },
        },
        gender: {
          connectOrCreate: {
            where: { name: "Kadın" },
            create: { name: "Kadın" },
          },
        },
        hobbies: {
          connectOrCreate: ["Gezi, Doğa & Kamp", "Kültür, Sanat & Kitap"].map((h) => ({
            where: { name: h },
            create: { name: h },
          })),
        },
      },
      include: {
        job: true,
        gender: true,
        hobbies: true,
        likesSent: {
          include: {
            receiver: {
              include: { job: true, hobbies: true },
            },
          },
        },
        likesReceived: {
          include: {
            sender: {
              include: { job: true, hobbies: true },
            },
          },
        },
      },
    });
  }

  return user;
}

export async function updateUserProfile(data: {
  name?: string;
  age?: number;
  city?: string;
  job?: string;
  gender?: string;
  bio?: string;
  maritalStatus?: string;
  education?: string;
  intention?: string;
  hobbies?: string[];
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const { job, gender, hobbies, ...rest } = data;

  const updated = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      ...rest,
      // Handle Job relation
      ...(job && {
        job: {
          connectOrCreate: {
            where: { name: job },
            create: { name: job },
          },
        },
      }),
      // Handle Gender relation
      ...(gender && {
        gender: {
          connectOrCreate: {
            where: { name: gender },
            create: { name: gender },
          },
        },
      }),
      // Handle Hobbies relation (replaces existing if updated)
      ...(hobbies && {
        hobbies: {
          set: [], // Clear current hobbies
          connectOrCreate: hobbies.map((h: string) => ({
            where: { name: h },
            create: { name: h },
          })),
        },
      }),
    },
    include: {
      job: true,
      gender: true,
      hobbies: true,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return updated;
}

export async function sendLike(targetProfile: {
  id: string | number;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  bio: string;
  intention: string;
  job?: string;
  hobbies?: string[];
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  // Ensure the target profile exists in our DB
  // Since targetProfile comes from API or mock, it might have string fields.
  // We need to adapt them to relations.

  // Note: if targetProfile.hobbies is array of strings.

  const hobbyConnect = Array.isArray(targetProfile.hobbies)
    ? targetProfile.hobbies.map((h: string) => ({
        where: { name: h },
        create: { name: h },
      }))
    : [];

  await prisma.user.upsert({
    where: { id: targetProfile.id.toString() },
    update: {}, // Don't update if exists, assume its fresh data
    create: {
      id: targetProfile.id.toString(),
      name: targetProfile.name,
      age: targetProfile.age,
      city: targetProfile.location, // Assuming location maps to city
      imageUrl: targetProfile.imageUrl,
      bio: targetProfile.bio,
      intention: targetProfile.intention,
      job: {
        connectOrCreate: {
          where: { name: targetProfile.job || "Unknown" },
          create: { name: targetProfile.job || "Unknown" },
        },
      },
      // Skipping gender for mock profiles if not present, or create default
      hobbies: {
        connectOrCreate: hobbyConnect,
      },
    },
  });

  const like = await prisma.like.upsert({
    where: {
      senderId_receiverId: {
        senderId: currentUser.id,
        receiverId: targetProfile.id.toString(),
      },
    },
    update: { status: "PENDING" },
    create: {
      senderId: currentUser.id,
      receiverId: targetProfile.id.toString(),
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/sent-requests");
  return like;
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      job: true,
      hobbies: true,
      gender: true,
    },
  });
}
