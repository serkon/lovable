"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Clock, MapPin, Briefcase } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import Link from "next/link";

export default function SentRequestsPage() {
  const { sentRequests, cancelRequest } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 px-6 sticky top-0 z-10">
        <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-6 h-6 text-purple-700" />
            </Button>
        </Link>
        <Typography variant="h3" className="text-purple-700">
            Gönderilen İstekler
        </Typography>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4">
        
        {sentRequests.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-purple-400" />
                </div>
                <Typography variant="h3" className="text-gray-700 mb-2">Henüz istek göndermediniz.</Typography>
                <p className="text-sm">Beğendiğiniz kişilere "Tanışmak İsterim" diyerek ilk adımı atın.</p>
                <Link href="/dashboard" className="mt-6 inline-block">
                    <Button>Keşfetmeye Başla</Button>
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sentRequests.map((profile) => (
                    <Card data-testid={`sent-request-card-${profile.id}`} key={profile.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-200">
                            <img 
                                src={profile.imageUrl} 
                                alt={profile.name}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-white/90 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Yanıt Bekleniyor
                                </span>
                            </div>
                        </div>
                        <div className="p-4 bg-white flex flex-col justify-between flex-1">
                             <div>
                                <Typography variant="h3" className="text-lg">
                                    {profile.name}, {profile.age}
                                </Typography>
                                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {profile.location.split(',')[0]}
                                </div>
                                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    {profile.job}
                                </div>
                             </div>
                             
                             <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => cancelRequest(profile.id)}
                                className="mt-4 w-full text-red-500 border-red-100 hover:bg-red-50 hover:text-red-700 h-9 text-xs"
                             >
                                İsteği Geri Çek
                             </Button>
                        </div>
                    </Card>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
