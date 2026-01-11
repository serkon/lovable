"use server";

import { JobMetadata, BioTemplateMetadata, ProfileMetadata } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function getGenders(): Promise<string[]> {
  const genders = await prisma.gender.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return genders.map((g) => g.id);
}

export async function getJobs(): Promise<JobMetadata[]> {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return jobs.map((j) => ({
      id: j.id as string,
      field: (j.field || "other") as string,
    }));
  } catch (error) {
    console.error("Error in getJobs:", error);
    return [];
  }
}

export async function getHobbies(): Promise<string[]> {
  const hobbies = await prisma.hobby.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return hobbies.map((h) => h.id); // Return IDs (slugs) for translation
}

export async function getBioTemplates(): Promise<BioTemplateMetadata[]> {
  try {
    const templates = await prisma.bioTemplate.findMany({
      orderBy: { sortOrder: "asc" },
      include: { hobby: true },
    });
    return templates.map((t) => ({
      content: t.content,
      category: t.hobby?.name.replace("Internal: ", "") || "Genel",
    }));
  } catch (error) {
    console.error("Error in getBioTemplates:", error);
    return [];
  }
}

export async function getIceBreakers(): Promise<string[]> {
  const iceBreakers = await prisma.iceBreaker.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return iceBreakers.map((i) => i.content);
}

export async function getMaritalStatuses(): Promise<string[]> {
  const statuses = await prisma.maritalStatus.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return statuses.map((s) => s.id);
}

export async function getEducations(): Promise<string[]> {
  const educations = await prisma.education.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return educations.map((e) => e.id);
}

export async function getIntentions(): Promise<string[]> {
  const intentions = await prisma.intention.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return intentions.map((i) => i.id);
}

export async function getCountries(): Promise<string[]> {
  try {
    const countries = await (prisma as any).country.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return countries.map((c: any) => c.name);
  } catch (error) {
    console.error("Error in getCountries:", error);
    return [
      "Türkiye",
      "Germany",
      "United Kingdom",
      "United States",
      "Netherlands",
      "France",
      "Other",
    ];
  }
}

export async function getProfileMetadata(): Promise<ProfileMetadata> {
  const [hobbies, bioTemplates, maritalStatuses, educations, intentions, jobs, genders, countries] =
    await Promise.all([
      getHobbies(),
      getBioTemplates(),
      getMaritalStatuses(),
      getEducations(),
      getIntentions(),
      getJobs(),
      getGenders(),
      getCountries(),
    ]);

  return {
    hobbies,
    bioTemplates,
    maritalStatuses,
    educations,
    intentions,
    jobs,
    genders,
    countries,
  };
}
