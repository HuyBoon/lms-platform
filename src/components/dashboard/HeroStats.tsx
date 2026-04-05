"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Trophy, Zap, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useSpring, useTransform, animate } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface HeroStatsProps {
  stats: {
    classesCount: number
    quizzesCount: number
    avgScore: number
    xp?: number
    level?: number
  }
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    })
    return () => controls.stop()
  }, [value])

  return <>{displayValue}</>
}

export function HeroStats({ stats }: HeroStatsProps) {
  const level = stats.level || 1
  const xp = stats.xp || 0
  const currentLevelTotalXp = 50 * level * (level - 1)
  const nextLevelTotalXp = 50 * (level + 1) * level
  const xpInCurrentLevel = xp - currentLevelTotalXp
  const xpRequiredForNextLevel = nextLevelTotalXp - currentLevelTotalXp
  const progressPercent = Math.min(Math.max((xpInCurrentLevel / xpRequiredForNextLevel) * 100, 0), 100)

  const statCards = [
    {
      title: "Worlds Explored",
      value: stats.classesCount,
      icon: BookOpen,
      color: "text-blue-500",
      accent: "bg-blue-400",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "Classes Joined",
      progress: Math.min(stats.classesCount * 20, 100)
    },
    {
      title: "Victory Quests",
      value: stats.quizzesCount,
      icon: Trophy,
      color: "text-yellow-600",
      accent: "bg-yellow-500",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      label: "Completed Quizzes",
      progress: Math.min(stats.quizzesCount * 10, 100)
    },
    {
      title: "Legendary XP",
      value: Math.round(xpInCurrentLevel),
      icon: Zap,
      color: "text-pink-500",
      accent: "bg-pink-400",
      bg: "bg-pink-50",
      border: "border-pink-200",
      label: `Towards Level ${level + 1}`,
      progress: progressPercent
    }
  ]

  return (
    <div className="grid gap-10 md:grid-cols-3">
      {statCards.map((stat, i) => (
        <motion.div
           key={stat.title}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.1 }}
        >
          <Card className={cn(
            "bg-white border-8 border-white rounded-[3.5rem] sticker-shadow overflow-hidden group hover:translate-y-[-8px] transition-all duration-300 relative",
            "after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/40 after:to-transparent after:pointer-events-none"
          )}>
            <CardHeader className="p-10 pb-4">
               <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-4 rounded-2xl border-4 border-white shadow-xl rotate-[-8deg] group-hover:rotate-0 transition-transform duration-500", stat.bg)}>
                     <stat.icon className={cn("size-8", stat.color)} />
                  </div>
                  <div className="flex gap-1">
                     <Star className="size-3 text-yellow-400 fill-yellow-400" />
                     <Star className="size-3 text-yellow-400 fill-yellow-400" />
                     <Star className="size-3 text-yellow-400 fill-yellow-400 opacity-30" />
                  </div>
               </div>
               <CardTitle className="text-2xl font-black text-foreground uppercase italic tracking-tighter leading-none">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-6">
               <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-foreground italic drop-shadow-md">
                    <AnimatedNumber value={stat.value} />
                  </span>
                  <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic opacity-60">{stat.label}</span>
               </div>
               
               <div className="relative">
                  <div className="w-full h-5 bg-slate-50 rounded-full border-4 border-white shadow-inner overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${stat.progress}%` }}
                       transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                       className={cn("h-full rounded-full sticker-shadow-sm", stat.accent)}
                     />
                  </div>
                  {stat.progress >= 90 && (
                    <Sparkles className="absolute -right-2 -top-2 size-5 text-yellow-400 animate-bounce" />
                  )}
               </div>

               <div className="pt-2 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 italic">PlayHub Protocol v1.2</span>
                  <div className={cn("size-2 rounded-full animate-pulse", stat.accent)} />
               </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
