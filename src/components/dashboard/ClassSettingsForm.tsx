"use client"

import { useState } from "react"
import { updateClassroom, deleteClassroom } from "@/lib/actions/classroom"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, Trash2, Wand2, Sparkles, Loader2 } from "lucide-react"

interface ClassSettingsFormProps {
  classroom: {
    id: string
    name: string
    description?: string | null
  }
}

export function ClassSettingsForm({ classroom }: ClassSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [name, setName] = useState(classroom.name)
  const [description, setDescription] = useState(classroom.description || "")

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return toast.error("Your World must have a Title, Sage!")

    setLoading(true)
    const result = await updateClassroom(classroom.id, { name, description })

    if (result.error) {
       toast.error(result.error)
    } else {
       toast.success("The Laws of the Realm have been updated!")
       router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("⚠️ PERILOUS ACTION: Are you absolutely certain you wish to collapse this world and purge all history within it?")) return

    setDeleting(true)
    const result = await deleteClassroom(classroom.id)

    if (result.error) {
       toast.error(result.error)
       setDeleting(false)
    } else {
       toast.success("The World has collapsed into the void.")
       router.push("/")
       router.refresh()
    }
  }

  return (
    <div className="space-y-12">
        <form onSubmit={handleUpdate} className="space-y-10">
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">World Designation</label>
                <div className="relative group">
                    <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 bg-slate-50 border-4 border-slate-100 focus:border-primary px-8 text-lg font-black italic rounded-2xl placeholder:opacity-30 sticker-shadow-sm"
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 size-6 text-slate-200 group-focus-within:text-primary transition-colors" />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">The Realm's Lore (Description)</label>
                <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="bg-slate-50 border-4 border-slate-100 focus:border-primary p-8 text-lg font-bold italic rounded-[2rem] placeholder:opacity-30 sticker-shadow-sm"
                    placeholder="Describe the trials and wonders that await in this world..."
                />
            </div>

            <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 rounded-[2rem] font-black italic uppercase text-xl gap-3 sticker-shadow bouncy-hover bg-primary shadow-[6px_6px_0px_0px_#B89600]"
            >
                {loading ? <Loader2 className="size-7 animate-spin" /> : <Save className="size-7" />}
                {loading ? "Re-forging..." : "UPDATE WORLD LAWS 🪄"}
            </Button>
        </form>

        <div className="pt-12 border-t-4 border-slate-100 border-dashed space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-2xl border-2 border-red-200">
                    <Trash2 className="size-8 text-red-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-red-500">The Void Portal</h3>
                    <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">Permanent realm collapse</p>
                </div>
            </div>

            <div className="p-8 bg-red-50 rounded-[2rem] border-4 border-red-100 border-dashed flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-1">
                    <p className="text-lg font-black italic text-red-600 uppercase">Warning, Sage!</p>
                    <p className="text-red-400 font-bold italic">Collapsing this world will purge all quests, lore, and hero history within it. This action is irreversible.</p>
                </div>
                <Button 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="h-14 px-8 rounded-2xl bg-red-500 text-white font-black italic uppercase tracking-widest sticker-shadow bouncy-hover border-4 border-red-600 flex items-center gap-3 active:scale-95 transition-all shadow-[4px_4px_0px_0px_#991B1B]"
                >
                    {deleting ? <Loader2 className="size-5 animate-spin" /> : <Trash2 className="size-5" />}
                    Collapse Realm
                </Button>
            </div>
        </div>
    </div>
  )
}
