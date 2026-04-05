"use client"

import { useState } from "react"
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react"
import { absorbMaterialLore } from "@/lib/actions/material"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface LoreAbsorberProps {
  materialId: string
  isAbsorbed: boolean
}

export function LoreAbsorber({ materialId, isAbsorbed: initialIsAbsorbed }: LoreAbsorberProps) {
  const [isAbsorbed, setIsAbsorbed] = useState(initialIsAbsorbed)
  const [isLoading, setIsLoading] = useState(false)

  const handleAbsorb = async () => {
    if (isAbsorbed || isLoading) return
    setIsLoading(true)
    try {
      const result = await absorbMaterialLore(materialId)
      if (result.success) {
        setIsAbsorbed(true)
        toast.success(`Lore Absorbed! +20 XP`, {
          description: "Your Hero Identity has been enriched.",
          icon: <Sparkles className="size-4 text-yellow-500" />,
        })
      } else {
        toast.error(result.error || "Failed to absorb lore")
      }
    } catch (error) {
      toast.error("World connection failed. Try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isAbsorbed) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-black italic uppercase tracking-widest text-[10px] border-4 border-white sticker-shadow-sm pointer-events-none">
        <CheckCircle2 className="size-4" />
        Lore Mastered
      </div>
    )
  }

  return (
    <button
      onClick={handleAbsorb}
      disabled={isLoading}
      className={cn(
        "group/absorb flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-black italic uppercase tracking-[0.2em] text-[10px] border-4 border-white sticker-shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer overflow-hidden relative",
        isLoading && "animate-pulse"
      )}
    >
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/absorb:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4 animate-pulse group-hover/absorb:scale-125 transition-transform" />
      )}
      <span className="relative z-10">Absorb Lore</span>
    </button>
  )
}
