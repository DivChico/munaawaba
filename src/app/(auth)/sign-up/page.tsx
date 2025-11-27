"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignUpPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
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

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (password !== confirmPassword) {
            setError("كلمات المرور غير متطابقة");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                        role: 'employee', // Default role
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            if (data.user) {
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-xl text-center">
                        <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">تحقق من بريدك الإلكتروني</h2>
                        <p className="text-muted-foreground mb-6">
                            تم إرسال رسالة تأكيد إلى <strong>{email}</strong>
                        </p>
                        <div className="bg-muted/50 rounded-lg p-4 mb-6 text-right">
                            <p className="text-sm text-muted-foreground mb-2">
                                الخطوات التالية:
                            </p>
                            <ol className="text-sm space-y-2 list-decimal list-inside text-foreground">
                                <li>افتح بريدك الإلكتروني</li>
                                <li>ابحث عن رسالة من مناوبة</li>
                                <li>اضغط على رابط التأكيد</li>
                                <li>سيتم تحويلك لتسجيل الدخول</li>
                            </ol>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                            لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها
                        </p>
                        <Link
                            href="/sign-in"
                            className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            العودة لتسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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

                {/* Sign Up Card */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6">إنشاء حساب جديد</h2>

                    {error && (
                        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                                الاسم الكامل
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="أحمد محمد"
                                disabled={loading}
                            />
                        </div>

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

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                رقم الجوال
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="+966 5X XXX XXXX"
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                تأكيد كلمة المرور
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/sign-in" className="text-primary font-medium hover:underline">
                            تسجيل الدخول
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
