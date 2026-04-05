"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Users, Library, Sparkles, ScrollText, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, animate } from "framer-motion"
import { useEffect, useState } from "react"

interface SageStatsProps {
  stats: {
    classesCount: number
    studentsCount: number
    materialsCount: number
    quizzesCount: number
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

export function SageStats({ stats }: SageStatsProps) {
  const statCards = [
    {
      title: "Realms Created",
      value: stats.classesCount,
      icon: LayoutDashboard,
      color: "text-violet-600",
      accent: "bg-violet-500",
      bg: "bg-violet-50",
      border: "border-violet-200",
      label: "Active Worlds"
    },
    {
      title: "Heroes Guided",
      value: stats.studentsCount,
      icon: Users,
      color: "text-amber-600",
      accent: "bg-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      label: "Total Explorers"
    },
    {
      title: "Ancient Wisdom",
      value: stats.materialsCount,
      icon: Library,
      color: "text-indigo-600",
      accent: "bg-indigo-500",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      label: "Lore Capsules"
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
                  <div className="flex gap-1 opacity-40">
                     <ScrollText className="size-4 text-slate-400" />
                     <Wand2 className="size-4 text-slate-400" />
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
               
               <div className="pt-4 flex items-center justify-between border-t-4 border-dashed border-slate-50">
                  <div className="flex items-center gap-2">
                     <Sparkles className={cn("size-4", stat.color)} />
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Sage Wisdom active</span>
                  </div>
                  <div className={cn("size-3 rounded-full animate-ping", stat.accent)} />
               </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
