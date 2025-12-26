"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import {
    ArrowLeft,
    Bell,
    Lock,
    Shield,
    LogOut,
    ChevronRight,
    Eye,
    Moon,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SettingsItem {
    id: string;
    label: string;
    desc?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    type: "toggle" | "link";
    value?: boolean;
    onChange?: (val: boolean) => void;
    danger?: boolean;
}

interface SettingsGroup {
    title: string;
    items: SettingsItem[];
}

export default function SettingsPage() {
    const [isGhostMode, setIsGhostMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const settingsGroups: SettingsGroup[] = [
        {
            title: "Gizlilik ve Güvenlik",
            items: [
                {
                    id: "ghost",
                    label: "Gizli Mod (Hayalet Mod)",
                    desc: "Profiliniz sadece beğendiğiniz kişilere görünür.",
                    icon: Eye,
                    type: "toggle",
                    value: isGhostMode,
                    onChange: setIsGhostMode,
                },
                {
                    id: "safety",
                    label: "Güvenlik Rehberi",
                    desc: "Güvenli tanışma için ipuçları.",
                    icon: Shield,
                    type: "link",
                },
            ],
        },
        {
            title: "Uygulama Ayarları",
            items: [
                {
                    id: "notifs",
                    label: "Bildirimler",
                    desc: "Yeni mesaj ve eşleşme bildirimleri.",
                    icon: Bell,
                    type: "toggle",
                    value: notifications,
                    onChange: setNotifications,
                },
                {
                    id: "darkmode",
                    label: "Gece Modu",
                    desc: "Gözlerinizi yormayan koyu tema.",
                    icon: Moon,
                    type: "toggle",
                    value: false,
                },
            ],
        },
        {
            title: "Hesap",
            items: [
                {
                    id: "blocked",
                    label: "Engellenen Kişiler",
                    icon: Lock,
                    type: "link",
                },
                {
                    id: "delete",
                    label: "Hesabımı Sil",
                    icon: Trash2,
                    type: "link",
                    danger: true,
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-20 items-center gap-3 bg-white px-4 shadow-sm">
                <Link href="/profile">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                </Link>
                <Typography variant="h3" className="font-bold text-gray-900">
                    Ayarlar
                </Typography>
            </header>

            <main className="mx-auto w-full max-w-2xl p-4 space-y-8">
                {settingsGroups.map((group, idx) => (
                    <div key={idx} className="space-y-3">
                        <Typography
                            variant="h3"
                            className="px-2 text-sm font-semibold uppercase tracking-wider text-gray-500"
                        >
                            {group.title}
                        </Typography>
                        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                            {group.items.map((item, itemIdx) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50",
                                        itemIdx !== group.items.length - 1 && "border-b border-gray-50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                "p-2.5 rounded-2xl",
                                                item.danger ? "bg-red-50 text-red-500" : "bg-purple-50 text-purple-600"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <Typography
                                                variant="body"
                                                className={cn("font-semibold", item.danger ? "text-red-500" : "text-gray-900")}
                                            >
                                                {item.label}
                                            </Typography>
                                            {item.desc && (
                                                <p className="mt-0.5 text-xs leading-tight text-gray-500">{item.desc}</p>
                                            )}
                                        </div>
                                    </div>

                                    {item.type === "toggle" ? (
                                        <button
                                            onClick={() => item.onChange?.(!item.value)}
                                            className={cn(
                                                "relative flex h-6 w-12 items-center rounded-full px-1 transition-colors",
                                                item.value ? "bg-purple-600" : "bg-gray-200"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                                                    item.value ? "translate-x-6" : "translate-x-0"
                                                )}
                                            />
                                        </button>
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-gray-300" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Button */}
                <div className="px-2 pb-10">
                    <Button
                        variant="outline"
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-red-100 font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-5 w-5" />
                        Çıkış Yap
                    </Button>
                    <p className="mt-6 text-center text-xs italic text-gray-400">
                        Version 1.0.0 (Phase 2 Beta)
                    </p>
                </div>
            </main>
        </div>
    );
}
