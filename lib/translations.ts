type Language = "tr" | "en";

export const translations = {
  tr: {
    // Marital Statuses
    ms_single: "Bekar",
    ms_divorced: "Boşanmış",
    ms_private: "Şimdilik Bana Kalsın",
    
    // Education Levels
    edu_phd: "Doktora",
    edu_masters: "Yüksek Lisans",
    edu_bachelors: "Lisans",
    edu_associates: "Ön Lisans",
    edu_highschool: "Lise",
    edu_middleschool: "Ortaokul",
    edu_elementary: "İlkokul",
    
    // Intentions
    int_chat: "Sohbet",
    int_friendship: "Arkadaşlık",
    int_fun: "Eğlenceli Vakit Geçirmek",

    // UI General
    age: "Yaş",
    location: "Konum",
    distance: "Mesafe",
    job: "Meslek",
    education: "Eğitim",
    maritalStatus: "Medeni Durum",
    intention: "Tanışma Amacı",
    bio: "Hakkımda",
    hobbies: "İlgi Alanları",
    save: "Kaydet",
    back: "Geri",
    next: "Devam",
    finish: "Tamamla"
  },
  en: {
    // Marital Statuses
    ms_single: "Single",
    ms_divorced: "Divorced",
    ms_private: "Keep it Private for Now",
    
    // Education Levels
    edu_phd: "PhD",
    edu_masters: "Master's Degree",
    edu_bachelors: "Bachelor's Degree",
    edu_associates: "Associate Degree",
    edu_highschool: "High School",
    edu_middleschool: "Middle School",
    edu_elementary: "Elementary School",
    
    // Intentions
    int_chat: "Chat",
    int_friendship: "Friendship",
    int_fun: "Have Fun",

    // UI General
    age: "Age",
    location: "Location",
    distance: "Distance",
    job: "Job",
    education: "Education",
    maritalStatus: "Marital Status",
    intention: "Intention",
    bio: "Bio",
    hobbies: "Hobbies",
    save: "Save",
    back: "Back",
    next: "Next",
    finish: "Finish"
  }
};

export type TranslationKey = keyof typeof translations.tr;

export function getLabel(key: string, lang: Language = "tr"): string {
  const dict = translations[lang];
  return (dict as any)[key] || key;
}
