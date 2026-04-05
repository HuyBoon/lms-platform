"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Trophy, Zap, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroStatsProps {
  stats: {
    classesCount: number
    quizzesCount: number
    avgScore: number
    totalPoints?: number
  }
}

export function HeroStats({ stats }: HeroStatsProps) {
  const statCards = [
    {
      title: "Worlds Explored",
      value: stats.classesCount,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "Classes Joined"
    },
    {
      title: "Victory Quests",
      value: stats.quizzesCount,
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      label: "Completed Quizzes"
    },
    {
      title: "Magic Power",
      value: `${stats.avgScore.toFixed(0)}%`,
      icon: Zap,
      color: "text-pink-500",
      bg: "bg-pink-50",
      border: "border-pink-200",
      label: "Average Success"
    }
  ]

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {statCards.map((stat, i) => (
        <Card key={stat.title} className={cn("bg-white border-4 rounded-[2.5rem] sticker-shadow overflow-hidden group hover:scale-[1.03] transition-all", stat.border)}>
          <CardHeader className="p-8 pb-4">
             <div className="flex items-center justify-between mb-2">
                <div className={cn("p-4 rounded-2xl border-4 border-white shadow-sm rotate-[-4deg] group-hover:rotate-0 transition-transform", stat.bg)}>
                   <stat.icon className={cn("size-6", stat.color)} />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">HERO_METRIC_{i+1}</span>
             </div>
             <CardTitle className="text-xl font-black text-foreground uppercase italic tracking-tight">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
             <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-foreground italic drop-shadow-sm">{stat.value}</span>
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{stat.label}</span>
             </div>
             
             {/* Simple Progress Bar Decoration */}
             <div className="mt-6 w-full h-3 bg-muted rounded-full border-2 border-white shadow-inner overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text-', 'bg-'))}
                  style={{ width: stat.title === "Magic Power" ? stat.value : `${Math.min(stats.classesCount * 20, 100)}%` }}
                />
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
