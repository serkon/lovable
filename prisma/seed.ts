import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JOBS = [
  // Sağlık
  { id: "job_doctor", name: "Doktor", field: "health" },
  { id: "job_dentist", name: "Diş Hekimi", field: "health" },
  { id: "job_nurse", name: "Hemşire", field: "health" },
  { id: "job_pharmacist", name: "Eczacı", field: "health" },
  { id: "job_psychologist", name: "Psikolog / Terapist", field: "health" },
  { id: "job_healthcare", name: "Sağlık Çalışanı", field: "health" },

  // Eğitim & Akademi
  { id: "job_teacher", name: "Öğretmen", field: "education" },
  { id: "job_academic", name: "Akademisyen", field: "education" },
  { id: "job_trainer", name: "Eğitmen", field: "education" },
  { id: "job_researcher", name: "Araştırmacı", field: "education" },

  // Hukuk
  { id: "job_lawyer", name: "Avukat", field: "law" },
  { id: "job_legal_consultant", name: "Hukuk Danışmanı", field: "law" },

  // Teknoloji & Mühendislik
  { id: "job_software", name: "Yazılım / Teknoloji", field: "technology" },
  { id: "job_engineer", name: "Mühendis", field: "engineering" },
  { id: "job_data", name: "Veri / Analitik Uzmanı", field: "technology" },
  { id: "job_technician", name: "Teknik Uzman", field: "engineering" },

  // Mimarlık & İnşaat
  { id: "job_architect", name: "Mimar", field: "architecture" },
  { id: "job_construction", name: "İnşaat / Yapı Uzmanı", field: "architecture" },

  // Finans & İş
  { id: "job_accountant", name: "Muhasebeci", field: "finance" },
  { id: "job_banker", name: "Bankacı", field: "finance" },
  { id: "job_finance", name: "Finans Uzmanı", field: "finance" },

  // Kurumsal & Ofis
  { id: "job_manager", name: "Yönetici", field: "corporate" },
  { id: "job_hr", name: "İK Uzmanı", field: "corporate" },
  { id: "job_project", name: "Proje Yöneticisi", field: "corporate" },
  { id: "job_office", name: "Ofis Çalışanı", field: "corporate" },

  // Kamu & Güvenlik
  { id: "job_public", name: "Kamu Görevlisi", field: "public" },
  { id: "job_security", name: "Askerî / Güvenlik", field: "public" },

  // Sanat & Medya
  { id: "job_writer", name: "Yazar", field: "art" },
  { id: "job_designer", name: "Tasarımcı", field: "art" },
  { id: "job_artist", name: "Sanatçı", field: "art" },
  { id: "job_media", name: "Medya / İçerik Üreticisi", field: "media" },

  // Hizmet & Zanaat
  { id: "job_chef", name: "Aşçı", field: "service" },
  { id: "job_tradesman", name: "Esnaf", field: "trade" },
  { id: "job_craftsman", name: "Zanaatkâr / Usta", field: "trade" },

  // Modern & Esnek Çalışma
  { id: "job_freelancer", name: "Serbest Çalışan", field: "independent" },
  { id: "job_entrepreneur", name: "Girişimci", field: "independent" },
  { id: "job_consultant", name: "Danışman", field: "independent" },

  // Diğer
  { id: "job_student", name: "Öğrenci", field: "other" },
  { id: "job_retired", name: "Emekli", field: "other" },
  { id: "job_unemployed", name: "Çalışmıyor", field: "other" },
];

const HOBBIES = [
  { id: "hobby_nature", name: "Doğa & Kamp" },
  { id: "hobby_travel", name: "Seyahat & Keşif" },
  { id: "hobby_culture", name: "Kültür & Etkinlikler" },
  { id: "hobby_music", name: "Müzik & Dans" },
  { id: "hobby_food", name: "Yeme-İçme & Gurme" },
  { id: "hobby_sport", name: "Spor & İyi Yaşam" },
  { id: "hobby_mind", name: "Psikoloji & Kişisel Gelişim" },
  { id: "hobby_games", name: "Oyun & Sosyal Oyunlar" },
  { id: "hobby_creative", name: "Üretim & El Becerileri" },
  { id: "hobby_tech", name: "Teknoloji & Dijital Üretim" },
];

