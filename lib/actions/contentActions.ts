"use server";

import { prisma } from "@/lib/prisma";

export async function getGenders() {
  const genders = await prisma.gender.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return genders.map((g) => g.id);
}

export async function getJobs() {
  const jobs = await prisma.job.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return jobs.map((j) => j.id); // Return IDs (slugs) for translation
}

export async function getHobbies() {
  const hobbies = await prisma.hobby.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return hobbies.map((h) => h.id); // Return IDs (slugs) for translation
}

export async function getBioTemplates() {
  const templates = await prisma.bioTemplate.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return templates.map((t) => t.content);
}

export async function getIceBreakers() {
  const iceBreakers = await prisma.iceBreaker.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return iceBreakers.map((i) => i.content);
}

export async function getMaritalStatuses() {
  const statuses = await prisma.maritalStatus.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return statuses.map((s) => s.id);
}

export async function getEducations() {
  const educations = await prisma.education.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return educations.map((e) => e.id);
}

export async function getIntentions() {
  const intentions = await prisma.intention.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return intentions.map((i) => i.id);
}

export async function getProfileMetadata() {
  const [hobbies, bioTemplates, maritalStatuses, educations, intentions, jobs] = await Promise.all([
    getHobbies(),
    getBioTemplates(),
    getMaritalStatuses(),
    getEducations(),
    getIntentions(),
    getJobs(),
  ]);

  return {
    hobbies,
    bioTemplates,
    maritalStatuses,
    educations,
    intentions,
    jobs,
  };
}
