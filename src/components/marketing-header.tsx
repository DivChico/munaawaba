"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function MarketingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getUser();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-l from-primary to-chart-2 bg-clip-text text-transparent">
                        مناوبة
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                        المميزات
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                        الأسعار
                    </Link>
                    <Link
                        href="#faq"
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                        الأسئلة الشائعة
                    </Link>
                </nav>

                {/* CTA Buttons */}
                {!loading && (
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            // Authenticated - Show Dashboard button
                            <Link
                                href="/dashboard"
                                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                لوحة التحكم
                            </Link>
                        ) : (
                            // Not authenticated - Show Sign In/Sign Up
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    تسجيل الدخول
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    ابدأ الآن
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden rounded-lg p-2 hover:bg-accent"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-background p-4">
                    <nav className="flex flex-col gap-4">
                        <Link
                            href="#features"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            المميزات
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            الأسعار
                        </Link>
                        <Link
                            href="#faq"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            الأسئلة الشائعة
                        </Link>
                        <div className="flex flex-col gap-2 pt-4 border-t border-border">
                            {!loading && (
                                <>
                                    {user ? (
                                        // Authenticated - Show Dashboard button
                                        <Link
                                            href="/dashboard"
                                            className="text-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            لوحة التحكم
                                        </Link>
                                    ) : (
                                        // Not authenticated - Show Sign In/Sign Up
                                        <>
                                            <Link
                                                href="/sign-in"
                                                className="text-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                تسجيل الدخول
                                            </Link>
                                            <Link
                                                href="/sign-up"
                                                className="text-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                ابدأ الآن
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
