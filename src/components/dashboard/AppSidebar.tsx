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
  DropdownMenuGroup,
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
    <Sidebar collapsible="icon" className="border-r-4 border-primary/20 bg-white" {...props}>
      <SidebarHeader className="py-8 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-14 transition-all hover:bg-transparent">
              <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground transition-transform hover:rotate-12">
                <GraduationCap className="size-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-3 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-black text-2xl tracking-tight text-foreground uppercase italic">HUYBOON</span>
                <span className="truncate text-[10px] uppercase font-black tracking-widest text-primary italic">PLAYHUB v1.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4 space-y-4">
        <SidebarMenu className="gap-3">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Adventure Home" isActive className="h-12 hover:bg-yellow-400/10 transition-all group rounded-2xl border-2 border-transparent active:scale-95 hover:border-yellow-400/20" render={
              <a href="/dashboard" />
            }>
              <LayoutDashboard className="size-5 group-data-[active=true]:text-yellow-600 transition-colors text-slate-400" />
              <span className="font-black italic uppercase tracking-tight text-lg">My Playroom</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Learning Worlds" className="h-12 hover:bg-blue-400/10 transition-all group rounded-2xl border-2 border-transparent active:scale-95 hover:border-blue-400/20" render={
              <a href="/dashboard" />
            }>
              <BookOpen className="size-5 group-hover:text-blue-600 transition-colors text-slate-400" />
              <span className="font-black italic uppercase tracking-tight text-lg">Worlds</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Friends Space" className="h-12 hover:bg-pink-400/10 transition-all group rounded-2xl border-2 border-transparent active:scale-95 hover:border-pink-400/20" render={
              <a href="/dashboard" />
            }>
              <Users className="size-5 group-hover:text-pink-600 transition-colors text-slate-400" />
              <span className="font-black italic uppercase tracking-tight text-lg">Friends</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t-4 border-primary/10 bg-muted/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent h-16 rounded-[1.5rem] border-4 border-white bg-white shadow-xl sticker-shadow hover:scale-105 transition-all"
                />
              }>
                <Avatar className="size-10 rounded-xl border-2 border-primary/20">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-black text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                  <span className="truncate font-black tracking-tight text-foreground uppercase italic">{user?.name || "Player One"}</span>
                  <span className="truncate text-[10px] font-black text-primary uppercase italic opacity-80">{user?.role || "STUDENT"}</span>
                </div>
                <ChevronUp className="ml-auto size-5 text-slate-400 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] min-w-64 rounded-[2rem] p-3 bg-white border-4 border-primary/10 shadow-2xl backdrop-blur-xl"
                align="start"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-4 py-3 text-sm font-black uppercase tracking-widest text-slate-400 italic">
                    Hero Profile
                  </DropdownMenuLabel>
                  <DropdownMenuItem render={
                     <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 transition-all text-foreground font-black italic uppercase tracking-tight text-base cursor-pointer" />
                  }>
                       <User className="size-5 text-primary" /> My Identity
                  </DropdownMenuItem>
                  <DropdownMenuItem render={
                     <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-secondary/10 transition-all text-foreground font-black italic uppercase tracking-tight text-base cursor-pointer" />
                  }>
                       <Settings className="size-5 text-secondary" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-primary/10 my-3" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-black italic uppercase tracking-tight text-base cursor-pointer transition-all"
                >
                  <LogOut className="size-5" /> Exit Adventure
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
