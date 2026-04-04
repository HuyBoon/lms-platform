import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Download, Trash2, Search, Filter } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function MaterialsPage({
  params
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const session = await auth()
  const user = session?.user

  const classroom = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      materials: {
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!classroom) return <div className="p-8 text-center text-slate-500 font-black uppercase italic">Neural Network Disconnected</div>

  return (
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-2xl shadow-lg border-4 border-white rotate-2">
              <FileText className="size-8 text-secondary-foreground" />
            </div>
            Treasure Chest
          </h2>
          <p className="text-slate-500 font-bold text-lg italic uppercase tracking-wider ml-1">
             Collect your magic maps and secret scrolls for <span className="text-secondary font-black italic">{classroom.name}</span>!
          </p>
        </div>
        {user?.role === "TEACHER" && (
          <button className={cn(buttonVariants({ size: "lg" }), "rounded-[2rem] h-14 px-8 font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_#B3125C] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bouncy-hover bg-secondary")}>
            <Plus className="size-6 text-white" />
            Hide New Treasure
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-8 bg-white p-3 rounded-[2rem] border-4 border-muted sticker-shadow">
         <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Treasure Maps..." 
              className="w-full h-12 bg-transparent pl-14 pr-6 text-lg font-bold text-foreground placeholder:text-slate-300 focus:outline-none"
            />
         </div>
         <button className="h-12 px-6 rounded-2xl border-4 border-muted bg-muted/20 text-slate-500 hover:bg-muted/40 transition-all flex items-center gap-2 text-sm font-black uppercase tracking-widest bouncy-hover">
            <Filter className="size-5" /> Filter
         </button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {classroom.materials.map((m: any, index: number) => {
          const colors = [
            { bg: "bg-blue-400/10", border: "border-blue-400", meta: "text-blue-600" },
            { bg: "bg-pink-400/10", border: "border-pink-400", meta: "text-pink-600" },
            { bg: "bg-green-400/10", border: "border-green-400", meta: "text-green-600" },
            { bg: "bg-yellow-400/10", border: "border-yellow-400", meta: "text-yellow-600" },
          ]
          const color = colors[index % colors.length]
          
          return (
            <Card key={m.id} className={cn("group overflow-hidden border-4 bg-white transition-all bouncy-hover sticker-shadow p-0 flex flex-col", color.border)}>
              <CardHeader className="p-8">
                <div className="flex items-start justify-between">
                   <div className={cn("size-14 rounded-2xl border-4 flex items-center justify-center group-hover:rotate-12 transition-transform", color.bg, color.border)}>
                      <FileText className={cn("size-8", color.meta)} />
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="p-3 text-slate-300 hover:text-blue-500 transition-all bouncy-hover bg-muted/20 rounded-xl">
                         <Download className="size-6" />
                      </button>
                      {user?.role === "TEACHER" && (
                        <button className="p-3 text-slate-300 hover:text-destructive transition-all bouncy-hover bg-muted/20 rounded-xl">
                           <Trash2 className="size-6" />
                        </button>
                      )}
                   </div>
                </div>
                <div className="mt-6 space-y-2">
                   <CardTitle className="text-2xl font-black text-foreground uppercase italic tracking-tight truncate group-hover:text-primary transition-colors">{m.title}</CardTitle>
                   <CardDescription className={cn("text-xs font-black uppercase tracking-widest flex items-center gap-2 italic", color.meta)}>
                      {m.type || "Magic Map"} • {new Date(m.createdAt).toLocaleDateString()}
                   </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )
        })}
        {classroom.materials.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-4 border-dashed border-muted rounded-[3rem] bg-white/30 space-y-6">
             <div className="p-8 bg-muted/20 rounded-full animate-bounce-subtle">
                <FileText className="size-24 text-slate-300 opacity-50" />
             </div>
             <div className="text-center space-y-2">
                <p className="text-2xl font-black uppercase tracking-tight text-slate-400 italic">No Treasures Hidden Yet</p>
                <p className="text-slate-400 font-bold italic">Check back later for new scrolls!</p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