const BIO_TEMPLATES = [
  // Doğa & Kamp (hobby_nature)
  {
    content:
      "Doğada vakit geçirmeyi ve uzun yürüyüşleri seviyorum, açık havada olmak beni her zaman tazeler.",
    hobbyId: "hobby_nature",
  },
  {
    content:
      "Hafta sonlarını doğayla iç içe geçirmekten ve yeni kamp yerleri keşfetmekten keyif alırım.",
    hobbyId: "hobby_nature",
  },

  // Seyahat & Keşif (hobby_travel)
  {
    content: "Yeni yerler keşfetmek ve farklı kültürleri tanımak benim için büyük bir tutku.",
    hobbyId: "hobby_travel",
  },
  {
    content: "Seyahat etmek ruhumu özgürleştiriyor, her yeni rota yeni bir hikaye demek.",
    hobbyId: "hobby_travel",
  },

  // Kültür & Etkinlikler (hobby_culture)
  {
    content:
      "Sanat etkinliklerini ve kültürel gezileri takip etmekten, yeni perspektifler kazanmaktan hoşlanırım.",
    hobbyId: "hobby_culture",
  },
  {
    content: "Müzeler, sergiler ve şehirdeki kültürel etkinlikler yaşam enerjimi besliyor.",
    hobbyId: "hobby_culture",
  },

  // Müzik & Dans (hobby_music)
  {
    content: "Müzik hayatımın her anında, farklı melodilerde kendimi bulmayı seviyorum.",
    hobbyId: "hobby_music",
  },
  {
    content: "Müziğin ritmine kapılmak ve dans etmek benim için en güzel deşarj yöntemi.",
    hobbyId: "hobby_music",
  },

  // Yeme-İçme & Gurme (hobby_food)
  {
    content: "Yeni lezzetler denemeyi ve mutfakta farklı tariflerle denemeler yapmayı seviyorum.",
    hobbyId: "hobby_food",
  },
  {
    content: "Güzel bir yemeğin ve yanındaki samimi sohbetin yerini hiçbir şey tutamaz.",
    hobbyId: "hobby_food",
  },

  // Spor & İyi Yaşam (hobby_sport)
  {
    content: "Düzenli spor yapmak ve sağlıklı yaşamak benim için bir yaşam tarzı.",
    hobbyId: "hobby_sport",
  },
  {
    content:
      "Aktif bir hayatı seviyorum, hem bedensel hem de zihinsel olarak zinde kalmaya önem veririm.",
    hobbyId: "hobby_sport",
  },

  // Psikoloji & Kişisel Gelişim (hobby_mind)
  {
    content:
      "Kişisel farkındalığımı artıracak okumalar yapmayı ve insan ruhu üzerine düşünmeyi seviyorum.",
    hobbyId: "hobby_mind",
  },
  {
    content: "Hayatı anlamlandırma çabası ve sürekli gelişim peşinde olmak beni heyecanlandırıyor.",
    hobbyId: "hobby_mind",
  },

  // Oyun & Sosyal Oyunlar (hobby_games)
  {
    content: "Arkadaşlarla bir araya gelip oyun oynamak ve o tatlı rekabeti yaşamak çok eğlenceli.",
    hobbyId: "hobby_games",
  },
  {
    content: "Strateji oyunlarını ve sosyal ortamlarda oyunlarla vakit geçirmeyi severim.",
    hobbyId: "hobby_games",
  },

  // Üretim & El Becerileri (hobby_creative)
  {
    content:
      "Kendi ellerimle bir şeyler üretmek ve yaratıcılığımı kullanmak beni çok dinlendiriyor.",
    hobbyId: "hobby_creative",
  },
  {
    content:
      "El emeğiyle ortaya çıkan her ürünün bir ruhu olduğuna inanıyorum, üretmeyi seviyorum.",
    hobbyId: "hobby_creative",
  },

  // Teknoloji & Dijital Üretim (hobby_tech)
  {
    content: "Dijital dünyadaki yenilikleri ve teknolojiyi yakından takip etmekten keyif alıyorum.",
    hobbyId: "hobby_tech",
  },
  {
    content: "Teknolojiyle üretmek ve yeni araçları hayatıma entegre etmek benim için bir hobi.",
    hobbyId: "hobby_tech",
  },
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
    firstName: "Ayşe",
    lastName: "Yılmaz",
    age: 48,
    city: "İstanbul, Kadıköy",
    jobId: "job_retired",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_chat",
    bio: "Kitap okumayı, doğa yürüyüşlerini ve kedileri severim. Hayatı paylaşacak samimi birini arıyorum.",
    hobbies: ["hobby_culture", "hobby_nature"],
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2??auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    firstName: "Murat",
    lastName: "Demir",
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
    firstName: "Zeynep",
    lastName: "Kaya",
    age: 45,
    city: "İzmir, Karşıyaka",
    jobId: "job_doctor",
    educationId: "edu_phd",
    maritalStatusId: "ms_single",
    intentionId: "int_friendship",
    bio: "Deniz kenarında yürüyüş yapmaya bayılırım. Dürüstlük benim için en önemli şey.",
    hobbies: ["hobby_sport", "hobby_culture", "hobby_mind"],
    images: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    firstName: "Ahmet",
    lastName: "Öztürk",
    age: 58,
    city: "Ankara, Çankaya",
    jobId: "job_banker",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_chat",
    bio: "Bahçe işleriyle uğraşmak beni dinlendiriyor. Huzurlu bir ikinci bahar arıyorum.",
    hobbies: ["hobby_nature", "hobby_music"],
    images: [
      "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?auto=format&fit=crop&q=80&w=800&h=1000",
      "https://plus.unsplash.com/premium_photo-1758836220332-bf5872281aa2?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
  },
  {
    firstName: "Sema",
    lastName: "Aydın",
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
    firstName: "Kemal",
    lastName: "Aras",
    age: 55,
    city: "İstanbul, Üsküdar",
    jobId: "job_retired",
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
    firstName: "Feride",
    lastName: "Bulut",
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
  {
    firstName: "Haluk",
    lastName: "Güneş",
    age: 60,
    city: "İzmir, Urla",
    jobId: "job_retired",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_chat",
    bio: "Emekliliğin tadını çıkarıyorum. Balık tutmak ve tarihi yerleri gezmek hobilerim.",
    hobbies: ["hobby_nature"],
    images: [
      "https://images.unsplash.com/photo-1767111392691-fdbb6a000bfe?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
  },
  {
    firstName: "Nurten",
    lastName: "Yıldız",
    age: 53,
    city: "Bursa, Nilüfer",
    jobId: "job_retired",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_friendship",
    bio: "Çiçeklerim ve ben çok mutluyuz ama bir hayat arkadaşı fena olmazdı.",
    hobbies: ["hobby_nature", "hobby_food"],
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    firstName: "Metin",
    lastName: "Çelik",
    age: 58,
    city: "Antalya, Konyaaltı",
    jobId: "job_chef",
    educationId: "edu_highschool",
    maritalStatusId: "ms_divorced",
    intentionId: "int_fun",
    bio: "Güzel yemekler yaparım, güzel yemekler yerim. Hayatın tadını çıkarmak lazım.",
    hobbies: ["hobby_food", "hobby_culture"],
    images: [
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
  },
  {
    firstName: "Sevil",
    lastName: "Koç",
    age: 50,
    city: "Ankara, Çankaya",
    jobId: "job_academic",
    educationId: "edu_phd",
    maritalStatusId: "ms_single",
    intentionId: "int_chat",
    bio: "Bilim ve sanat tutkunuyum. Kaliteli sohbetler arıyorum.",
    hobbies: ["hobby_culture"],
    images: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    firstName: "Orhan",
    lastName: "Şahin",
    age: 62,
    city: "Muğla, Bodrum",
    jobId: "job_tradesman",
    educationId: "edu_highschool",
    maritalStatusId: "ms_divorced",
    intentionId: "int_friendship",
    bio: "Bodrum'da sakin bir hayatım var. Denizi seven bir yol arkadaşı arıyorum.",
    hobbies: ["hobby_nature"],
    images: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
  },
  {
    firstName: "Leman",
    lastName: "Tekin",
    age: 55,
    city: "İstanbul, Sarıyer",
    jobId: "job_doctor",
    educationId: "edu_phd",
    maritalStatusId: "ms_divorced",
    intentionId: "int_chat",
    bio: "Yoğun bir meslek hayatım oldu, şimdi kendime zaman ayırıyorum. Tiyatroya gitmeyi severim.",
    hobbies: ["hobby_culture"],
    images: [
      "https://images.unsplash.com/photo-1551843073-4a9a5b6fcd5f?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    firstName: "Cemil",
    lastName: "Aksu",
    age: 59,
    city: "İzmir, Alsancak",
    jobId: "job_engineer",
    educationId: "edu_masters",
    maritalStatusId: "ms_divorced",
    intentionId: "int_friendship",
    bio: "Teknolojiye meraklıyım ama eski kafalıyım. Klasik müzik vazgeçilmezim.",
    hobbies: ["hobby_music", "hobby_tech"],
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
  },
  {
    firstName: "Nazan",
    lastName: "Yavuz",
    age: 47,
    city: "İstanbul, Beyoğlu",
    jobId: "job_writer",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_single",
    intentionId: "int_chat",
    bio: "Kelimelerin gücüne inanırım. Şiir okumayı ve yazmayı severim.",
    hobbies: ["hobby_culture"],
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    firstName: "Faruk",
    lastName: "Kurt",
    age: 56,
    city: "Bursa, Osmangazi",
    jobId: "job_banker",
    educationId: "edu_bachelors",
    maritalStatusId: "ms_divorced",
    intentionId: "int_fun",
    bio: "Emekliliğe az kaldı. Gezip görecek çok yer var.",
    hobbies: ["hobby_nature", "hobby_travel"],
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
  },
  {
    firstName: "Gülten",
    lastName: "Sönmez",
    age: 61,
    city: "Adana, Çukurova",
    jobId: "job_retired",
    educationId: "edu_associates",
    maritalStatusId: "ms_divorced",
    intentionId: "int_friendship",
    bio: "Torunlarımı severim ama kendi hayatımı da yaşamak istiyorum.",
    hobbies: ["hobby_food", "hobby_nature"],
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_female",
  },
  {
    firstName: "Rıza",
    lastName: "Pala",
    age: 65,
    city: "Trabzon, Ortahisar",
    jobId: "job_retired",
    educationId: "edu_highschool",
    maritalStatusId: "ms_divorced",
    intentionId: "int_chat",
    bio: "Karadeniz'in hırçın dalgaları gibiydim duruldum. Huzur arıyorum.",
    hobbies: ["hobby_nature"],
    images: [
      "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&q=80&w=800&h=1000",
    ],
    genderId: "gender_male",
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
      field: job.field,
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
    data: BIO_TEMPLATES.map((item, index) => ({
      id: `bio_${(index + 1).toString().padStart(2, "0")}`,
      content: item.content,
      hobbyId: item.hobbyId,
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
  let userIndex = 0;
  for (const userData of MOCK_USERS) {
    userIndex++;
    const { hobbies, images, jobId, genderId, educationId, maritalStatusId, intentionId, ...rest } =
      userData;
    await prisma.user.create({
      data: {
        ...rest,
        email: `${userData.firstName.toLowerCase()}${userIndex}@example.com`,
        password: "password123",
        phone: `05${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(7, "0")}`,
        country: "Türkiye",
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
      } as any,
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
