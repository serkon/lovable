"use server";

import { prisma } from "@/lib/prisma";

export async function getJobs() {
  const jobs = await prisma.job.findMany({
    orderBy: { name: "asc" },
  });
  return jobs.map((j) => j.name);
}

export async function getHobbies() {
  const hobbies = await prisma.hobby.findMany({
    orderBy: { name: "asc" },
  });
  return hobbies.map((h) => h.name);
}

export async function getBioTemplates() {
  const templates = await prisma.bioTemplate.findMany({
    orderBy: { content: "asc" },
  });
  return templates.map((t) => t.content);
}

export async function getIceBreakers() {
  const iceBreakers = await prisma.iceBreaker.findMany({
    orderBy: { content: "asc" },
  });
  return iceBreakers.map((i) => i.content);
}

export async function getMaritalStatuses() {
  const statuses = await (prisma as any).maritalStatus.findMany({
    orderBy: { name: "asc" },
  });
  return statuses.map((s: { name: string }) => s.name);
}

export async function getEducations() {
  const educations = await (prisma as any).education.findMany({
    orderBy: { name: "asc" },
  });
  return educations.map((e: { name: string }) => e.name);
}

export async function getIntentions() {
  const intentions = await (prisma as any).intention.findMany({
    orderBy: { name: "asc" },
  });
  return intentions.map((i: { name: string }) => i.name);
}
