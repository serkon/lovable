"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { useAppStore } from "@/context/AppStore";

export default function PrivacyPage() {
  const { language } = useAppStore();

  const content = {
    tr: {
      title: "Gizlilik Politikası",
      lastUpdated: "Son Güncelleme: 11 Ocak 2026",
      introduction:
        "SecondSpring olarak gizliliğinize önem veriyoruz. Bu politika, hangi verileri topladığımızı ve bunları nasıl kullandığımızı açıklar.",
      sections: [
        {
          title: "1. Toplanan Veriler",
          content:
            "Hesap oluştururken adınız, yaşınız, cinsiyetiniz, mesleğiniz ve iletişim bilgileriniz (e-posta, telefon) gibi kişisel bilgileri toplarız.",
        },
        {
          title: "2. Konum Bilgileri",
          content:
            "Size en uygun adayları bulabilmek için şehir ve ilçe bilgilerinizi kullanırız. Konumunuzu daha rahat seçebilmeniz için tarayıcı tabanlı konum belirleme (Geolocation) hizmetini kullanabiliriz. Bu işlem sırasında koordinatlarınız, OpenStreetMap (Nominatim) servisleri aracılığıyla adres bilgisine dönüştürülür. Tam koordinatlarınız sunucularımızda saklanmaz, sadece seçilen ilçe ve şehir bilgisi profilinize kaydedilir.",
        },
        {
          title: "3. Veri Güvenliği",
          content:
            "Verileriniz en süt düzey güvenlik standartları ile korunur. Telefon numaranız ve e-posta adresiniz asla diğer üyelerle paylaşılmaz.",
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: January 11, 2026",
      introduction:
        "At SecondSpring, we value your privacy. This policy explains what data we collect and how we use it.",
      sections: [
        {
          title: "1. Data Collection",
          content:
            "We collect personal information such as your name, age, gender, occupation, and contact details (email, phone) when you create an account.",
        },
        {
          title: "2. Location Information",
          content:
            "We use your city and district information to find the best matches for you. To help you set your location more easily, we may use browser-based geolocation services. During this process, your coordinates are converted into address information through OpenStreetMap (Nominatim) services. Your exact coordinates are not stored on our servers; only the selected district and city information is saved to your profile.",
        },
        {
          title: "3. Data Security",
          content:
            "Your data is protected with the highest security standards. Your phone number and email address are never shared with other members.",
        },
      ],
    },
  };

  const activeContent = content[language];

  return (
    <div className="bg-background min-h-screen">
      <Header variant="simple" />
      <main className="container mx-auto max-w-4xl px-4 py-20">
        <h1 className="mb-2 text-4xl font-bold">{activeContent.title}</h1>
        <p className="text-muted-foreground mb-8">{activeContent.lastUpdated}</p>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
          <p className="text-lg leading-relaxed">{activeContent.introduction}</p>

          {activeContent.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="border-b pb-2 text-2xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
