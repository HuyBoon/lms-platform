"use client"

import { WorldCard } from "./WorldCard"
import { Sparkles, Globe2 } from "lucide-react"

interface WorldGalleryProps {
  worlds: any[]
}

export function WorldGallery({ worlds }: WorldGalleryProps) {
  if (worlds.length === 0) {
    return (
      <div className="col-span-full py-32 flex flex-col items-center justify-center border-8 border-dashed border-muted rounded-[4rem] bg-white/30 space-y-10 group">
         <div className="relative">
            <div className="p-12 bg-white rounded-full shadow-2xl border-8 border-primary animate-bounce-subtle sticker-shadow">
               <Globe2 className="size-32 text-slate-200 opacity-50 group-hover:text-primary transition-colors" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 size-16 text-yellow-500 animate-pulse" />
         </div>
         <div className="text-center space-y-4">
            <p className="text-4xl font-black uppercase tracking-tight text-slate-400 italic leading-none">All Worlds Explored!</p>
            <p className="text-slate-400 font-bold italic text-xl uppercase tracking-widest">You have joined every adventure currently known. Wait for deeper lore!</p>
         </div>
      </div>
    )
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {worlds.map((world, i) => (
        <WorldCard key={world.id} world={world} index={i} />
      ))}
    </div>
  )
}
