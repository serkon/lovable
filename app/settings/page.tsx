"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
        <div className="min-h-screen bg-background flex flex-col" data-testid="settings-page-container">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background border-b px-4">
                <Link href="/profile">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h3 className="font-bold">
                    Ayarlar
                </h3>
            </header>

            <main className="mx-auto w-full max-w-2xl p-4 space-y-8" data-testid="settings-main">
                {settingsGroups.map((group, idx) => (
                    <div key={idx} className="space-y-3">
                        <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                            {group.title}
                        </h4>
                        <Card>
                            <CardContent className="p-0">
                                {group.items.map((item, itemIdx) => (
                                    <div key={item.id}>
                                        <div
                                            className={cn(
                                                "flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted",
                                                item.danger && "text-destructive"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={cn(
                                                        "p-2 rounded-md",
                                                        item.danger ? "bg-destructive/10" : "bg-muted/50"
                                                    )}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold">
                                                        {item.label}
                                                    </span>
                                                    {item.desc && (
                                                        <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {item.type === "toggle" ? (
                                                <Switch
                                                    checked={item.value}
                                                    onCheckedChange={item.onChange}
                                                />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        {itemIdx !== group.items.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                ))}

                {/* Logout Button */}
                <div className="px-2 pb-10">
                    <Button
                        variant="destructive"
                        className="w-full"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        Çıkış Yap
                    </Button>
                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        Version 1.0.0 (Phase 2 Beta)
                    </p>
                </div>
            </main>
        </div>
    );
}
