"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { X, Calendar, Clock, CreditCard, Video, CheckCircle2 } from "lucide-react";

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
    // Simulate API call
    setTimeout(() => {
        setStep("success");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-white shadow-2xl animate-in scale-95 duration-200 p-0 overflow-hidden">
        
        {/* Header */}
        <div className="bg-purple-600 p-6 flex justify-between items-start">
            <div>
                <Typography variant="h3" className="text-white">Görüntülü Randevu</Typography>
                <p className="text-purple-100 mt-1">{partnerName} ile güvenli görüşme</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6">
            
            {step === "datetime" && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 font-medium">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            Tarih Seçin
                        </label>
                        <input 
                            type="date" 
                            className="w-full p-4 border rounded-xl bg-gray-50 text-lg"
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 font-medium">
                            <Clock className="w-5 h-5 text-purple-600" />
                            Saat Seçin
                        </label>
                         <div className="grid grid-cols-3 gap-2">
                            {["14:00", "15:00", "19:00", "20:00", "21:00", "22:00"].map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-3 rounded-lg border-2 font-medium transition-colors ${selectedTime === time ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-200'}`}
                                >
                                    {time}
                                </button>
                            ))}
                         </div>
                    </div>

                    <Button 
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep("payment")}
                        className="w-full h-14 text-lg bg-purple-600 disabled:opacity-50"
                    >
                        Devam Et
                    </Button>
                </div>
            )}

            {step === "payment" && (
                <div className="space-y-6 text-center">
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                        <Typography variant="h2" className="text-purple-700">150.00 ₺</Typography>
                        <p className="text-gray-600 mt-2">30 Dakikalık Görüntülü Görüşme</p>
                    </div>

                    <div className="space-y-4 text-left">
                         <div className="flex items-center gap-3 p-4 border rounded-xl bg-gray-50">
                            <CreditCard className="w-6 h-6 text-gray-600" />
                            <div>
                                <p className="font-semibold text-gray-800">Kayıtlı Kartım</p>
                                <p className="text-sm text-gray-500">**** **** **** 4242</p>
                            </div>
                         </div>
                    </div>

                    <Button onClick={handlePayment} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700">
                        Ödemeyi Onayla ve Randevu Al
                    </Button>
                    <button onClick={() => setStep("datetime")} className="text-gray-500 text-sm hover:underline">
                        Geri Dön
                    </button>
                </div>
            )}

            {step === "success" && (
                <div className="space-y-6 text-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                        <Typography variant="h2" className="text-green-700">Randevu Oluşturuldu!</Typography>
                        <p className="text-gray-600 mt-2">Görüşme detayları SMS olarak gönderildi.</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3 overflow-hidden">
                        <div className="bg-white p-2 rounded-lg">
                            <Video className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="text-xs text-gray-500 font-semibold uppercase">Google Meet Linki</p>
                            <p className="text-blue-600 truncate font-medium">meet.google.com/abc-defg-hij</p>
                        </div>
                    </div>

                    <Button onClick={onClose} variant="outline" className="w-full">
                        Tamam
                    </Button>
                </div>
            )}

        </div>
      </Card>
    </div>
  );
}
