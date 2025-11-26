"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Calendar,
    ClipboardList,
    Users,
    FileText,
    Settings,
    Menu,
    X,
    LayoutDashboard,
    LogOut,
    Moon,
    Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "لوحة التحكم", href: "/", icon: LayoutDashboard },
    { name: "التقويم", href: "/calendar", icon: Calendar },
    { name: "المواعيد", href: "/appointments", icon: ClipboardList },
    { name: "العملاء", href: "/customers", icon: Users },
    { name: "التقارير", href: "/reports", icon: FileText },
    { name: "الإعدادات", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const pathname = usePathname();

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 lg:hidden rounded-lg bg-card p-2 shadow-lg border border-border"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 right-0 z-40 h-screen w-72 bg-sidebar border-l border-sidebar-border transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-6">
                        <h1 className="text-2xl font-bold bg-gradient-to-l from-primary to-chart-2 bg-clip-text text-transparent">
                            مناوبة
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                                            : "text-sidebar-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-sidebar-border p-4 space-y-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                        >
                            {isDark ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                            <span>{isDark ? "الوضع النهاري" : "الوضع الليلي"}</span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                م
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-sidebar-foreground truncate">
                                    مدير النظام
                                </p>
                                <p className="text-xs text-sidebar-foreground/60 truncate">
                                    admin@munaawaba.com
                                </p>
                            </div>
                        </div>

                        {/* Logout */}
                        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200">
                            <LogOut className="h-5 w-5" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
