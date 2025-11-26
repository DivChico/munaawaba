import Link from "next/link";

export function MarketingFooter() {
    return (
        <footer className="border-t border-border bg-muted/50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-bold bg-gradient-to-l from-primary to-chart-2 bg-clip-text text-transparent mb-4">
                            مناوبة
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            نظام متكامل لإدارة مواعيد الصيانة والخدمات الميدانية
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold mb-4">المنتج</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#features" className="hover:text-foreground transition-colors">
                                    المميزات
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="hover:text-foreground transition-colors">
                                    الأسعار
                                </Link>
                            </li>
                            <li>
                                <Link href="#faq" className="hover:text-foreground transition-colors">
                                    الأسئلة الشائعة
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">الشركة</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    من نحن
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    تواصل معنا
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    الوظائف
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">قانوني</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    سياسة الخصوصية
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    شروط الاستخدام
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>© 2025 مناوبة. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}
