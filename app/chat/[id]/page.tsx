"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Phone, Video } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { id } = useParams();
  const { matches } = useAppStore();
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{ sender: 'me' | 'them', text: string, time: string }[]>([
    { sender: 'them', text: "Merhaba, nasılsın?", time: "10:00" }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Find profile from matches
  const profile = matches.find(p => p.id === Number(id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <h2 className="text-xl font-bold">Profil Bulunamadı</h2>
        <p className="text-muted-foreground">Profil bulunamadı veya henüz eşleşmediniz.</p>
        <Link href="/matches">
          <Button variant="outline">Eşleşmelerime Dön</Button>
        </Link>
      </div>
    );
  }

  const handleSend = () => {
    if (!message.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

    setHistory(prev => [...prev, { sender: 'me', text: message, time: timeString }]);
    setMessage("");

    setTimeout(() => {
      setHistory(prev => [...prev, { sender: 'them', text: "Çok memnun oldum! 😊", time: timeString }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* Header */}
      <header className="bg-background h-16 border-b flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/matches">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted border">
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-none">{profile.name}</h3>
              <p className="text-[10px] text-green-500 font-medium mt-1">Çevrimiçi</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-[10px] text-muted-foreground my-4 font-bold uppercase tracking-widest">Bugün</div>

        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={cn(
                "max-w-[75%] px-4 py-2 text-sm",
                msg.sender === 'me'
                  ? 'bg-primary text-primary-foreground rounded-xl rounded-tr-none'
                  : 'bg-muted text-foreground rounded-xl rounded-tl-none border'
              )}
            >
              <p className="leading-relaxed">{msg.text}</p>
              <p className={cn(
                "text-[9px] mt-1 text-right opacity-70",
                msg.sender === 'me' ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-background p-4 border-t sticky bottom-0">
        <div className="flex gap-2 items-center max-w-4xl mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Bir mesaj yazın..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="shrink-0"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
