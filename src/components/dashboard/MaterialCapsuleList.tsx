"use client"

import { useState } from "react"
import { deleteMaterial } from "@/lib/actions/material"
import { Button } from "@/components/ui/button"
import { ScrollText, Globe, Play, Trash2, ExternalLink, Sparkles, Wand2, Edit3 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { LoreAbsorber } from "./LoreAbsorber"

interface Material {
  id: string
  title: string
  fileUrl: string
  chapterSession: string | null
  loreViews?: any[]
}

interface MaterialCapsuleListProps {
  materials: Material[]
  classId: string
  isTeacher?: boolean
  onEdit?: (material: Material) => void
}

const TYPE_CONFIG: any = {
  SCROLL: { icon: ScrollText, color: "bg-amber-100 text-amber-600 border-amber-400 shadow-[4px_4px_0px_0px_#B38B00]" },
  ORB: { icon: Play, color: "bg-blue-100 text-blue-600 border-blue-400 shadow-[4px_4px_0px_0px_#006096]" },
  PORTAL: { icon: Globe, color: "bg-emerald-100 text-emerald-600 border-emerald-400 shadow-[4px_4px_0px_0px_#007F3D]" },
  DEFAULT: { icon: Wand2, color: "bg-slate-100 text-slate-600 border-slate-400 shadow-[4px_4px_0px_0px_#64748b]" }
}

export function MaterialCapsuleList({ materials, classId, isTeacher = false, onEdit }: MaterialCapsuleListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to transmute this capsule back into energy?")) return
    setLoadingId(id)
    const result = await deleteMaterial(id, classId)
    if (result.error) {
      toast.error(result.error)
      setLoadingId(null)
    } else {
      toast.success("Capsule transmuted successfully!")
    }
  }

  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-8 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30 text-center space-y-6">
         <div className="p-8 bg-white rounded-full border-4 border-slate-100 sticker-shadow-sm opacity-50">
            <Wand2 className="size-20 text-slate-200" />
         </div>
         <div className="space-y-2">
            <p className="text-3xl font-black uppercase text-slate-300 italic tracking-tight">No Capsules Materialized</p>
            <p className="text-slate-400 font-bold italic">Add new lore and scrolls to populate this world!</p>
         </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {materials.map((material) => {
        const type = (material.chapterSession || "DEFAULT") as string
        const config = TYPE_CONFIG[type] || TYPE_CONFIG.DEFAULT
        const Icon = config.icon

        return (
          <div 
            key={material.id} 
            className={cn(
              "group relative p-6 rounded-[2.5rem] bg-white border-4 border-white sticker-shadow bouncy-hover transition-all",
              "hover:translate-y-[-4px]"
            )}
          >
            <div className="space-y-6">
               <div className="flex items-start justify-between">
                  <div className={cn("p-4 rounded-2xl border-4 text-white rotate-[-5deg] group-hover:rotate-0 transition-transform", config.color)}>
                     <Icon className="size-8 stroke-[3]" />
                  </div>
                  {isTeacher && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit?.(material)}
                        className="size-10 rounded-xl text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors border-2 border-transparent hover:border-primary/10"
                      >
                        <Edit3 className="size-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(material.id)}
                        disabled={loadingId === material.id}
                        className="size-10 rounded-xl text-slate-300 hover:text-destructive hover:bg-destructive/5 transition-colors border-2 border-transparent hover:border-destructive/10"
                      >
                        <Trash2 className="size-5" />
                      </Button>
                    </div>
                  )}
               </div>

               <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                    {type} CAPSULE
                  </span>
                  <h4 className="text-xl font-black italic uppercase text-foreground leading-tight truncate">
                    {material.title}
                  </h4>
               </div>

               <div className="flex items-center justify-between gap-4 mt-auto">
                 <a 
                   href={material.fileUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={cn(
                     "flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl font-black italic uppercase text-[10px] border-4 border-slate-50 bg-slate-50 text-slate-500 hover:bg-white hover:border-primary hover:text-primary transition-all active:scale-95 group/btn"
                   )}
                 >
                    Enter Realm
                    <ExternalLink className="size-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                 </a>
                  {!isTeacher && (
                    <LoreAbsorber 
                      materialId={material.id} 
                      isAbsorbed={!!(material.loreViews && material.loreViews.length > 0)} 
                    />
                  )}
               </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
