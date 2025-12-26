import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JOBS = [
  { id: "job_retired_teacher", name: "Emekli Öğretmen" },
  { id: "job_engineer", name: "Mühendis" },
  { id: "job_doctor", name: "Doktor" },
  { id: "job_nurse", name: "Hemşire" },
  { id: "job_banker", name: "Bankacı" },
  { id: "job_accountant", name: "Muhasebeci" },
  { id: "job_lawyer", name: "Avukat" },
  { id: "job_architect", name: "Mimar" },
  { id: "job_retired_officer", name: "Emekli Subay" },
  { id: "job_writer", name: "Yazar" },
  { id: "job_academic", name: "Akademisyen" },
  { id: "job_pharmacist", name: "Eczacı" },
  { id: "job_tailor", name: "Terzi" },
  { id: "job_chef", name: "Aşçı" },
  { id: "job_artisan", name: "Esnaf" },
];

const HOBBIES = [
  { id: "hobby_nature", name: "Gezi, Doğa & Kamp" },
  { id: "hobby_culture", name: "Kültür, Sanat & Kitap" },
  { id: "hobby_cinema", name: "Sinema & Tiyatro" },
  { id: "hobby_music", name: "Müzik & Dans" },
  { id: "hobby_food", name: "Yemek & Gurme" },
  { id: "hobby_sport", name: "Spor, Yoga & Pilates" },
  { id: "hobby_psychology", name: "Psikoloji & Kişisel Gelişim" },
  { id: "hobby_games", name: "Tavla & Sosyal Oyunlar" },
  { id: "hobby_gardening", name: "Bahçe İşleri" },
  { id: "hobby_fishing", name: "Balık Tutma" },
  { id: "hobby_crafts", name: "El Sanatları" },
];

const BIO_TEMPLATES = [
  "Huzurlu bir hayat süren, doğa aşığı biriyim.",
  "Yeni yerler keşfetmeyi ve seyahat etmeyi seviyorum.",
  "Dürüstlük, samimiyet ve güven benim için her şeyden önce gelir.",
  "Hayatın bu döneminde gerçek bir dost ve hayat arkadaşı arıyorum.",
  "Mutfakta vakit geçirmeyi ve güzel sofralar kurmayı severim.",
  "Kitap okumak, sinemaya gitmek ve derin sohbetler etmekten keyif alırım.",
  "Aile değerlerine önem veren, sevdikleriyle vakit geçirmeyi seven biriyim.",
  "Hayata pozitif bakmayı, gülmeyi ve anı yaşamayı seviyorum.",
  "Sağlık, spor ve zinde kalmak benim için değerli.",
];

const MARITAL_STATUSES = [
  { id: "ms_single", name: "Bekar" },
  { id: "ms_divorced", name: "Boşanmış" },
  { id: "ms_private", name: "Belirtmek İstemiyorum" },
];

const EDUCATIONS = [
  { id: "edu_phd", name: "Doktora" },
  { id: "edu_masters", name: "Yüksek Lisans" },
  { id: "edu_bachelors", name: "Lisans" },
  { id: "edu_associates", name: "Önlisans" },
  { id: "edu_highschool", name: "Lise" },
  { id: "edu_middleschool", name: "Ortaokul" },
  { id: "edu_elementary", name: "İlkokul" },
];

const INTENTIONS = [
  { id: "int_chat", name: "Sohbet" },
  { id: "int_friendship", name: "Arkadaşlık" },
  { id: "int_fun", name: "Eğlence" },
];

const ICE_BREAKERS = [
  "Naber? En son okuduğun kitap neydi?",
  "Hafta sonları senin için dinlenmek mi yoksa yeni yerler keşfetmek mi demek?",
  "Güne nasıl başlamayı seversin? Kahve mi, çay mı yoksa sabah yürüyüşü mü?",
  "En sevdiğin film veya dizi hangisi?",
  "En sevdiğin yemek hangisi?",
  "Geçmişe dönebilseydin neyi farklı yapardın?",
  "En sevdiğin seyahat rotası neresi?",
  "Bahçende en çok ne yetiştirmeyi seversin?",
  "Hangi müzik türü seni dinlendirir?",
  "Çocukluğundan en sevdiğin anı nedir?",
  "Seni en çok ne güldürür?",
  "Hayatında 'iyi ki yapmışım' dediğin en büyük çılgınlık neydi?",
  "Mutfakta aran nasıldır? Spesiyal yemeğin var mı?",
];

