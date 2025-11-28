"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    // Redirect if already authenticated
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push('/dashboard');
            }
        };
        checkUser();
    }, [router, supabase]);

    // Check for confirmation or error messages from URL
    useEffect(() => {
        const confirmed = searchParams.get('confirmed');
        const errorParam = searchParams.get('error');

        if (confirmed === 'true') {
            setSuccessMessage('تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.');
        } else if (errorParam === 'confirmation_failed') {
            setError('فشل تأكيد البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
        }
    }, [searchParams]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-l from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                        مناوبة
                    </h1>
                    <p className="text-muted-foreground">نظام إدارة المواعيد والصيانة</p>
                </div>

                {/* Sign In Card */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6">تسجيل الدخول</h2>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-4 rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm text-primary flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="example@company.com"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="text-left">
                            <Link
                                href="/reset-password"
                                className="text-sm text-primary hover:underline"
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        ليس لديك حساب؟{" "}
                        <Link href="/sign-up" className="text-primary font-medium hover:underline">
                            إنشاء حساب جديد
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                        ← العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Loading fallback component
function SignInLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-l from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                        مناوبة
                    </h1>
                    <p className="text-muted-foreground">نظام إدارة المواعيد والصيانة</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main page component with Suspense boundary
export default function SignInPage() {
    return (
        <Suspense fallback={<SignInLoading />}>
            <SignInForm />
        </Suspense>
    );
}
