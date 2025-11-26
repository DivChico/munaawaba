import { Sidebar } from "@/components/sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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
