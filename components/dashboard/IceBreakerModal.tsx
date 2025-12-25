"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { X, Sparkles, MessageCircle, Send } from "lucide-react";
import { ICE_BREAKER_QUESTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";

interface IceBreakerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (question: string) => void;
    targetName: string;
}

export function IceBreakerModal({ isOpen, onClose, onSend, targetName }: IceBreakerModalProps) {
    const { language } = useAppStore();
    const [selectedQuestion, setSelectedQuestion] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-purple-600 p-6 text-white text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                        <MessageCircle className="w-8 h-8 fill-white" />
                    </div>

                    <Typography variant="h2" className="text-white">{getLabel('ice_breaker_title', language)}</Typography>
                    <Typography variant="body" className="text-purple-100 opacity-90 mt-1">
                        {getLabel('ice_breaker_subtitle', language, { name: targetName })}
                    </Typography>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>{getLabel('intro_questions', language)}</span>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {ICE_BREAKER_QUESTIONS.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedQuestion(q)}
                                className={cn(
                                    "w-full text-left p-4 rounded-2xl border-2 transition-all text-sm leading-relaxed",
                                    selectedQuestion === q
                                        ? "border-purple-600 bg-purple-50 text-purple-900 shadow-sm"
                                        : "border-gray-100 bg-gray-50 text-gray-700 hover:border-purple-200"
                                )}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="flex-1 rounded-2xl h-14 font-bold text-gray-500">
                            {getLabel('btn_cancel', language)}
                        </Button>
                        <Button
                            onClick={() => onSend(selectedQuestion)}
                            disabled={!selectedQuestion}
                            className="flex-[2] bg-purple-600 hover:bg-purple-700 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                        >
                            <Send className="w-5 h-5" />
                            {getLabel('send_with_question', language)}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
