"use client";

import * as React from "react";
import {
    BookOpen,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    GraduationCap,
    ChevronUp,
    User,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { getLevelTitle, calculateXPProgress } from "@/lib/gamification";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
        xp?: number;
        level?: number;
    };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    const userInitials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
        : "HB";

    // Gamification Logic
    const level = user?.level || 1;
    const xp = user?.xp || 0;
    const { progress, current, required } = calculateXPProgress(xp, level);

    return (
        <Sidebar
            collapsible="icon"
            className="border-r-4 border-primary/20 bg-white"
            {...props}
        >
            <SidebarHeader className={cn("py-8 transition-all duration-300", isCollapsed ? "px-2" : "px-4")}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                "h-14 transition-all hover:bg-transparent",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground transition-transform hover:rotate-12 shrink-0">
                                <GraduationCap className={cn("transition-all", isCollapsed ? "size-6" : "size-7")} />
                            </div>
                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="grid flex-1 text-left text-sm leading-tight ml-3"
                                    >
                                        <span className="truncate font-black text-2xl tracking-tight text-foreground uppercase italic">
                                            HUYBOON
                                        </span>
                                        <span className="truncate text-[10px] uppercase font-black tracking-widest text-primary italic">
                                            PLAYHUB v1.0
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3 pt-4 space-y-4">
                <SidebarMenu className="gap-3">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Phòng của tôi"
                            isActive
                            className={cn(
                                "h-12 hover:bg-yellow-400/10 transition-all group rounded-2xl border-2 border-transparent active:scale-95 hover:border-yellow-400/20",
                                isCollapsed && "justify-center px-0"
                            )}
                            render={<a href="/dashboard" />}
                        >
                            <LayoutDashboard className={cn("transition-colors text-slate-400 group-data-[active=true]:text-yellow-600", isCollapsed ? "size-6" : "size-5")} />
                            {!isCollapsed && (
                                <span className="font-black italic uppercase tracking-tight text-lg ml-2">
                                    Phòng của tôi
                                </span>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Thế giới"
                            className={cn(
                                "h-12 hover:bg-blue-400/10 transition-all group rounded-2xl border-2 border-transparent active:scale-95 hover:border-blue-400/20",
                                isCollapsed && "justify-center px-0"
                            )}
                            render={<a href="/worlds" />}
                        >
                            <BookOpen className={cn("transition-colors text-slate-400 group-hover:text-blue-600", isCollapsed ? "size-6" : "size-5")} />
                            {!isCollapsed && (
                                <span className="font-black italic uppercase tracking-tight text-lg ml-2">
                                    Thế giới
                                </span>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Bạn bè"
                            className={cn(
                                "h-12 hover:bg-pink-400/10 transition-all group rounded-2xl border-2 border-transparent active:scale-95 hover:border-pink-400/20",
                                isCollapsed && "justify-center px-0"
                            )}
                            render={<a href="/friends" />}
                        >
                            <Users className={cn("transition-colors text-slate-400 group-hover:text-pink-600", isCollapsed ? "size-6" : "size-5")} />
                            {!isCollapsed && (
                                <span className="font-black italic uppercase tracking-tight text-lg ml-2">
                                    Bạn bè
                                </span>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t-4 border-primary/10 bg-muted/30">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <SidebarMenuButton
                                        size="lg"
                                        className={cn(
                                            "data-[state=open]:bg-sidebar-accent rounded-[1.5rem] border-4 border-white bg-white shadow-xl sticker-shadow hover:scale-105 transition-all flex flex-col items-start justify-center p-4 gap-2",
                                            isCollapsed ? "h-16 w-16 p-0 items-center mx-auto" : "h-24 w-full"
                                        )}
                                    />
                                }
                            >
                                <div className={cn("flex items-center w-full", isCollapsed && "justify-center")}>
                                    <Avatar className={cn("rounded-xl border-2 border-primary/20 transition-all", isCollapsed ? "size-10" : "size-10")}>
                                        <AvatarImage
                                            src={user?.image || undefined}
                                            alt={user?.name || "User"}
                                        />
                                        <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-black text-xs">
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    {!isCollapsed && (
                                        <>
                                            <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                                                <span className="truncate font-black tracking-tight text-foreground uppercase italic">
                                                    {user?.name || "Người chơi"}
                                                </span>
                                                <span className="truncate text-[10px] font-black text-primary uppercase italic opacity-80">
                                                    {user?.role === "TEACHER"
                                                        ? "Giảng viên"
                                                        : getLevelTitle(level)}
                                                </span>
                                            </div>
                                            <ChevronUp className="ml-auto size-5 text-slate-400" />
                                        </>
                                    )}
                                </div>

                                {/* Magic XP Bar */}
                                {!isCollapsed && (
                                    <div className="w-full space-y-1">
                                        <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 italic">
                                            <span>
                                                {user?.role === "TEACHER"
                                                    ? "Mức Thông thái"
                                                    : "Hạng Anh hùng"}{" "}
                                                {level}
                                            </span>
                                            <span>
                                                {current} / {required} XP
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-slate-100">
                                            <div
                                                className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] min-w-64 rounded-[2rem] p-3 bg-white border-4 border-primary/10 shadow-2xl backdrop-blur-xl"
                                align="start"
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="px-4 py-3 text-sm font-black uppercase tracking-widest text-slate-400 italic">
                                        {user?.role === "TEACHER"
                                            ? "Giảng viên"
                                            : "Học viên"}
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                        render={
                                            <a
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 transition-all text-foreground font-black italic uppercase tracking-tight text-base cursor-pointer"
                                            />
                                        }
                                    >
                                        <User className="size-5 text-primary" />{" "}
                                        Danh tính
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        render={
                                            <a
                                                href="/settings"
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-secondary/10 transition-all text-foreground font-black italic uppercase tracking-tight text-base cursor-pointer"
                                            />
                                        }
                                    >
                                        <Settings className="size-5 text-secondary" />{" "}
                                        Cài đặt
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="bg-primary/10 my-3" />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-black italic uppercase tracking-tight text-base cursor-pointer transition-all"
                                >
                                    <LogOut className="size-5" /> Thoát Hành
                                    trình
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
