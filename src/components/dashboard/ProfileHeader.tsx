"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ShieldCheck, Sparkles, Wand2, Trophy, Crown } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { getLevelTitle } from "@/lib/gamification"

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
  awardsCount?: number
}

export function ProfileHeader({ user, awardsCount = 0 }: ProfileHeaderProps) {
  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "HB"

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const isTeacher = user.role === "TEACHER"
  
  // XP Calculations
  const level = user?.level || 1
  const xp = user?.xp || 0
  const currentLevelTotalXp = 50 * level * (level - 1)
  const nextLevelTotalXp = 50 * (level + 1) * level
  const xpInCurrentLevel = xp - currentLevelTotalXp
  const xpRequiredForNextLevel = nextLevelTotalXp - currentLevelTotalXp
  const progress = Math.min(Math.max((xpInCurrentLevel / xpRequiredForNextLevel) * 100, 0), 100)

  // Theme Config
  const theme = isTeacher 
    ? {
        primary: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-200",
        accent: "text-amber-500",
        accentBg: "bg-amber-50",
        icon: Wand2,
        role: "VENERABLE SAGE",
        rank: getLevelTitle(level)
      }
    : {
        primary: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20",
        accent: "text-secondary",
        accentBg: "bg-secondary/10",
        icon: ShieldCheck,
        role: "BRAVE HERO",
        rank: getLevelTitle(level)
      }

  return (
    <div className="relative overflow-hidden rounded-[4rem] border-8 border-white bg-white p-8 md:p-14 sticker-shadow mb-10 group">
      {/* Decorative Background Elements */}
      <div className={cn("absolute -top-10 -right-10 size-60 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity", isTeacher ? "bg-violet-400" : "bg-primary")} />
      <div className={cn("absolute -bottom-10 -left-10 size-60 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity", isTeacher ? "bg-amber-400" : "bg-secondary")} />

      <div className="relative flex flex-col lg:flex-row items-center gap-12">
        {/* Avatar & Level Orb */}
        <div className="relative">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="size-40 md:size-56 rounded-[3rem] bg-slate-50 border-8 border-white sticker-shadow overflow-hidden cursor-default z-10 relative"
          >
            <Avatar className="size-full rounded-none">
              <AvatarImage src={user.image || undefined} className="object-cover" />
              <AvatarFallback className="text-6xl font-black bg-primary text-primary-foreground italic">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-6 -right-6 p-6 bg-white rounded-3xl border-4 border-primary sticker-shadow z-20"
          >
            <theme.icon className={cn("size-10 shadow-sm", theme.primary)} />
          </motion.div>

          <div className="absolute -top-4 -left-4 px-4 py-2 bg-foreground text-white rounded-2xl font-black italic uppercase text-xs sticker-shadow-sm z-20">
            LVL {level}
          </div>
        </div>

        {/* Identity & Progress */}
        <div className="flex-1 text-center lg:text-left space-y-8 w-full">
          <div className="space-y-3">
             <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                <motion.h1 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-5xl md:text-7xl font-black text-foreground uppercase italic tracking-tighter leading-none"
                >
                  {user.name || "Player One"}
                </motion.h1>
                <div className="flex gap-2">
                   <Badge className="bg-foreground text-white border-4 border-white shadow-sm font-black italic uppercase tracking-widest px-4 py-2 text-[10px] rounded-full">
                     {theme.role}
                   </Badge>
                   <Badge className={cn("border-4 border-white shadow-sm font-black italic uppercase tracking-widest px-4 py-2 text-[10px] rounded-full", theme.bg, theme.primary)}>
                     {theme.rank}
                   </Badge>
                </div>
             </div>
             <p className="text-slate-400 font-bold text-xl italic tracking-wide lowercase">{user.email}</p>
          </div>

          {/* Epic Progress Bar */}
          <div className="space-y-4">
             <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Experience Points</span>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-foreground italic">{Math.round(xpInCurrentLevel)}</span>
                      <span className="text-slate-300 font-black italic uppercase text-sm">/ {xpRequiredForNextLevel} XP</span>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Next Milestone</span>
                   <span className="text-sm font-black text-slate-400 italic uppercase">Level {level + 1}</span>
                </div>
             </div>
             
             <div className="relative h-8 w-full bg-slate-100 rounded-full border-4 border-white shadow-inner overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={cn("h-full rounded-full sticker-shadow-sm relative", isTeacher ? "bg-violet-500" : "bg-primary")}
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
                   {progress > 10 && (
                     <Sparkles className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-white/50 animate-pulse" />
                   )}
                </motion.div>
                
                {/* Milestone Ticks */}
                <div className="absolute inset-0 flex justify-around items-center opacity-20">
                   {[...Array(4)].map((_, i) => (
                     <div key={i} className="h-4 w-1 bg-slate-400 rounded-full" />
                   ))}
                </div>
             </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-[1.5rem] bg-white border-4 border-slate-50 sticker-shadow-sm text-slate-500 font-black italic uppercase tracking-tighter text-xs">
              <CalendarDays className="size-5 text-blue-400" />
              Sojourning since {joinedDate}
            </div>
            {!isTeacher && (
              <div className="flex items-center gap-3 px-6 py-3 rounded-[1.5rem] bg-amber-50 border-4 border-white sticker-shadow-sm text-amber-600 font-black italic uppercase tracking-tighter text-xs">
                <Trophy className="size-5 text-amber-500" />
                {awardsCount} Relics Earned
              </div>
            )}
            {isTeacher && (
              <div className="flex items-center gap-3 px-6 py-3 rounded-[1.5rem] bg-violet-50 border-4 border-white sticker-shadow-sm text-violet-600 font-black italic uppercase tracking-tighter text-xs">
                <Crown className="size-5 text-violet-500" />
                World Creator elite
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
