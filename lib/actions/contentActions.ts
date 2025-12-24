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
