import Link from "next/link";
import Image from "next/image";
import {
    Calendar,
    Users,
    FileText,
    Bell,
    MapPin,
    Shield,
    Check,
} from "lucide-react";

export default function LandingPage() {
    const features = [
        {
            icon: Calendar,
            title: "إدارة المواعيد الذكية",
            description: "نظام تقويم متقدم مع فترات صباحية ومسائية وتنبيهات تلقائية",
        },
        {
            icon: Users,
            title: "إدارة العملاء",
            description: "قاعدة بيانات شاملة للعملاء مع سجل كامل للخدمات",
        },
        {
            icon: MapPin,
            title: "تكامل خرائط جوجل",
            description: "تحديد المواقع بدقة وتوجيه الفنيين للعملاء بسهولة",
        },
        {
            icon: Bell,
            title: "إشعارات تلقائية",
            description: "رسائل SMS وواتساب للعملاء والفنيين",
        },
        {
            icon: FileText,
            title: "تقارير شاملة",
            description: "تقارير يومية وشهرية مع إمكانية التصدير PDF",
        },
        {
            icon: Shield,
            title: "نظام أمان متقدم",
            description: "صلاحيات مخصصة ورموز تأكيد للخدمات",
        },
    ];

    const pricingPlans = [
        {
            name: "الأساسية",
            price: "299",
            period: "شهرياً",
            features: [
                "حتى 100 موعد شهرياً",
                "3 مستخدمين",
                "تقارير أساسية",
                "دعم فني عبر البريد",
            ],
            popular: false,
        },
        {
            name: "الاحترافية",
            price: "599",
            period: "شهرياً",
            features: [
                "مواعيد غير محدودة",
                "10 مستخدمين",
                "تقارير متقدمة",
                "دعم فني مباشر",
                "تكامل واتساب",
                "تطبيق موبايل",
            ],
            popular: true,
        },
        {
            name: "المؤسسات",
            price: "حسب الطلب",
            period: "",
            features: [
                "كل مميزات الاحترافية",
                "مستخدمين غير محدودين",
                "تخصيص كامل",
                "مدير حساب مخصص",
                "تدريب فريق العمل",
                "استضافة خاصة",
            ],
            popular: false,
        },
    ];

    const faqs = [
        {
            question: "هل يمكنني تجربة النظام قبل الاشتراك؟",
            answer: "نعم، نوفر فترة تجريبية مجانية لمدة 14 يوماً بدون الحاجة لبطاقة ائتمانية.",
        },
        {
            question: "هل النظام يدعم اللغة العربية بالكامل؟",
            answer: "نعم، النظام مصمم خصيصاً للسوق العربي ويدعم اللغة العربية بالكامل مع واجهة RTL.",
        },
        {
            question: "كيف يتم إرسال الإشعارات للعملاء؟",
            answer: "يتم إرسال الإشعارات عبر SMS أو واتساب تلقائياً عند حجز أو تعديل المواعيد.",
        },
        {
            question: "هل يمكن استخدام النظام على الهاتف؟",
            answer: "نعم، النظام متجاوب بالكامل ويعمل على جميع الأجهزة، مع تطبيق موبايل مخصص قريباً.",
        },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 ">
                <div className="grid gap-12  items-center">
                    <div className="space-y-6 flex  flex-col items-center justify-center">
                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                            نظام إدارة المواعيد
                            <span className="block bg-gradient-to-l from-primary to-chart-2 bg-clip-text text-transparent">
                                للشركات الميدانية
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl text-center">
                            أدِر مواعيد الصيانة والخدمات الميدانية بكفاءة عالية. نظام متكامل مع
                            إشعارات تلقائية، تتبع الفنيين، وتقارير شاملة.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/dashboard"
                                className="rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl"
                            >
                                ابدأ الآن مجاناً
                            </Link>
                            <Link
                                href="#pricing"
                                className="rounded-lg border-2 border-border px-8 py-4 text-lg font-medium hover:bg-accent transition-all"
                            >
                                عرض الأسعار
                            </Link>
                        </div>
                    </div>

                    {/* Screenshot */}
                    <div className="relative">
                        <div className="rounded-2xl border-2 border-border bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 p-8 shadow-2xl">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                <Image
                                    src="/add-appointmanet.png"
                                    alt="لقطة شاشة من لوحة التحكم - إضافة موعد"
                                    width={1920}
                                    height={1080}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-muted/50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            مميزات النظام
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            كل ما تحتاجه لإدارة أعمالك الميدانية في مكان واحد
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            خطط الأسعار
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            اختر الخطة المناسبة لحجم عملك
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl border-2 p-8 ${plan.popular
                                    ? "border-primary shadow-xl scale-105"
                                    : "border-border"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                                        الأكثر شعبية
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground mr-2">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/dashboard"
                                    className={`block text-center rounded-lg px-6 py-3 font-medium transition-all ${plan.popular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "border-2 border-border hover:bg-accent"
                                        }`}
                                >
                                    ابدأ الآن
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="bg-muted/50 py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            الأسئلة الشائعة
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            إجابات على الأسئلة الأكثر شيوعاً
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-6"
                            >
                                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-3/20 p-12 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            جاهز للبدء؟
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            انضم إلى مئات الشركات التي تستخدم مناوبة لإدارة أعمالها الميدانية
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-block rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl"
                        >
                            ابدأ تجربتك المجانية
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
