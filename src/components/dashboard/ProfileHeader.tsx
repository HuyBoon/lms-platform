"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ShieldCheck, Sparkles, Wand2 } from "lucide-react"

interface ProfileHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    createdAt: Date
    xp?: number
    level?: number
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "HB"

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const isTeacher = user.role === "TEACHER"

  return (
    <div className="relative overflow-hidden rounded-[3rem] border-8 border-white bg-white p-10 sticker-shadow mb-10 group">
      {/* Decorative Background Elements */}
      <div className="absolute -top-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
      <div className="absolute -bottom-10 -left-10 size-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors" />

      <div className="relative flex flex-col md:flex-row items-center gap-10">
        {/* Avatar Section */}
        <div className="relative">
          <div className="size-32 md:size-44 rounded-[2.5rem] bg-slate-50 border-8 border-white sticker-shadow overflow-hidden group-hover:rotate-3 transition-transform cursor-default">
            <Avatar className="size-full rounded-none">
              <AvatarImage src={user.image || undefined} className="object-cover" />
              <AvatarFallback className="text-4xl font-black bg-primary text-primary-foreground italic">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute -bottom-4 -right-4 p-4 bg-white rounded-2xl border-4 border-primary sticker-shadow animate-bounce-subtle">
            {isTeacher ? (
              <Wand2 className="size-8 text-primary shadow-sm" />
            ) : (
              <ShieldCheck className="size-8 text-primary shadow-sm" />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase italic tracking-tight leading-none group-hover:text-primary transition-colors">
                {user.name || "Player One"}
              </h1>
              <Badge className="bg-primary/20 text-primary-foreground border-4 border-white shadow-sm font-black italic uppercase tracking-widest px-4 py-1.5 text-xs rounded-full">
                {isTeacher ? "SAGELY SAGE" : "BRAVE HERO"}
              </Badge>
            </div>
            <p className="text-slate-400 font-bold text-lg italic tracking-wide">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-muted/30 border-4 border-white shadow-sm text-slate-500 font-black italic uppercase tracking-tighter text-sm">
              <CalendarDays className="size-4" />
              Joined {joinedDate}
            </div>
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-secondary/10 border-4 border-white shadow-sm text-secondary font-black italic uppercase tracking-tighter text-sm">
              <Sparkles className="size-4" />
              Level {user.level || 1} • {user.xp || 0} XP Total
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
