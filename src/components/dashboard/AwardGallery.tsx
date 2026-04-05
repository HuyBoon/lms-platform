"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Medal, Star, Trophy, Sparkles, Award as AwardIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
  const getAwardStyle = (type: string) => {
    switch (type) {
      case "GOLD": return { 
        icon: Trophy, 
        color: "text-amber-500", 
        bg: "bg-amber-50", 
        border: "border-amber-200",
        shadow: "shadow-[8px_8px_0px_0px_rgba(245,158,11,0.2)]",
        holo: "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-white/0 after:via-white/40 after:to-white/0 after:animate-shimmer overflow-hidden"
      }
      case "SILVER": return { 
        icon: Medal, 
        color: "text-slate-400", 
        bg: "bg-slate-50", 
        border: "border-slate-200",
        shadow: "shadow-[8px_8px_0px_0px_rgba(148,163,184,0.2)]",
        holo: ""
      }
      case "BRONZE": return { 
        icon: Medal, 
        color: "text-orange-500", 
        bg: "bg-orange-50", 
        border: "border-orange-200",
        shadow: "shadow-[8px_8px_0px_0px_rgba(249,115,22,0.2)]",
        holo: ""
      }
      default: return { 
        icon: Star, 
        color: "text-primary", 
        bg: "bg-primary/5", 
        border: "border-primary/20",
        shadow: "shadow-[8px_8px_0px_0px_rgba(var(--primary),0.1)]",
        holo: ""
      }
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    show: { scale: 1, opacity: 1, rotate: 0 }
  }

  return (
    <Card className="bg-white border-8 border-white rounded-[4rem] sticker-shadow overflow-hidden group">
      <CardHeader className="p-10 pb-8 border-b-8 border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
           <CardTitle className="text-4xl font-black text-foreground uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-primary rounded-2xl border-4 border-white sticker-shadow-sm rotate-[-10deg] group-hover:rotate-0 transition-transform">
                <AwardIcon className="size-8 text-white" />
              </div>
              Hero Honor Vault
           </CardTitle>
           <p className="text-slate-400 font-black italic text-sm mt-2 uppercase tracking-[0.2em] leading-none opacity-60">Legendary achievements materialized</p>
        </div>
        <div className="bg-slate-50 px-8 py-3 rounded-full border-4 border-white shadow-inner font-black italic uppercase tracking-widest text-sm text-slate-400">
           {awards.length} Medals Collected
        </div>
      </CardHeader>
      
      <CardContent className="p-10 md:p-14 bg-slate-50/30">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {awards.map((award, i) => {
            const style = getAwardStyle(award.type)
            return (
              <motion.div 
                key={award.id} 
                variants={item}
                whileHover={{ y: -10, rotate: i % 2 === 0 ? -2 : 2 }}
                className={cn(
                  "relative group/award p-8 rounded-[2.5rem] border-8 border-white transition-all bg-white cursor-help",
                  style.shadow,
                  style.holo
                )}
              >
                <div className="space-y-6 flex flex-col items-center text-center">
                  <div className={cn("p-6 rounded-[2rem] border-4 border-white shadow-xl rotate-[-12deg] group-hover/award:rotate-0 transition-transform duration-500", style.bg)}>
                    <style.icon className={cn("size-12", style.color)} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-foreground uppercase italic leading-none truncate w-full px-2">{award.title}</h4>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-tight">{award.description}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-6 text-slate-200 font-black italic text-[9px] uppercase tracking-tighter">
                   {award.date}
                </div>
                
                {/* Sticker Peel Effect Corner */}
                <div className="absolute bottom-0 right-0 size-8 bg-slate-100 rounded-tl-xl border-t-4 border-l-4 border-white opacity-0 group-hover/award:opacity-100 transition-opacity" />
              </motion.div>
            )
          })}
          
          {awards.length === 0 && (
            <div className="col-span-full py-28 text-center border-8 border-dashed border-slate-100 rounded-[3.5rem] bg-white space-y-8">
               <div className="p-10 bg-slate-50 rounded-full w-fit mx-auto border-4 border-slate-100 animate-pulse">
                  <Trophy className="size-24 text-slate-200" />
               </div>
               <div className="space-y-2">
                  <p className="text-4xl font-black uppercase tracking-tight text-slate-300 italic leading-none">Acknowledge Your Destiny!</p>
                  <p className="text-slate-400 font-bold italic text-sm uppercase tracking-[0.3em]">Complete Quests to manifest your first Medal stickers</p>
               </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
