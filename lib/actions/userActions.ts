"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { checkProfilePhoto } from "./aiActions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_STATUS, UserStatus } from "@/lib/constants";

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
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
    // If the cookie exists but the user is gone (e.g. DB reset), clear the cookie
    (await cookies()).delete("userId");
    return null;
  }

  return user;
}

export async function createGuestUser() {
  const user = await prisma.user.create({
    data: {
      firstName: "",
      lastName: "",
      age: 0,
      bio: "",
    },
  });

  (await cookies()).set("userId", user.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return user;
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (user && user.password === password) {
    // Set status to ONLINE upon login
    await prisma.user.update({
      where: { id: user.id },
      data: { userStatus: USER_STATUS.ONLINE } as any,
    });

    (await cookies()).set("userId", user.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    return { success: true };
  }

  return { success: false, error: "Geçersiz e-posta veya şifre" };
}

export async function logoutUser() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { userStatus: USER_STATUS.OFFLINE } as any,
    });
  }

  (await cookies()).set("userId", "", { path: "/", maxAge: 0 });
  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/");
}

export async function registerUser(data: { email: string; password: string; country: string }) {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return { success: false, error: "User session not found. Please refresh and try again." };

  try {
    await prisma.user.update({
      where: { id: (currentUser as any).id }, // eslint-disable-line @typescript-eslint/no-explicit-any
      data: {
        email: data.email,
        password: data.password,
        country: data.country,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Bu e-posta adresi zaten kullanımda olabilir." };
  }
}

export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  age?: number;
  city?: string;
  job?: string;
  gender?: string;
  bio?: string;
  maritalStatus?: string;
  education?: string;
  intention?: string;
  hobbies?: string[];
  email?: string;
  phone?: string;
  images?: string[];
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const { job, gender, hobbies, images, education, maritalStatus, intention, ...rest } = data;

  // Explicitly remove password and id to prevent accidental overwrites
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, id, ...safeData } = rest as any;

  // Build the update object dynamically to only include provided fields
  const changes: any = { ...safeData };

  if (job) changes.job = { connect: { id: job } };
  if (gender) changes.gender = { connect: { id: gender } };
  if (education) changes.education = { connect: { id: education } };
  if (maritalStatus) changes.maritalStatus = { connect: { id: maritalStatus } };
  if (intention) changes.intention = { connect: { id: intention } };

  if (hobbies) {
    changes.hobbies = {
      set: [], // Clear current hobbies
      connect: hobbies.map((id: string) => ({ id })),
    };
  }

  if (images) {
    changes.images = {
      deleteMany: {}, // Clear current images
      create: images.map((url: string, index: number) => ({
        url,
        order: index,
      })),
    };
  }

  const updated = await prisma.user.update({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: { id: (currentUser as any).id },
    data: changes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    include: USER_INCLUDE as any,
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return updated;
}

export async function sendLike(targetProfile: {
  id: string | number;
  firstName: string;
  lastName: string;
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
      firstName: targetProfile.firstName,
      lastName: targetProfile.lastName,
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

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // AI Photo Check
    const aiCheck = await checkProfilePhoto(buffer, file.type);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const publicDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(publicDir, filename);

    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${filename}`,
      aiCheck,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

export async function deleteImage(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/")) return { success: false };

  try {
    const filename = imageUrl.replace("/uploads/", "");
    const filePath = path.join(process.cwd(), "public/uploads", filename);
    await unlink(filePath);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false };
  }
}

export async function updateStatus(status: UserStatus) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  return await prisma.user.update({
    where: { id: currentUser.id },
    data: { userStatus: status, lastActiveAt: new Date() },
  });
}

export async function updateHeartbeat(currentStatus: UserStatus) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  // If invisible, keep invisible (or whatever status is passed, essentially strictly trusting client triggers within reason)
  // But generally we don't heartbeat if offline.
  if (currentStatus === USER_STATUS.INVISIBLE) {
    return await prisma.user.update({
      where: { id: currentUser.id },
      data: { lastActiveAt: new Date() }, // Just update time, keep status as is (INVISIBLE)
    });
  }

  return await prisma.user.update({
    where: { id: currentUser.id },
    data: { lastActiveAt: new Date(), userStatus: currentStatus },
  });
}
