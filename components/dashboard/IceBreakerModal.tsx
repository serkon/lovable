"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Sparkles, MessageCircle, Send } from "lucide-react";
import { getIceBreakers } from "@/lib/actions/contentActions";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface IceBreakerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (question: string) => void;
    targetName: string;
}

export function IceBreakerModal({ isOpen, onClose, onSend, targetName }: IceBreakerModalProps) {
    const { language } = useAppStore();
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);

    useEffect(() => {
        const loadQuestions = async () => {
            const dbQuestions = await getIceBreakers();
            setQuestions(dbQuestions);
        };
        if (isOpen) {
            loadQuestions();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <CardHeader className="bg-primary text-primary-foreground text-center relative p-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    <div className="mx-auto w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-3">
                        <MessageCircle className="w-6 h-6 fill-current" />
                    </div>

                    <CardTitle className="text-2xl font-bold">{getLabel('ice_breaker_title', language)}</CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-sm mt-1">
                        {getLabel('ice_breaker_subtitle', language, { name: targetName })}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 font-semibold">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm">{getLabel('intro_questions', language)}</span>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {questions.map((q, idx) => (
                            <Button
                                key={idx}
                                variant={selectedQuestion === q ? "default" : "outline"}
                                onClick={() => setSelectedQuestion(q)}
                                className={cn(
                                    "w-full h-auto text-left justify-start p-4 whitespace-normal text-xs leading-relaxed",
                                    selectedQuestion === q ? "" : "bg-muted/20"
                                )}
                            >
                                {q}
                            </Button>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="flex-1 font-bold">
                            {getLabel('btn_cancel', language)}
                        </Button>
                        <Button
                            onClick={() => onSend(selectedQuestion)}
                            disabled={!selectedQuestion}
                            className="flex-[2] font-bold gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {getLabel('send_with_question', language)}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
