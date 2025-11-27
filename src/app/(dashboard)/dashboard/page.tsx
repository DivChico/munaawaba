import { Calendar, ClipboardList, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    {
      name: "المواعيد اليوم",
      value: "12",
      icon: Calendar,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      name: "المواعيد المعلقة",
      value: "8",
      icon: ClipboardList,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      name: "إجمالي العملاء",
      value: "156",
      icon: Users,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      name: "المواعيد المكتملة",
      value: "4",
      icon: CheckCircle2,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          مرحباً بك في مناوبة
        </h1>
        <p className="text-muted-foreground mt-2">
          نظام إدارة المواعيد والصيانة
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Card */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          ابدأ باستخدام النظام
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          يمكنك الآن إدارة جميع مواعيد الصيانة والخدمات الميدانية بكفاءة عالية.
          استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/calendar" className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary/90 transition-colors duration-200">
            إضافة موعد جديد
          </Link>
          <Link href="/dashboard/calendar" className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors duration-200">
            عرض التقويم
          </Link>
        </div>
      </div>
    </div>
  );
}
