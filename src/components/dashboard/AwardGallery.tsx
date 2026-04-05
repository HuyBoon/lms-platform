"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Medal, Star, Trophy, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Award {
  id: string
  title: string
  description: string
  type: "GOLD" | "SILVER" | "BRONZE" | "SPECIAL"
  date: string
}

interface AwardGalleryProps {
  awards: Award[]
}

export function AwardGallery({ awards }: AwardGalleryProps) {
  const getAwardIcon = (type: string) => {
    switch (type) {
      case "GOLD": return { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" }
      case "SILVER": return { icon: Medal, color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" }
      case "BRONZE": return { icon: Medal, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" }
      default: return { icon: Star, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" }
    }
  }

  return (
    <Card className="bg-white border-8 border-white rounded-[3rem] sticker-shadow overflow-hidden group">
      <CardHeader className="p-10 pb-6 border-b-4 border-dashed border-muted flex flex-row items-center justify-between">
        <div>
           <CardTitle className="text-3xl font-black text-foreground uppercase italic tracking-tight flex items-center gap-3">
              <Sparkles className="size-8 text-primary animate-pulse" />
              Hero Honor Gallery
           </CardTitle>
           <p className="text-slate-400 font-bold italic text-sm mt-1 uppercase tracking-widest leading-none">Your Legendary Achievements</p>
        </div>
        <div className="bg-muted px-6 py-2 rounded-2xl border-4 border-white shadow-sm font-black italic uppercase tracking-tighter text-xs text-slate-400">
           {awards.length} Medals Earned
        </div>
      </CardHeader>
      <CardContent className="p-10">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award) => {
            const style = getAwardIcon(award.type)
            return (
              <div 
                key={award.id} 
                className={cn(
                  "relative group/award p-6 rounded-[2rem] border-4 transition-all hover:scale-[1.05] active:scale-95 sticker-shadow",
                  style.bg,
                  style.border
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border-2 border-dashed border-muted rotate-[-6deg] group-hover/award:rotate-0 transition-transform">
                    <style.icon className={cn("size-10", style.color)} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-foreground uppercase italic leading-none">{award.title}</h4>
                    <p className="text-slate-400 font-bold text-[10px] mt-1 uppercase tracking-widest">{award.description}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-4 text-slate-300 font-black italic text-[8px] uppercase">
                   {award.date}
                </div>
              </div>
            )
          })}
          
          {awards.length === 0 && (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-muted rounded-[2.5rem] bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
               <Trophy className="size-16 text-slate-200" />
               <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-lg italic">The Adventure Starts Now!</p>
               <p className="text-slate-300 font-bold italic text-xs uppercase tracking-widest leading-none">Complete Quests to earn your first Medals</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
