"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { matches } = useAppStore();
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{sender: 'me' | 'them', text: string, time: string}[]>([
    { sender: 'them', text: "Merhaba, nasılsın?", time: "10:00" }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Find profile from matches
  const profile = matches.find(p => p.id === Number(id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!profile) {
    return <div className="p-8 text-center">Profil bulunamadı veya henüz eşleşmediniz.</div>;
  }

  const handleSend = () => {
    if(!message.trim()) return;

    // Add my message
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
    
    setHistory(prev => [...prev, { sender: 'me', text: message, time: timeString }]);
    setMessage("");

    // Simulate reply
    setTimeout(() => {
         setHistory(prev => [...prev, { sender: 'them', text: "Çok memnun oldum! 😊", time: timeString }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      
      {/* Header */}
      <header className="bg-white p-3 shadow-sm flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <Link href="/matches">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Button>
            </Link>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <Typography variant="h3" className="text-base text-gray-900">{profile.name}</Typography>
                    <p className="text-xs text-green-600 font-medium">Çevrimiçi</p>
                </div>
            </div>
        </div>
        
        <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="text-purple-600">
                <Phone className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon" className="text-purple-600">
                <Video className="w-5 h-5" />
             </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-gray-400 my-4">Bugün</div>
        
        {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                        msg.sender === 'me' 
                        ? 'bg-purple-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}
                >
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'}`}>
                        {msg.time}
                    </p>
                </div>
            </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white p-3 px-4 border-t sticky bottom-0">
        <div className="flex gap-2 items-center max-w-4xl mx-auto">
            <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                type="text" 
                placeholder="Bir mesaj yazın..." 
                className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <Button 
                onClick={handleSend}
                size="icon" 
                className={`rounded-full transition-all ${message.trim() ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300'}`}
                disabled={!message.trim()}
            >
                <Send className="w-5 h-5 text-white" />
            </Button>
        </div>
      </footer>
    </div>
  );
}
