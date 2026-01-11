"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { useAppStore } from "@/context/AppStore";

export default function TermsPage() {
  const { language } = useAppStore();

  const content = {
    tr: {
      title: "Kullanım Şartları",
      lastUpdated: "Son Güncelleme: 11 Ocak 2026",
      introduction:
        "SecondSpring uygulamasını kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.",
      sections: [
        {
          title: "1. Şartların Kabulü",
          content:
            "Uygulamaya kayıt olarak bu şartları ve gizlilik politikamızı kabul etmiş olursunuz.",
        },
        {
          title: "2. Konum Servisleri",
          content:
            "Uygulama içerisinde 'Konumu Tespit Et' özelliğini kullandığınızda, tarayıcınızın sağladığı konum bilgilerinin (koordinatların) işlenmesini ve adres bilgisine dönüştürülmesini kabul edersiniz. Bu bilgiler size daha iyi hizmet sunmak ve yakın çevrenizdeki üyeleri göstermek amacıyla kullanılır.",
        },
        {
          title: "3. Kullanıcı Sorumluluğu",
          content:
            "Profilinizde sağladığınız tüm bilgilerin (ad, yaş, konum vb.) doğru ve güncel olması sizin sorumluluğunuzdadır. Yanıltıcı bilgi veren hesaplar askıya alınabilir.",
        },
        {
          title: "4. Hizmet Kesintisi",
          content:
            "OpenStreetMap gibi üçüncü taraf servislerde yaşanabilecek kesintilerden SecondSpring sorumlu tutulamaz.",
        },
      ],
    },
    en: {
      title: "Terms of Use",
      lastUpdated: "Last Updated: January 11, 2026",
      introduction: "By using the SecondSpring application, you agree to the following terms.",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content:
            "By registering for the application, you agree to these terms and our privacy policy.",
        },
        {
          title: "2. Location Services",
          content:
            "When you use the 'Detect Location' feature within the application, you consent to the processing of location information (coordinates) provided by your browser and its conversion into address information. This information is used to provide you with better service and show members in your vicinity.",
        },
        {
          title: "3. User Responsibility",
          content:
            "It is your responsibility to ensure that all information provided in your profile (name, age, location, etc.) is accurate and up-to-date. Accounts providing misleading information may be suspended.",
        },
        {
          title: "4. Service Interruption",
          content:
            "SecondSpring cannot be held responsible for interruptions that may occur in third-party services such as OpenStreetMap.",
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
