import { AppSidebar } from "@/components/dashboard/AppSidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MagicBreadcrumb } from "@/components/dashboard/MagicBreadcrumb";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Fetch fresh user gamification data
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { xp: true, level: true },
    });

    const userWithStats = {
        ...session.user,
        xp: user?.xp || 0,
        level: user?.level || 1,
    };

    return (
        <SidebarProvider>
            <AppSidebar user={userWithStats} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-transparent z-20">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="size-10 rounded-xl bg-white border-2 border-slate-200 shadow-md sticker-shadow-sm hover:scale-110 active:scale-95 transition-all text-slate-500 hover:text-primary hover:border-primary/30" />
                        <MagicBreadcrumb />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Potential space for Quick Actions / Notifications / Search */}
                        <div className="hidden md:flex h-10 px-4 items-center gap-2 rounded-2xl bg-white/50 border-2 border-slate-100 backdrop-blur-sm text-[10px] font-black uppercase italic tracking-widest text-slate-400">
                             <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                             Hệ thống Trực tuyến
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
