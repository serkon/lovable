"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { loginUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await loginUser(formData);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error || "Bir hata oluştu");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md p-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="self-start">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                    <Logo size={60} />
                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Hoş Geldiniz</h2>
                        <p className="text-sm text-muted-foreground">
                            Kaldığınız yerden devam etmek için giriş yapın.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-destructive text-center">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Hesabınız yok mu?{" "}
                        <Link href="/" className="font-semibold hover:underline">
                            Hemen Başlayın
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
