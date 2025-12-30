"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";

export default function LoginPage() {
    const { language } = useAppStore();
    const [errors, setErrors] = useState<{ root?: string; email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await loginUser(formData);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setErrors({ root: result.error || getLabel("login_error_generic", language) });
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-background" data-testid="login-page">
            {/* Left Side - Visual & Atmosphere */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-orange-50" data-testid="login-visual-side">
                <Image
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2000&auto=format&fit=crop"
                    alt="Happy Couple Bright"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-12 left-0 right-0 flex justify-center z-10">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-widest uppercase shadow-lg">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <Heart className="relative inline-flex rounded-full h-4 w-4 text-red-500 fill-current" />
                        </span>
                        <span>{getLabel("thousands_happy_couples", language)}</span>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-16 text-white z-10 space-y-6">
                    <blockquote className="max-w-md">
                        <p className="text-3xl font-serif leading-loose">
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-2 box-decoration-clone">
                                &quot;{getLabel("login_quote", language)}&quot;
                            </span>
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col relative bg-background" data-testid="login-form-side">
                {/* Back Button */}
                {/* Header / Nav */}
                <header className="w-full flex items-center p-6 sticky top-0 bg-background/80 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none lg:absolute lg:top-8 lg:left-8 lg:w-auto z-20" data-testid="login-header">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium group">
                        <div className="p-2 rounded-full bg-secondary group-hover:bg-secondary/80 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                    </Link>
                </header>

                <div className="flex-1 flex items-start justify-center p-6 pb-12">
                    <div className="w-full max-w-sm lg:mt-12">
                        {/* Custom Brand Lockup - Centered & Spaced */}
                        <div className="flex flex-col items-center mb-16">
                            <Heart className="w-12 h-12 text-primary fill-current mb-3" />
                            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">SecondSpring</span>
                        </div>

                        {/* Header */}
                        <div className="flex flex-col items-start text-left space-y-4">
                            <div className="space-y-1">
                                <h1 className="text-lg font-semibold tracking-tight text-neutral-600 mb-2">{getLabel("welcome", language)}</h1>
                                <p className="text-muted-foreground text-sm mb-9">
                                    {getLabel("login_subtitle", language)}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
                            <div className="space-y-4">
                                <FormGroup label={getLabel("label_email", language)} htmlFor="email" error={errors.email} data-testid="email-container">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder={getLabel("placeholder_email", language)}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup
                                    label={getLabel("label_password", language)}
                                    htmlFor="password"
                                    error={errors.password}
                                    data-testid="password-container"
                                    action={
                                        <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors" data-testid="forgot-password-button">
                                            {getLabel("forgot_password", language)}
                                        </button>
                                    }
                                >
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </FormGroup>
                            </div>

                            {errors.root && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium flex items-center justify-center text-center animate-in fade-in slide-in-from-top-1" data-testid="login-error-message">
                                    {errors.root}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                                data-testid="login-submit-button"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {getLabel("logging_in", language)}
                                    </>
                                ) : (
                                    getLabel("btn_login", language)
                                )}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    {getLabel("or", language)}
                                </span>
                            </div>
                        </div>


                        {/* Footer */}
                        <div className="text-center" data-testid="login-footer">
                            <p className="text-sm text-muted-foreground">
                                {getLabel("not_member_yet", language)}{" "}
                                <Link href="/onboarding" className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all">
                                    {getLabel("sign_up_now", language)}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 h-12 my-4 flex items-center justify-center">
                    <p className="text-xxs text-center text-muted-foreground px-4 leading-relaxed">
                        {getLabel("legal_login_prefix", language)}{" "}
                        <Link href="/privacy" className="underline hover:text-foreground transition-colors">
                            {getLabel("footer_privacy", language)}
                        </Link>{" "}
                        {getLabel("legal_and", language)}{" "}
                        <Link href="/terms" className="underline hover:text-foreground transition-colors">
                            {getLabel("footer_terms", language)}
                        </Link>
                        {getLabel("legal_suffix", language)}
                    </p>
                </div>
            </div>
        </div>
    );
}

