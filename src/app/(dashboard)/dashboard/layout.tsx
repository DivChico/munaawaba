import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            {/* Main content area - offset for sidebar on desktop */}
            <div className="lg:mr-72">
                <main className="min-h-screen p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
