import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JOBS = [
  "Emekli Öğretmen",
  "Mühendis",
  "Doktor",
  "Hemşire",
  "Bankacı",
  "Muhasebeci",
  "Avukat",
  "Mimar",
  "Emekli Subay",
  "Yazar",
  "Akademisyen",
  "Eczacı",
  "Terzi",
  "Aşçı",
  "Esnaf",
];

const HOBBIES = [
  "Gezi, Doğa & Kamp",
  "Kültür, Sanat & Kitap",
  "Sinema & Tiyatro",
  "Müzik & Dans",
  "Yemek & Gurme",
  "Spor, Yoga & Pilates",
  "Psikoloji & Kişisel Gelişim",
  "Tavla & Sosyal Oyunlar",
  "Bahçe İşleri",
  "Balık Tutma",
  "El Sanatları",
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
  "Sağlık, spor and zinde kalmak benim için değerli.",
];

const ICE_BREAKERS = [
  "En son okuduğun kitap hangisiydi?",
  "Hafta sonları senin için dinlenmek mi yoksa gezmek mi demek?",
  "Çay mı kahve mi? Ben çaycıyım :)",
  "Emeklilik hayalin nedir?",
  "En sevdiğin yemek hangisi?",
  "Geçmişe dönebilseydin neyi farklı yapardın?",
  "En sevdiğin seyahat rotası neresi?",
  "Bahçende en çok ne yetiştirmeyi seversin?",
  "Hangi müzik türü seni dinlendirir?",
  "Çocukluğundan en sevdiğin anı nedir?",
];

const MOCK_USERS = [
  {
    name: "Ayşe",
    age: 48,
    city: "İstanbul, Kadıköy",
    job: "Emekli Öğretmen",
    education: "edu_bachelors",
    maritalStatus: "ms_divorced",
    intention: "int_chat",
    bio: "Kitap okumayı, doğa yürüyüşlerini ve kedileri severim. Hayatı paylaşacak samimi birini arıyorum.",
    hobbies: ["Kültür, Sanat & Kitap", "Gezi, Doğa & Kamp", "Bahçe İşleri"],
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800&h=1000",
    gender: "Kadın",
  },
  {
    name: "Murat",
    age: 52,
    city: "İstanbul, Beşiktaş",
    job: "Mimar",
    education: "edu_masters",
    maritalStatus: "ms_divorced",
    intention: "int_fun",
    bio: "Klasik müzik dinlemeyi ve yeni yerler keşfetmeyi severim. Hayatı paylaşacak dürüst birini arıyorum.",
    hobbies: ["Müzik & Dans", "Gezi, Doğa & Kamp", "Kültür, Sanat & Kitap"],
    imageUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800&h=1000",
    gender: "Erkek",
  },
  {
    name: "Zeynep",
    age: 45,
    city: "İzmir, Karşıyaka",
    job: "Doktor",
    education: "edu_phd",
    maritalStatus: "ms_single",
    intention: "int_friendship",
    bio: "Deniz kenarında yürüyüş yapmaya bayılırım. Dürüstlük benim için en önemli şey.",
    hobbies: ["Spor, Yoga & Pilates", "Sinema & Tiyatro", "Psikoloji & Kişisel Gelişim"],
    imageUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=1000",
    gender: "Kadın",
  },
  {
    name: "Ahmet",
    age: 58,
    city: "Ankara, Çankaya",
    job: "Emekli Bankacı",
    education: "edu_bachelors",
    maritalStatus: "ms_divorced",
    intention: "int_chat",
    bio: "Bahçe işleriyle uğraşmak beni dinlendiriyor. Huzurlu bir ikinci bahar arıyorum.",
    hobbies: ["Bahçe İşleri", "Balık Tutma", "Müzik & Dans"],
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800&h=1000",
    gender: "Erkek",
  },
  {
    name: "Sema",
    age: 49,
    city: "İstanbul, Kadıköy",
    job: "Eczacı",
    education: "edu_bachelors",
    maritalStatus: "ms_divorced",
    intention: "int_fun",
    bio: "Sağlıklı yaşam ve yoga ile ilgileniyorum.",
    hobbies: ["Yoga", "Sağlıklı Beslenme"],
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=1000",
    gender: "Kadın",
  },
  {
    name: "Kemal",
    age: 55,
    city: "İstanbul, Üsküdar",
    job: "Emekli Subay",
    education: "edu_bachelors",
    maritalStatus: "ms_divorced",
    intention: "int_friendship",
    bio: "Disiplinli ama neşeli biriyim. Tarih kitapları okumayı severim.",
    hobbies: ["Kültür, Sanat & Kitap", "Gezi, Doğa & Kamp"],
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800&h=1000",
    gender: "Erkek",
  },
  {
    name: "Feride",
    age: 46,
    city: "İstanbul, Bakırköy",
    job: "Avukat",
    education: "edu_masters",
    maritalStatus: "ms_divorced",
    intention: "int_fun",
    bio: "Adaletli ve merhametli insanları severim. Aktif bir hayatım var.",
    hobbies: ["Spor, Yoga & Pilates", "Gezi, Doğa & Kamp"],
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=1000",
    gender: "Kadın",
  },
];

async function main() {
  console.log("Seeding content...");

  // Seed Jobs
  for (const name of JOBS) {
    await prisma.job.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Seed Hobbies
  for (const name of HOBBIES) {
    await prisma.hobby.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Seed Bio Templates
  for (const content of BIO_TEMPLATES) {
    await prisma.bioTemplate.upsert({
      where: { content },
      update: {},
      create: { content },
    });
  }

  // Seed Ice Breakers
  for (const content of ICE_BREAKERS) {
    await prisma.iceBreaker.upsert({
      where: { content },
      update: {},
      create: { content },
    });
  }

  // Seed Users
  console.log("Seeding users...");
  for (const user of MOCK_USERS) {
    const existing = await prisma.user.findFirst({
      where: { name: user.name },
    });

    if (!existing) {
      // Prepare hobbies connect array
      const hobbyConnect = user.hobbies.map((h) => ({
        where: { name: h },
        create: { name: h },
      }));

      await prisma.user.create({
        data: {
          name: user.name,
          age: user.age,
          city: user.city,

          // Job Relation
          job: {
            connectOrCreate: {
              where: { name: user.job },
              create: { name: user.job },
            },
          },

          // Gender Relation
          gender: {
            connectOrCreate: {
              where: { name: user.gender },
              create: { name: user.gender },
            },
          },

          education: user.education,
          maritalStatus: user.maritalStatus,
          intention: user.intention,
          bio: user.bio,
          imageUrl: user.imageUrl,

          // Hobbies Relation - Many to Many
          hobbies: {
            connectOrCreate: hobbyConnect,
          },
        },
      });
    }
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
