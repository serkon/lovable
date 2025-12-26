"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const USER_INCLUDE = {
  job: true,
  gender: true,
  hobbies: true,
  images: true,
  education: true,
  maritalStatus: true,
  intention: true,
} as const;

export async function getCurrentUser() {
  // For MVP, we'll just take the first user in the DB
  let user = await prisma.user.findFirst({
    include: {
      ...USER_INCLUDE,
      likesSent: {
        include: {
          receiver: {
            include: USER_INCLUDE,
          },
        },
      },
      likesReceived: {
        include: {
          sender: {
            include: USER_INCLUDE,
          },
        },
      },
    } as any,
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Ayşe Yılmaz",
        age: 48,
        city: "İstanbul, Kadıköy",
        bio: "Huzurlu bir hayat süren, doğa aşığı ve kitap kurdu biriyim. Yeni yerler keşfetmeyi severim.",
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
        education: {
          connectOrCreate: {
            where: { name: "edu_bachelors" },
            create: { name: "edu_bachelors" },
          },
        },
        maritalStatus: {
          connectOrCreate: {
            where: { name: "ms_divorced" },
            create: { name: "ms_divorced" },
          },
        },
        intention: {
          connectOrCreate: {
            where: { name: "int_chat" },
            create: { name: "int_chat" },
          },
        },
      },
      include: {
        ...USER_INCLUDE,
        likesSent: {
          include: {
            receiver: {
              include: USER_INCLUDE,
            },
          },
        },
        likesReceived: {
          include: {
            sender: {
              include: USER_INCLUDE,
            },
          },
        },
      } as any,
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
  images?: string[];
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const { job, gender, hobbies, images, education, maritalStatus, intention, ...rest } = data;

  const updated = await prisma.user.update({
    where: { id: (currentUser as any).id },
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
      // Handle Images relation
      ...(images && {
        images: {
          deleteMany: {}, // Clear current images
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
      }),
      // Handle Education relation
      ...(education && {
        education: {
          connectOrCreate: {
            where: { name: education },
            create: { name: education },
          },
        },
      }),
      // Handle Marital Status relation
      ...(maritalStatus && {
        maritalStatus: {
          connectOrCreate: {
            where: { name: maritalStatus },
            create: { name: maritalStatus },
          },
        },
      }),
      // Handle Intention relation
      ...(intention && {
        intention: {
          connectOrCreate: {
            where: { name: intention },
            create: { name: intention },
          },
        },
      }),
    } as any,
    include: USER_INCLUDE as any,
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
  education?: string;
  maritalStatus?: string;
  job?: string;
  hobbies?: string[];
  images?: string[];
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const hobbyConnect = Array.isArray(targetProfile.hobbies)
    ? targetProfile.hobbies.map((h: string) => ({
        where: { name: h },
        create: { name: h },
      }))
    : [];

  const imagesCreate = Array.isArray(targetProfile.images)
    ? targetProfile.images.map((url: string, index: number) => ({
        url,
        order: index,
      }))
    : targetProfile.imageUrl
      ? [{ url: targetProfile.imageUrl, order: 0 }]
      : [];

  await prisma.user.upsert({
    where: { id: targetProfile.id.toString() },
    update: {},
    create: {
      id: targetProfile.id.toString(),
      name: targetProfile.name,
      age: targetProfile.age,
      city: targetProfile.location,
      imageUrl: targetProfile.imageUrl,
      bio: targetProfile.bio,
      job: {
        connectOrCreate: {
          where: { name: targetProfile.job || "Unknown" },
          create: { name: targetProfile.job || "Unknown" },
        },
      },
      education: {
        connectOrCreate: {
          where: { name: targetProfile.education || "edu_highschool" },
          create: { name: targetProfile.education || "edu_highschool" },
        },
      },
      maritalStatus: {
        connectOrCreate: {
          where: { name: targetProfile.maritalStatus || "ms_private" },
          create: { name: targetProfile.maritalStatus || "ms_private" },
        },
      },
      intention: {
        connectOrCreate: {
          where: { name: targetProfile.intention || "int_friendship" },
          create: { name: targetProfile.intention || "int_friendship" },
        },
      },
      hobbies: {
        connectOrCreate: hobbyConnect,
      },
      images: {
        create: imagesCreate,
      },
    } as any,
  });

  const like = await prisma.like.upsert({
    where: {
      senderId_receiverId: {
        senderId: (currentUser as any).id,
        receiverId: targetProfile.id.toString(),
      },
    },
    update: { status: "PENDING" },
    create: {
      senderId: (currentUser as any).id,
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
    include: USER_INCLUDE as any,
  });
}
