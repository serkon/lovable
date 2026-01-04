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
  const [history, setHistory] = useState<{ sender: "me" | "them"; text: string; time: string }[]>([
    { sender: "them", text: "Merhaba, nasılsın?", time: "10:00" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Find profile from matches
  const profile = matches.find((p) => p.id === Number(id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!profile) {
    return (
      <div
        className="bg-background flex min-h-screen flex-col items-center justify-center space-y-4 p-8 text-center"
        data-testid="chat-not-found"
      >
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
    const timeString = `${now.getHours()}:${now.getMinutes() < 10 ? "0" : ""}${now.getMinutes()}`;

    setHistory((prev) => [...prev, { sender: "me", text: message, time: timeString }]);
    setMessage("");

    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        { sender: "them", text: "Çok memnun oldum! 😊", time: timeString },
      ]);
    }, 1500);
  };

  return (
    <div className="bg-background flex h-screen flex-col" data-testid="chat-page-container">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Link href="/matches">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-muted relative h-10 w-10 overflow-hidden rounded-full border">
              <Image src={profile.imageUrl} alt={profile.firstName} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-sm leading-none font-bold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="mt-1 text-[10px] font-medium text-green-500">Çevrimiçi</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 space-y-4 overflow-y-auto p-4" data-testid="chat-main">
        <div className="text-muted-foreground my-4 text-center text-[10px] font-bold tracking-widest uppercase">
          Bugün
        </div>

        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={cn(
                "max-w-[75%] px-4 py-2 text-sm",
                msg.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-xl rounded-tr-none"
                  : "bg-muted text-foreground rounded-xl rounded-tl-none border"
              )}
            >
              <p className="leading-relaxed">{msg.text}</p>
              <p
                className={cn(
                  "mt-1 text-right text-[9px] opacity-70",
                  msg.sender === "me" ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-background sticky bottom-0 border-t p-4" data-testid="chat-input-area">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Bir mesaj yazın..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="shrink-0" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
