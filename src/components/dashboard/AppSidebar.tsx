'use client'

import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  GraduationCap,
  ChevronUp,
  User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "HB"

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 shadow-xl" {...props}>
      <SidebarHeader className="py-6 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12 transition-all">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground transition-transform hover:scale-105">
                <GraduationCap className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-black text-xl tracking-tight text-foreground/90 uppercase italic">HUYBOON</span>
                <span className="truncate text-[9px] uppercase font-black tracking-widest text-primary/60 opacity-80">LMS CORE v1.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Home Hub" isActive className="h-10 hover:bg-primary/5 transition-colors group" render={
              <a href="/dashboard" />
            }>
              <LayoutDashboard className="group-data-[active=true]:text-primary transition-colors" />
              <span className="font-bold tracking-tight">Main Hub</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="All Classrooms" className="h-10 hover:bg-primary/5 transition-colors group" render={
              <a href="/dashboard" />
            }>
              <BookOpen className="group-hover:text-primary transition-colors" />
              <span className="font-bold tracking-tight">Classrooms</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Academic Community" className="h-10 hover:bg-primary/5 transition-colors group" render={
              <a href="/dashboard" />
            }>
              <Users className="group-hover:text-primary transition-colors" />
              <span className="font-bold tracking-tight">Community</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/20 bg-muted/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14 rounded-xl border border-border/20 bg-background shadow-sm hover:shadow-md transition-all"
                />
              }>
                <Avatar className="size-9 rounded-lg border border-border/40">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-black tracking-tight text-foreground">{user?.name || "Academic User"}</span>
                  <span className="truncate text-[10px] font-bold text-muted-foreground uppercase opacity-70 tracking-tighter">{user?.role || "STUDENT"}</span>
                </div>
                <ChevronUp className="ml-auto size-4 text-muted-foreground/40 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] min-w-56 rounded-2xl p-2 bg-slate-900 border-white/5 shadow-2xl backdrop-blur-xl"
                align="start"
              >
                <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500">
                  Profile Configuration
                </DropdownMenuLabel>
                <DropdownMenuItem render={
                   <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-slate-300 font-bold text-sm cursor-pointer" />
                }>
                     <User className="size-4" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={
                   <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-slate-300 font-bold text-sm cursor-pointer" />
                }>
                     <Settings className="size-4" /> Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-destructive/5 hover:bg-destructive/10 text-destructive font-black text-sm cursor-pointer transition-colors"
                >
                  <LogOut className="size-4" /> Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
