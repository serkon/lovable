"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X, Calendar, Clock, CreditCard, Video, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateSchedulerProps {
    isOpen: boolean;
    onClose: () => void;
    partnerName: string;
}

type Step = "datetime" | "payment" | "success";

export function DateScheduler({ isOpen, onClose, partnerName }: DateSchedulerProps) {
    const [step, setStep] = useState<Step>("datetime");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");

    if (!isOpen) return null;

    const handlePayment = () => {
        setTimeout(() => {
            setStep("success");
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md shadow-2xl animate-in scale-95 duration-200 p-0 overflow-hidden border">
                <CardHeader className="bg-primary text-primary-foreground p-6 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </Button>
                    <CardTitle className="text-xl font-bold">Görüntülü Randevu</CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-sm">
                        {partnerName} ile güvenli görüşme
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                    {step === "datetime" && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Tarih Seçin
                                </Label>
                                <Input
                                    type="date"
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Saat Seçin
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["14:00", "15:00", "19:00", "20:00", "21:00", "22:00"].map(time => (
                                        <Button
                                            key={time}
                                            variant={selectedTime === time ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedTime(time)}
                                            className="text-xs font-bold"
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                disabled={!selectedDate || !selectedTime}
                                onClick={() => setStep("payment")}
                                className="w-full"
                            >
                                Devam Et
                            </Button>
                        </div>
                    )}

                    {step === "payment" && (
                        <div className="space-y-6 text-center">
                            <Card className="bg-muted/50 border shadow-none">
                                <CardContent className="p-6">
                                    <h2 className="text-3xl font-extrabold">150.00 ₺</h2>
                                    <p className="text-muted-foreground text-xs mt-2 uppercase font-bold tracking-wider">30 Dakikalık Görüntülü Görüşme</p>
                                </CardContent>
                            </Card>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-3 p-4 border rounded-xl bg-muted/20">
                                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                                    <div>
                                        <p className="font-bold text-sm">Kayıtlı Kartım</p>
                                        <p className="text-[10px] text-muted-foreground">**** **** **** 4242</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button onClick={handlePayment} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white">
                                    Ödemeyi Onayla ve Randevu Al
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setStep("datetime")}>
                                    Geri Dön
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="space-y-6 text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-green-600">Randevu Oluşturuldu!</h2>
                                <p className="text-muted-foreground text-sm">Görüşme detayları SMS olarak gönderildi.</p>
                            </div>

                            <Card className="bg-muted/30 border shadow-none">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="bg-background p-2 rounded-md shadow-sm border text-blue-500">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase">Google Meet Linki</p>
                                        <p className="text-blue-500 truncate text-xs font-bold">meet.google.com/abc-defg-hij</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button onClick={onClose} variant="outline" className="w-full font-bold">
                                Tamam
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
