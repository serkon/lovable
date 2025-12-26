"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Ayşe Yılmaz",
        age: 48,
        city: "İstanbul, Kadıköy",
        bio: "Huzurlu bir hayat süren, doğa aşığı ve kitap kurdu biriyim. Yeni yerler keşfetmeyi severim.",
        job: {
          connectOrCreate: {
            where: { id: "job_retired_teacher" },
            create: { id: "job_retired_teacher", name: "Internal: Emekli Öğretmen", sortOrder: 10 },
          },
        },
        gender: {
          connectOrCreate: {
            where: { id: "gender_female" },
            create: { id: "gender_female", name: "Internal: Kadın", sortOrder: 10 },
          },
        },
        hobbies: {
          connectOrCreate: [
            { id: "hobby_nature", name: "Internal: Gezi, Doğa & Kamp" },
            { id: "hobby_culture", name: "Internal: Kültür, Sanat & Kitap" },
          ].map((h) => ({
            where: { id: h.id },
            create: { id: h.id, name: h.name, sortOrder: 10 },
          })),
        },
        education: {
          connectOrCreate: {
            where: { id: "edu_bachelors" },
            create: { id: "edu_bachelors", name: "Internal: Lisans", sortOrder: 30 },
          },
        },
        maritalStatus: {
          connectOrCreate: {
            where: { id: "ms_divorced" },
            create: { id: "ms_divorced", name: "Internal: Boşanmış", sortOrder: 20 },
          },
        },
        intention: {
          connectOrCreate: {
            where: { id: "int_chat" },
            create: { id: "int_chat", name: "Internal: Sohbet", sortOrder: 10 },
          },
        },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop",
              order: 0,
            },
          ],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: { id: (currentUser as any).id },
    data: {
      ...rest,
      // Handle Job relation
      ...(job && {
        job: {
          connect: { id: job },
        },
      }),
      // Handle Gender relation
      ...(gender && {
        gender: {
          connect: { id: gender },
        },
      }),
      // Handle Hobbies relation (replaces existing if updated)
      ...(hobbies && {
        hobbies: {
          set: [], // Clear current hobbies
          connect: hobbies.map((id: string) => ({ id })),
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
          connect: { id: education },
        },
      }),
      // Handle Marital Status relation
      ...(maritalStatus && {
        maritalStatus: {
          connect: { id: maritalStatus },
        },
      }),
      // Handle Intention relation
      ...(intention && {
        intention: {
          connect: { id: intention },
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  city: string;
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
    ? targetProfile.hobbies.map((id: string) => ({ id }))
    : [];

  const imagesCreate =
    Array.isArray(targetProfile.images) && targetProfile.images.length > 0
      ? targetProfile.images.map((url: string, index: number) => ({
          url,
          order: index,
        }))
      : [];

  await prisma.user.upsert({
    where: { id: targetProfile.id.toString() },
    update: {},
    create: {
      id: targetProfile.id.toString(),
      name: targetProfile.name,
      age: targetProfile.age,
      city: targetProfile.city,
      bio: targetProfile.bio,
      job: {
        connect: { id: targetProfile.job || "job_retired_teacher" },
      },
      education: {
        connect: { id: targetProfile.education || "edu_highschool" },
      },
      maritalStatus: {
        connect: { id: targetProfile.maritalStatus || "ms_private" },
      },
      intention: {
        connect: { id: targetProfile.intention || "int_friendship" },
      },
      hobbies: {
        connect: hobbyConnect,
      },
      images: {
        create: imagesCreate,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });

  const like = await prisma.like.upsert({
    where: {
      senderId_receiverId: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        senderId: (currentUser as any).id,
        receiverId: targetProfile.id.toString(),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: { status: "approved" } as any,
    create: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderId: (currentUser as any).id,
      receiverId: targetProfile.id.toString(),
      status: "PENDING",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  revalidatePath("/dashboard");
  revalidatePath("/sent-requests");
  return like;
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    include: USER_INCLUDE as any,
  });
}
