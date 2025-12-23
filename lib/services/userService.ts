import {
  Profile,
  EducationId,
  MaritalStatusId,
  IntentionId,
  EDUCATIONS,
  MARITAL_STATUSES,
  INTENTIONS,
} from "@/lib/mock-data";

// Enrichment Data - Turkish Context
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

const HOBBIES_LIST = [
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

const BIOS = [
  "Hayatın tadını çıkarmayı seven, dürüst ve samimi biriyim.",
  "İkinci baharımı huzur ve güven içinde geçirmek istiyorum.",
  "Doğayı, gezmeyi ve yeni insanlar tanımayı severim.",
  "Samimi bir sohbet and gerçek bir dostluk arıyorum.",
  "Eskilerin dediği gibi, gönül kimi severse güzel odur.",
  "Hayatı paylaşmak, birlikte gülmek ve anı yaşamak kıymetli.",
  "Müzik, kültür ve kaliteli sosyal ortamlardan keyif alırım.",
  "Dürüstlük ve saygı benim için en önemli değerlerdir.",
  "Hayat kısa, anın tadını çıkarmak lazım.",
  "Seviyeli ve güvenilir bir arkadaşlık arıyorum.",
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

const EDU_OPTIONS: EducationId[] = [...EDUCATIONS];
const MARITAL_OPTIONS: MaritalStatusId[] = [...MARITAL_STATUSES];
const INTENTION_OPTIONS: IntentionId[] = [...INTENTIONS];

// Helper to pick random item
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickMultiple = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface RandomUser {
  name: { first: string };
  location: { city: string };
  dob: { age: number };
  picture: { large: string };
}

export const fetchProfilesFromAPI = async (count: number = 20): Promise<Profile[]> => {
  try {
    const res = await fetch(
      `https://randomuser.me/api/?results=${count}&nat=tr&inc=name,location,dob,picture,login`
    );
    const data = await res.json();

    return data.results.map((user: RandomUser, index: number) => {
      // Map API data to our Schema
      const city = user.location.city;
      // Capitalize city
      const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);

      return {
        id: index + 100, // Offset IDs to not clash with static mocks initially (optional)
        name: user.name.first,
        age: user.dob.age, // randomuser usually gives realistic ages
        location: `İstanbul, ${formattedCity}`, // Force Istanbul for proximity or keep real city? Let's use formattedCity if it looks real, else fallback. Randomuser TR cities are real. Let's just use city.
        // Actually randomuser cities for TR are often real districts or cities. Let's use "Şehir, İlçe" format fake style or just City.
        // Let's stick to "İstanbul, [District]" simulation for MVP density.
        // We will randomly pick a distract from Istanbul for realism since our user base is likely dense there.
        // Or just use the API city. API cities are "Adana", "Ankara" etc.
        // User wants proximity. Let's cheat a bit and say they are mostly nearby for this demo.
        distance: Math.floor(Math.random() * 50) + 1,
        job: pick(JOBS),
        education: pick(EDU_OPTIONS),
        maritalStatus: pick(MARITAL_OPTIONS),
        intention: pick(INTENTION_OPTIONS),
        bio: pick(BIOS),
        hobbies: pickMultiple(HOBBIES_LIST, 3),
        imageUrl: user.picture.large,
        iceBreaker: pick(ICE_BREAKERS),
      };
    });
  } catch (error) {
    console.error("Failed to fetch profiles:", error);
    return [];
  }
};
