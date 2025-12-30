"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";

import { useAppStore } from "@/context/AppStore";
import { getLabel } from "@/lib/translations";
import { toast } from "sonner"

export function Form() {
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

            toast.error(getLabel("login_error_generic", language), {
                position: 'top-center',
                duration: 5000,
                closeButton: true
            });
        }
    }

    return (
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
    )
}