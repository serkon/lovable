export type MaritalStatusId = "ms_single" | "ms_divorced" | "ms_private";
export const MARITAL_STATUSES: MaritalStatusId[] = ["ms_single", "ms_divorced", "ms_private"];

export type EducationId = "edu_phd" | "edu_masters" | "edu_bachelors" | "edu_associates" | "edu_highschool" | "edu_middleschool" | "edu_elementary";
export const EDUCATIONS: EducationId[] = ["edu_phd", "edu_masters", "edu_bachelors", "edu_associates", "edu_highschool", "edu_middleschool", "edu_elementary"];

export type IntentionId = "int_chat" | "int_friendship" | "int_fun";
export const INTENTIONS: IntentionId[] = ["int_chat", "int_friendship", "int_fun"];

export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  distance: number;
  job: string;
  education: EducationId;
  maritalStatus: MaritalStatusId;
  intention: IntentionId;
  bio: string;
  hobbies: string[];
  imageUrl: string;
  iceBreaker: string; // New field for conversation starter
}

export const ICE_BREAKER_QUESTIONS = [
  "Naber? En son okuduğun kitap neydi?",
  "Hafta sonları senin için dinlenmek mi yoksa yeni yerler keşfetmek mi demek?",
  "Eğer şu an bir uçak biletin olsaydı, rotan neresi olurdu?",
  "Seni en çok ne güldürür?",
  "Hayatında 'iyi ki yapmışım' dediğin en büyük çılgınlık neydi?",
  "Güne nasıl başlamayı seversin? Kahve mi yoksa sabah yürüyüşü mü?",
  "En sevdiğin film veya dizi hangisi?",
  "Mutfakta aran nasıldır? Spesiyal yemeğin var mı?"
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 1,
    name: "Ayşe",
    age: 48,
    location: "İstanbul, Kadıköy",
    distance: 5,
    job: "Emekli Öğretmen",
    education: "edu_bachelors",
    maritalStatus: "ms_divorced",
    intention: "int_chat",
    bio: "Kitap okumayı, doğa yürüyüşlerini ve kedileri severim. Hayatı paylaşacak samimi birini arıyorum.",
    hobbies: ["Kültür, Sanat & Kitap", "Gezi, Doğa & Kamp", "Bahçe İşleri"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800&h=1000",
    iceBreaker: "En son okuduğun ve seni çok etkileyen kitap hangisiydi?"
  },
  {
    id: 2,
    name: "Murat",
    age: 52,
    location: "İstanbul, Beşiktaş",
    distance: 12,
    job: "Mimar",
    education: "edu_masters",
    maritalStatus: "ms_divorced",
    intention: "int_fun",
    bio: "Klasik müzik dinlemeyi ve yeni yerler keşfetmeyi severim. Hayatı paylaşacak dürüst birini arıyorum.",
    hobbies: ["Müzik & Dans", "Gezi, Doğa & Kamp", "Kültür, Sanat & Kitap"],
    imageUrl: "https://images.unsplash.com/photo-1542596768-5d1d21f1cfb6?auto=format&fit=crop&q=80&w=800&h=1000",
    iceBreaker: "En sevdiğin seyahat rotası neresi?"
  },
  {
    id: 3,
    name: "Zeynep",
    age: 45,
    location: "İzmir, Karşıyaka",
    distance: 350,
    job: "Doktor",
    education: "edu_phd",
    maritalStatus: "ms_single",
    intention: "int_friendship",
    bio: "Deniz kenarında yürüyüş yapmaya bayılırım. Dürüstlük benim için en önemli şey.",
    hobbies: ["Spor, Yoga & Pilates", "Sinema & Tiyatro", "Psikoloji & Kişisel Gelişim"],
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800&h=1000",
    iceBreaker: "Hafta sonları senin için dinlenmek mi yoksa gezmek mi demek?"
  },
  {
    id: 4,
    name: "Ahmet",
    age: 58,
    location: "Ankara, Çankaya",
    distance: 450,
    job: "Emekli Bankacı",
    education: "edu_bachelors",
    maritalStatus: "ms_divorced",
    intention: "int_chat",
    bio: "Bahçe işleriyle uğraşmak beni dinlendiriyor. Huzurlu bir ikinci bahar arıyorum.",
    hobbies: ["Bahçe İşleri", "Balık Tutma", "Müzik & Dans"],
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800&h=1000",
    iceBreaker: "Bahçende en çok ne yetiştirmeyi seversin?"
  }
];

export const MOCK_LIKED_BY_PROFILES: Profile[] = [
    {
        id: 5,
        name: "Sema",
        age: 49,
        location: "İstanbul, Kadıköy",
        distance: 3,
        job: "Eczacı",
        education: "edu_bachelors",
        maritalStatus: "ms_divorced",
        intention: "int_fun",
        bio: "Sağlıklı yaşam ve yoga ile ilgileniyorum.",
        hobbies: ["Yoga", "Sağlıklı Beslenme"],
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=1000",
        iceBreaker: "Yoga yapıyor musun?"
    },
    {
        id: 6,
        name: "Kemal",
        age: 55,
        location: "İstanbul, Üsküdar",
        distance: 8,
        job: "Emekli Subay",
        education: "edu_bachelors",
        maritalStatus: "ms_divorced",
        intention: "int_friendship",
        bio: "Disiplinli ama neşeli biriyim. Tarih kitapları okumayı severim.",
        hobbies: ["Kültür, Sanat & Kitap", "Gezi, Doğa & Kamp"],
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800&h=1000", // Reusing image for demo
        iceBreaker: "En son hangi tarih kitabını okudun?"
    }
];

export const MOCK_MATCHES: Profile[] = [
    {
        id: 7,
        name: "Feride",
        age: 46,
        location: "İstanbul, Bakırköy",
        distance: 10,
        job: "Avukat",
        education: "edu_masters",
        maritalStatus: "ms_divorced",
        intention: "int_fun",
        bio: "Adaletli ve merhametli insanları severim. Aktif bir hayatım var.",
        hobbies: ["Spor, Yoga & Pilates", "Gezi, Doğa & Kamp"],
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=1000",
        iceBreaker: "Spor yapmayı sever misin?"
    }
];
