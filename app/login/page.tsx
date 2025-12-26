"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { loginUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <Link href="/" className="self-start mb-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <Logo size={80} />
                    <div className="text-center space-y-2">
                        <Typography variant="h2" className="text-purple-900">
                            Tekrar Hoş Geldiniz
                        </Typography>
                        <Typography variant="body" className="text-gray-500">
                            Kaldığınız yerden devam etmek için giriş yapın.
                        </Typography>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            E-posta Adresi
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Şifre
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
                        disabled={loading}
                    >
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </Button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                    <Typography variant="body" className="text-gray-500">
                        Hesabınız yok mu?{" "}
                        <Link href="/" className="text-purple-600 font-bold hover:underline">
                            Hemen Başlayın
                        </Link>
                    </Typography>
                </div>
            </div>
        </div>
    );
}
