import { useState, useEffect } from "react"
import { addMaterial, updateMaterial } from "@/lib/actions/material"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollText, Globe, Play, Sparkles, Wand2, Plus, X, Save } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Material {
  id: string
  title: string
  fileUrl: string
  chapterSession: string | null
}

interface MaterialCapsuleFormProps {
  classId: string
  editingMaterial?: Material | null
  onCancelEdit?: () => void
}

type CapsuleType = "SCROLL" | "ORB" | "PORTAL"

const CAPSULE_TYPES = [
  { id: "SCROLL", name: "SCROLL", desc: "PDF & Archives", icon: ScrollText, color: "bg-amber-400", border: "border-amber-500", shadow: "shadow-[6px_6px_0px_0px_#B38B00]" },
  { id: "ORB", name: "ORB", desc: "Magic Visuals", icon: Play, color: "bg-blue-400", border: "border-blue-500", shadow: "shadow-[6px_6px_0px_0px_#006096]" },
  { id: "PORTAL", name: "PORTAL", desc: "Web Realms", icon: Globe, color: "bg-emerald-400", border: "border-emerald-500", shadow: "shadow-[6px_6px_0px_0px_#007F3D]" },
]

export function MaterialCapsuleForm({ classId, editingMaterial, onCancelEdit }: MaterialCapsuleFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<CapsuleType>("SCROLL")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (editingMaterial) {
      setTitle(editingMaterial.title)
      setUrl(editingMaterial.fileUrl)
      setSelectedType((editingMaterial.chapterSession as CapsuleType) || "SCROLL")
    } else {
      setTitle("")
      setUrl("")
      setSelectedType("SCROLL")
    }
  }, [editingMaterial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return toast.error("Your Capsule needs a name and a destination!")

    setLoading(true)
    
    const payload = {
      title,
      fileUrl: url,
      classId,
      chapterSession: selectedType
    }

    const result = editingMaterial 
      ? await updateMaterial(editingMaterial.id, payload)
      : await addMaterial(payload)

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success(editingMaterial ? "Huzzah! The Lore has been refined!" : "Huzzah! The Capsule has materialized!")
      if (!editingMaterial) {
        setTitle("")
        setUrl("")
      }
      setLoading(false)
      if (onCancelEdit) onCancelEdit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic">1. Choose Capsule Archetype</h3>
           {editingMaterial && (
              <button 
                type="button" 
                onClick={onCancelEdit}
                className="flex items-center gap-2 text-xs font-black uppercase italic text-red-500 hover:scale-105 transition-transform"
              >
                 <X className="size-4" /> Cancel Refinement
              </button>
           )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CAPSULE_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id as CapsuleType)}
              className={cn(
                "group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-4 transition-all bouncy-hover",
                type.border,
                selectedType === type.id 
                  ? `${type.color} text-white ${type.shadow} scale-105` 
                  : "bg-white text-slate-300 border-dashed hover:border-solid hover:text-slate-400"
              )}
            >
              <div className={cn(
                "p-4 rounded-2xl border-4 mb-4 transition-transform group-hover:rotate-12",
                selectedType === type.id ? "bg-white/20 border-white/40" : "bg-slate-50 border-slate-100"
              )}>
                <type.icon className="size-10 stroke-[3]" />
              </div>
              <span className="text-xl font-black italic uppercase tracking-tight leading-none mb-1">{type.name}</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest italic opacity-60",
                selectedType === type.id ? "text-white" : "text-slate-400"
              )}>{type.desc}</span>
              {selectedType === type.id && (
                <Sparkles className="absolute -top-3 -right-3 size-8 text-yellow-300 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic ml-2">2. Infuse with Power</h3>
        <div className={cn(
          "p-10 bg-white border-4 border-slate-100 rounded-[3rem] sticker-shadow space-y-8 transition-all",
          editingMaterial && "border-primary/20 bg-primary/5"
        )}>
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">Capsule Designation</label>
              <div className="relative group">
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Secret Lore of JavaScript v1.2"
                  className="h-14 bg-white border-4 border-slate-50 focus:border-primary px-8 text-lg font-black italic rounded-2xl placeholder:opacity-30"
                />
                <Wand2 className="absolute right-4 top-1/2 -translate-y-1/2 size-6 text-slate-200 group-focus-within:text-primary transition-colors" />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">Source Destination (URL)</label>
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://magic-archives.com/lore.pdf"
                className="h-14 bg-white border-4 border-slate-50 focus:border-primary px-8 text-lg font-bold italic rounded-2xl placeholder:opacity-30"
              />
           </div>

           <Button 
            type="submit" 
            disabled={loading}
            className={cn(
              "w-full h-16 rounded-[2rem] font-black italic uppercase text-xl gap-3 sticker-shadow bouncy-hover shadow-[6px_6px_0px_0px_#B89600]",
              editingMaterial ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-700" : "bg-primary"
            )}
           >
              {editingMaterial ? <Save className="size-7" /> : <Plus className="size-7" />}
              {loading 
                ? (editingMaterial ? "Refining..." : "Materializing...") 
                : (editingMaterial ? "UPDATE LORE CAPSULE 🪄" : "CAST MATERIAL CAPSULE 🪄")
              }
           </Button>
        </div>
      </div>
    </form>
  )
}
