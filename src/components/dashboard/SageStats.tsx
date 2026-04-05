"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Users, Library, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SageStatsProps {
  stats: {
    classesCount: number
    studentsCount: number
    materialsCount: number
    quizzesCount: number
  }
}

export function SageStats({ stats }: SageStatsProps) {
  const statCards = [
    {
      title: "Worlds Created",
      value: stats.classesCount,
      icon: LayoutDashboard,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      label: "Active Classes"
    },
    {
      title: "Explorers Guided",
      value: stats.studentsCount,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      label: "Total Students"
    },
    {
      title: "Wisdom Shared",
      value: stats.materialsCount,
      icon: Library,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      label: "Materials Added"
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
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">SAGE_METRIC_{i+1}</span>
             </div>
             <CardTitle className="text-xl font-black text-foreground uppercase italic tracking-tight">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
             <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-foreground italic drop-shadow-sm">{stat.value}</span>
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{stat.label}</span>
             </div>
             
             {/* Decorative Element */}
             <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter opacity-50">
                <BarChart3 className="size-3" />
                Live Sage Insights Active
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
