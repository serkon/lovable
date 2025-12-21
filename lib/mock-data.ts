export type MaritalStatus = "Hiç Evlenmemiş" | "Boşanmış" | "Eşi Vefat Etmiş";
export type Education = "Lise" | "Ön Lisans" | "Lisans" | "Yüksek Lisans" | "Doktora";
export type Intention = "Ciddi İlişki" | "Arkadaşlık" | "Sohbet" | "Yol Arkadaşlığı";

export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  distance: number; // km
  job: string;
  education: Education;
  maritalStatus: MaritalStatus;
  intention: Intention;
  bio: string;
  hobbies: string[];
  imageUrl: string;
  iceBreaker: string; // New field for conversation starter
}

export const MOCK_PROFILES: Profile[] = [
  {
    id: 1,
    name: "Ayşe",
    age: 48,
    location: "İstanbul, Kadıköy",
    distance: 5,
    job: "Emekli Öğretmen",
    education: "Lisans",
    maritalStatus: "Boşanmış",
    intention: "Yol Arkadaşlığı",
    bio: "Kitap okumayı, doğa yürüyüşlerini ve kedileri severim. Samimi bir yol arkadaşı arıyorum.",
    hobbies: ["Kitap Okuma", "Doğa Yürüyüşü", "Kediler"],
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
    education: "Yüksek Lisans",
    maritalStatus: "Boşanmış",
    intention: "Ciddi İlişki",
    bio: "Klasik müzik dinlemeyi ve hafta sonları şarap tadımı yapmayı severim. Hayatı paylaşacak birini arıyorum.",
    hobbies: ["Mimari", "Klasik Müzik", "Şarap Tadımı", "Seyahat"],
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
    education: "Doktora",
    maritalStatus: "Hiç Evlenmemiş",
    intention: "Arkadaşlık",
    bio: "Deniz kenarında yürüyüş yapmaya bayılırım. Dürüstlük benim için en önemli şey.",
    hobbies: ["Yüzme", "Sinema", "Sağlıklı Yaşam"],
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
    education: "Lisans",
    maritalStatus: "Eşi Vefat Etmiş",
    intention: "Ciddi İlişki",
    bio: "Bahçe işleriyle uğraşmak beni dinlendiriyor. Huzurlu bir ikinci bahar arıyorum.",
    hobbies: ["Bahçe İşleri", "Balık Tutma", "Türk Sanat Müziği"],
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
        education: "Lisans",
        maritalStatus: "Boşanmış",
        intention: "Ciddi İlişki",
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
        education: "Lisans",
        maritalStatus: "Eşi Vefat Etmiş",
        intention: "Yol Arkadaşlığı",
        bio: "Disiplinli ama neşeli biriyim. Tarih kitapları okumayı severim.",
        hobbies: ["Tarih", "Yürüyüş"],
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
        education: "Yüksek Lisans",
        maritalStatus: "Boşanmış",
        intention: "Ciddi İlişki",
        bio: "Adaletli ve merhametli insanları severim. Tenis oynamayı öğreniyorum.",
        hobbies: ["Tenis", "Hukuk", "Seyahat"],
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=1000",
        iceBreaker: "Tenis oynamayı ne kadar süredir öğreniyorsun?"
    }
];
