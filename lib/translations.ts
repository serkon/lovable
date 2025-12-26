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

    // Hobbies
    hobby_nature: "Gezi, Doğa & Kamp",
    hobby_culture: "Kültür, Sanat & Kitap",
    hobby_cinema: "Sinema & Tiyatro",
    hobby_music: "Müzik & Dans",
    hobby_food: "Yemek & Gurme",
    hobby_sport: "Spor, Yoga & Pilates",
    hobby_psychology: "Psikoloji & Kişisel Gelişim",
    hobby_games: "Tavla & Sosyal Oyunlar",
    hobby_gardening: "Bahçe İşleri",
    hobby_fishing: "Balık Tutma",
    hobby_crafts: "El Sanatları",

    // Jobs
    job_retired_teacher: "Emekli Öğretmen",
    job_engineer: "Mühendis",
    job_doctor: "Doktor",
    job_nurse: "Hemşire",
    job_banker: "Bankacı",
    job_accountant: "Muhasebeci",
    job_lawyer: "Avukat",
    job_architect: "Mimar",
    job_retired_officer: "Emekli Subay",
    job_writer: "Yazar",
    job_academic: "Akademisyen",
    job_pharmacist: "Eczacı",
    job_tailor: "Terzi",
    job_chef: "Aşçı",
    job_artisan: "Esnaf",

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
    finish: "Tamamla",
    any: "Farketmez",
    cancel: "Vazgeç",
    apply: "Uygula",
    saving: "Kaydediliyor...",
    guest: "Misafir",
    edit_profile: "Profilimi Düzenle",
    personal_info: "Kişisel Bilgiler",
    placeholder_bio: "Kendinizden bahsedin...",
    select_all: "Hepsi",
    btn_login: "Giriş Yap",
    already_member: "Zaten üye misiniz?",

    // Landing Page
    hero_title: "Hayatın İkinci Baharı Sizi Bekliyor",
    hero_subtitle:
      "Karmaşık menüler yok. Sahte profiller yok. Sadece sizin gibi samimiyet arayan gerçek insanlar.",
    cta_button: "Hemen Başlayın – Ücretsiz",
    cta_no_card: "Kredi kartı gerekmez",
    feature_real_title: "Sadece Gerçek Kişiler",
    feature_real_desc: "Her profil tek tek kontrol edilir. Robotlara ve sahte hesaplara yer yok.",
    feature_safe_title: "%100 Güvenli",
    feature_safe_desc: "Telefon numaranız asla paylaşılmaz. Güvenle mesajlaşın.",
    feature_easy_title: "Kolay Kullanım",
    feature_easy_desc:
      "Teknolojiyle aranız nasıl olursa olsun, bu uygulamayı rahatça kullanacaksınız.",

    // Onboarding
    welcome: "Hoş Geldiniz",
    start_with_gender: "Cinsiyetinizi seçerek başlayalım",
    gender_female: "Kadın",
    gender_male: "Erkek",
    introduce_yourself: "Kendinizi Tanıtın",
    how_to_address: "Size nasıl hitap etmemizi istersiniz?",
    label_name: "Adınız Soyadınız",
    placeholder_name: "Örn: Serkan Koç",
    label_age: "Yaşınız",
    placeholder_age: "Örn: 45",
    label_city: "Şehir",
    placeholder_city: "Örn: İstanbul",
    label_job: "Mesleğiniz",
    placeholder_job: "Örn: Emekli Öğretmen / Mühendis",
    btn_continue: "Devam Et",
    about_me: "Kendinizden Bahsedin",
    ready_sentences: "Hazır cümlelere tıklayarak hızlıca oluşturabilirsiniz",
    input_placeholder_bio: "Buraya yazabilir veya aşağıdan seçebilirsiniz...",
    suggested_sentences: "Önerilen Cümleler (Tıklayarak Seçin)",
    more_details: "Biraz Daha Detay",
    help_us_find: "Size en uygun kişileri bulmamıza yardımcı olun",
    select_default: "Seçiniz",
    min_hobbies_req: "Ortak noktalarınızı keşfetmek için en az {min} hobi seçin",
    btn_looks_great: "Harika Görünüyor!",
    profile_ready: "Profiliniz Hazır!",
    best_candidates: "Sizin için en iyi adayları hazırladık.",
    no_bio_yet: "Henüz bir biyografi yazılmadı...",
    start_meeting: "Hemen Tanışmaya Başla!",
    step_count: "Adım {step} / 7",
    auth_title: "Hesabınızı Güvenceye Alın",
    auth_desc:
      "Profilleri kaybetmemek ve istediğiniz zaman giriş yapmak için bir şifre belirleyin.",
    label_country: "Ülke",
    label_email: "E-posta Adresi",
    label_password: "Şifre",
    btn_complete_auth: "Kaydı Tamamla ve Başla",
    btn_skip_auth: "Şimdilik Atla (Misafir Olarak Devam Et)",
    placeholder_email: "ornek@email.com",
    placeholder_password: "••••••••",

    // Dashboard
    app_name: "İkinci Bahar",
    ghost_mode: "Gizli",
    tooltip_ghost_mode: "Gizli Mod",
    tooltip_filters: "Filtreler",
    tooltip_sent_requests: "Gönderilen İstekler",
    tooltip_matches: "Sohbet ve Eşleşmeler",
    tooltip_likes: "Beğeniler",
    tooltip_language: "Dili Değiştir / Change Language",
    tooltip_profile: "Profilim",
    no_candidates_title: "Kriterlerinize uygun aday kalmadı.",
    no_candidates_subtitle:
      "Filtreleri genişleterek veya listeyi başa sararak tekrar inceleyebilirsiniz.",
    btn_change_filters: "Filtreleri Değiştir",
    btn_reset_list: "Listeyi Başa Sar",
    match_success_title: "Harika!",
    match_success_subtitle: "{name} ile tanışma isteğiniz iletildi.",
    sent_question: "Gönderilen Soru",
    share_success: "Profil bağlantısı kopyalandı!",
    like: "Beğen",
    share: "Paylaş",
    pass: "Pas Geç",

    // Matches
    my_matches: "Eşleşmelerim",
    no_matches: "Henüz eşleşmeniz yok.",
    keep_liking: "Beğenmeye devam edin!",

    // Sent Requests
    sent_requests: "Gönderilen İstekler",
    no_sent_requests: "Henüz istek göndermediniz.",
    first_step_desc: "Beğendiğiniz kişilere 'Tanışmak İsterim' diyerek ilk adımı atın.",
    start_exploring: "Keşfetmeye Başla",
    waiting_reply: "Yanıt Bekleniyor",
    cancel_request: "İsteği Geri Çek",

    // Likes
    likes_title: "Sizi Beğenenler",
    likes_subtitle: "Bu kişiler sizinle tanışmak istiyor. Onaylarsanız sohbet başlayacak.",
    no_new_likes: "Şu an yeni beğeni yok.",
    btn_pass: "Pas Geç",
    btn_meet: "Tanış",

    // Modals
    filter: "Filtrele",
    age_range: "Yaş Aralığı",
    icebreaker_title: "Buzları Kıralım!",
    icebreaker_subtitle: "{name} ile harika bir sohbet başlatmak için bir soru seçin.",
    intro_questions: "Tanışma Soruları",
    send_with_question: "Soruyla Birlikte Gönder",

    // Notifications/Alerts
    profile_updated: "Profiliniz başarıyla güncellendi!",
    error_generic: "Bir hata oluştu.",
    min_hobbies_error: "En az {min} hobi seçmelisiniz.",
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

    // Hobbies
    hobby_nature: "Travel, Nature & Camping",
    hobby_culture: "Culture, Art & Books",
    hobby_cinema: "Cinema & Theater",
    hobby_music: "Music & Dance",
    hobby_food: "Food & Gourmet",
    hobby_sport: "Sports, Yoga & Pilates",
    hobby_psychology: "Psychology & Personal Development",
    hobby_games: "Backgammon & Social Games",
    hobby_gardening: "Gardening",
    hobby_fishing: "Fishing",
    hobby_crafts: "Handicrafts",

    // Jobs
    job_retired_teacher: "Retired Teacher",
    job_engineer: "Engineer",
    job_doctor: "Doctor",
    job_nurse: "Nurse",
    job_banker: "Banker",
    job_accountant: "Accountant",
    job_lawyer: "Lawyer",
    job_architect: "Architect",
    job_retired_officer: "Retired Officer",
    job_writer: "Writer",
    job_academic: "Academic",
    job_pharmacist: "Pharmacist",
    job_tailor: "Tailor",
    job_chef: "Chef",
    job_artisan: "Artisan",

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
    btn_login: "Log In",
    already_member: "Already a member?",
    bio: "Bio",
    hobbies: "Hobbies",
    save: "Save",
    back: "Back",
    next: "Next",
    finish: "Finish",
    any: "Any",
    cancel: "Cancel",
    apply: "Apply",
    saving: "Saving...",
    guest: "Guest",
    edit_profile: "Edit My Profile",
    personal_info: "Personal Information",
    placeholder_bio: "Tell us about yourself...",
    select_all: "All",

    // Landing Page
    hero_title: "The Second Spring of Life Awaits You",
    hero_subtitle:
      "No complex menus. No fake profiles. Just real people looking for sincerity like you.",
    cta_button: "Get Started Now – Free",
    cta_no_card: "No credit card required",
    feature_real_title: "Real People Only",
    feature_real_desc:
      "Every profile is checked individually. No room for robots or fake accounts.",
    feature_safe_title: "100% Secure",
    feature_safe_desc: "Your phone number is never shared. Message with confidence.",
    feature_easy_title: "Easy to Use",
    feature_easy_desc:
      "No matter your relationship with technology, you will use this app comfortably.",

    // Onboarding
    welcome: "Welcome",
    start_with_gender: "Let's start by choosing your gender",
    gender_female: "Female",
    gender_male: "Male",
    introduce_yourself: "Introduce Yourself",
    how_to_address: "How would you like us to address you?",
    label_name: "Your Full Name",
    placeholder_name: "e.g. Serkan Koç",
    label_age: "Your Age",
    placeholder_age: "e.g. 45",
    label_city: "City",
    placeholder_city: "e.g. Istanbul",
    label_job: "Your Profession",
    placeholder_job: "e.g. Retired Teacher / Engineer",
    btn_continue: "Continue",
    about_me: "About Me",
    ready_sentences: "You can quickly create it by clicking on ready sentences",
    input_placeholder_bio: "You can write here or choose from below...",
    suggested_sentences: "Suggested Sentences (Click to Select)",
    more_details: "A Little More Detail",
    help_us_find: "Help us find the most suitable people for you",
    select_default: "Select",
    min_hobbies_req: "Select at least {min} hobbies to discover common ground",
    btn_looks_great: "Looks Great!",
    profile_ready: "Your Profile is Ready!",
    best_candidates: "We have prepared the best candidates for you.",
    no_bio_yet: "No bio written yet...",
    start_meeting: "Start Meeting Now!",
    step_count: "Step {step} / 7",
    auth_title: "Secure Your Account",
    auth_desc: "Set a password to avoid losing profiles and to log in anytime.",
    label_country: "Country",
    label_email: "Email Address",
    label_password: "Password",
    btn_complete_auth: "Complete Registration & Start",
    btn_skip_auth: "Skip for Now (Continue as Guest)",
    placeholder_email: "example@email.com",
    placeholder_password: "••••••••",

    // Dashboard
    app_name: "İkinci Bahar",
    ghost_mode: "Ghost",
    tooltip_ghost_mode: "Ghost Mode",
    tooltip_filters: "Filters",
    tooltip_sent_requests: "Sent Requests",
    tooltip_matches: "Chat and Matches",
    tooltip_likes: "Likes",
    tooltip_language: "Change Language / Dili Değiştir",
    tooltip_profile: "My Profile",
    no_candidates_title: "No candidates matching your criteria.",
    no_candidates_subtitle: "You can review by expanding filters or restarting the list.",
    btn_change_filters: "Change Filters",
    btn_reset_list: "Restart List",
    match_success_title: "Great!",
    match_success_subtitle: "Your request to meet {name} has been sent.",
    sent_question: "Sent Question",
    share_success: "Profile link copied!",
    like: "Like",
    share: "Share",
    pass: "Pass",

    // Matches
    my_matches: "My Matches",
    no_matches: "No matches yet.",
    keep_liking: "Keep liking profiles!",

    // Sent Requests
    sent_requests: "Sent Requests",
    no_sent_requests: "You haven't sent any requests yet.",
    first_step_desc: "Take the first step by saying 'I want to meet' to people you like.",
    start_exploring: "Start Exploring",
    waiting_reply: "Waiting for Reply",
    cancel_request: "Cancel Request",

    // Likes
    likes_title: "People Who Like You",
    likes_subtitle: "These people want to meet you. If you approve, the chat will begin.",
    no_new_likes: "No new likes at the moment.",
    btn_pass: "Pass",
    btn_meet: "Meet",

    // Modals
    filter: "Filter",
    age_range: "Age Range",
    icebreaker_title: "Let's Break the Ice!",
    icebreaker_subtitle: "Choose a question to start a great conversation with {name}.",
    intro_questions: "Ice Breaker Questions",
    send_with_question: "Send with Question",

    // Notifications/Alerts
    profile_updated: "Profile updated successfully!",
    error_generic: "An error occurred.",
    min_hobbies_error: "You must select at least {min} hobbies.",
  },
};

export type TranslationKey = keyof typeof translations.tr;

export function getLabel(
  key: string,
  lang: Language = "tr",
  params?: Record<string, string | number>
): string {
  const dict = translations[lang] as Record<string, string>;
  let text = dict[key] || key;

  if (params) {
    Object.keys(params).forEach((p) => {
      text = text.replace(`{${p}}`, String(params[p]));
    });
  }

  return text;
}