const MOCK_USERS = [
  {
    name: "Ayşe",
    age: 48,
    city: "İstanbul, Kadıköy",
    jobId: "job_retired_teacher",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_chat",
    bio: "Kitap okumayı, doğa yürüyüşlerini ve kedileri severim. Hayatı paylaşacak samimi birini arıyorum.",
    hobbies: ["hobby_culture", "hobby_nature", "hobby_gardening"],
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2??auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    name: "Murat",
    age: 52,
    city: "İstanbul, Beşiktaş",
    jobId: "job_architect",
    educationId: "edu_masters",
    maritalStatusId: "ms_divorced",
    intentionId: "int_fun",
    bio: "Klasik müzik dinlemeyi ve yeni yerler keşfetmeyi severim. Hayatı paylaşacak dürüst birini arıyorum.",
    hobbies: ["hobby_music", "hobby_nature", "hobby_culture"],
    images: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760",
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1365",
    ],
    genderId: "gender_male",
  },
  {
    name: "Zeynep",
    age: 45,
    city: "İzmir, Karşıyaka",
    jobId: "job_doctor",
    educationId: "edu_phd",
    maritalStatusId: "ms_single",
    intentionId: "int_friendship",
    bio: "Deniz kenarında yürüyüş yapmaya bayılırım. Dürüstlük benim için en önemli şey.",
    hobbies: ["hobby_sport", "hobby_cinema", "hobby_psychology"],
    images: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    name: "Ahmet",
    age: 58,
    city: "Ankara, Çankaya",
    jobId: "job_banker",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_chat",
    bio: "Bahçe işleriyle uğraşmak beni dinlendiriyor. Huzurlu bir ikinci bahar arıyorum.",
    hobbies: ["hobby_gardening", "hobby_fishing", "hobby_music"],
    images: [
      "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://plus.unsplash.com/premium_photo-1758836220332-bf5872281aa2?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
  },
  {
    name: "Sema",
    age: 49,
    city: "İstanbul, Kadıköy",
    jobId: "job_pharmacist",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_fun",
    bio: "Sağlıklı yaşam ve yoga ile ilgileniyorum.",
    hobbies: ["hobby_sport", "hobby_food"],
    images: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    name: "Kemal",
    age: 55,
    city: "İstanbul, Üsküdar",
    jobId: "job_retired_officer",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_friendship",
    bio: "Disiplinli ama neşeli biriyim. Tarih kitapları okumayı severim.",
    hobbies: ["hobby_culture", "hobby_nature"],
    images: [
      "https://images.unsplash.com/photo-1503249023995-51b0f3778ccf?q=80&w=1260&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    genderId: "gender_male",
  },
  {
    name: "Feride",
    age: 46,
    city: "İstanbul, Bakırköy",
    jobId: "job_lawyer",
    educationId: "edu_masters",
    maritalStatusId: "ms_divorced",
    intentionId: "int_fun",
    bio: "Adaletli ve merhametli insanları severim. Aktif bir hayatım var.",
    hobbies: ["hobby_sport", "hobby_nature"],
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
];

async function main() {
  console.log("Cleaning database...");
  await prisma.like.deleteMany({});
  await prisma.userImage.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.hobby.deleteMany({});
  await prisma.bioTemplate.deleteMany({});
  await prisma.iceBreaker.deleteMany({});
  await prisma.gender.deleteMany({});
  await prisma.maritalStatus.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.intention.deleteMany({});

  console.log("Seeding genders...");
  const genderData: Array<{ id: string; name: string; sortOrder: number }> = [
    { id: "gender_female", name: "Internal: Kadın", sortOrder: 10 },
    { id: "gender_male", name: "Internal: Erkek", sortOrder: 20 },
  ];

  await prisma.gender.createMany({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: genderData as any,
  });

  console.log("Seeding jobs...");
  await prisma.job.createMany({
    data: JOBS.map((job, index) => ({
      id: job.id,
      name: `Internal: ${job.name}`,
      sortOrder: (index + 1) * 10,
    })),
  });

  console.log("Seeding hobbies...");
  await prisma.hobby.createMany({
    data: HOBBIES.map((hobby, index) => ({
      id: hobby.id,
      name: `Internal: ${hobby.name}`,
      sortOrder: (index + 1) * 10,
    })),
  });

  console.log("Seeding templates...");
  await prisma.bioTemplate.createMany({
    data: BIO_TEMPLATES.map((content, index) => ({
      id: `bio_${(index + 1).toString().padStart(2, "0")}`,
      content,
      sortOrder: (index + 1) * 10,
    })),
  });

  console.log("Seeding ice breakers...");
  await prisma.iceBreaker.createMany({
    data: ICE_BREAKERS.map((content, index) => ({
      id: `ice_${(index + 1).toString().padStart(2, "0")}`,
      content,
      sortOrder: (index + 1) * 10,
    })),
  });

  console.log("Seeding marital statuses...");
  await prisma.maritalStatus.createMany({
    data: MARITAL_STATUSES.map((item, index) => ({
      id: item.id,
      name: `Internal: ${item.name}`,
      sortOrder: (index + 1) * 10,
    })),
  });

  console.log("Seeding educations...");
  await prisma.education.createMany({
    data: EDUCATIONS.map((item, index) => ({
      id: item.id,
      name: `Internal: ${item.name}`,
      sortOrder: (index + 1) * 10,
    })),
  });

  console.log("Seeding intentions...");
  await prisma.intention.createMany({
    data: INTENTIONS.map((item, index) => ({
      id: item.id,
      name: `Internal: ${item.name}`,
      sortOrder: (index + 1) * 10,
    })),
  });

  console.log("Seeding users...");
  for (const userData of MOCK_USERS) {
    const { hobbies, images, jobId, genderId, educationId, maritalStatusId, intentionId, ...rest } =
      userData;
    await prisma.user.create({
      data: {
        ...rest,
        job: { connect: { id: jobId } },
        gender: { connect: { id: genderId } },
        education: { connect: { id: educationId } },
        maritalStatus: { connect: { id: maritalStatusId } },
        intention: { connect: { id: intentionId } },
        hobbies: {
          connect: hobbies.map((id: string) => ({ id })),
        },
        images: {
          create: images.map((url: string, index: number) => ({ url, order: index })),
        },
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
