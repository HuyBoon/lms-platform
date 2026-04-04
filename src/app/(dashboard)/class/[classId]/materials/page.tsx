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
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight uppercase italic text-white flex items-center gap-3">
            <FileText className="size-8 text-primary" />
            RESOURCE HUB
          </h2>
          <p className="text-slate-400 font-medium tracking-tight truncate max-w-2xl italic opacity-60">
             Centralized knowledge repository for <span className="text-primary font-bold">{classroom.name}</span>.
          </p>
        </div>
        {user?.role === "TEACHER" && (
          <button className={cn(buttonVariants(), "rounded-2xl h-11 px-6 font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-100 transition-all gap-2")}>
            <Plus className="size-4" />
            Upload Protocol
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-8 bg-slate-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Knowledge Base..." 
              className="w-full h-11 bg-transparent pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none"
            />
         </div>
         <button className="h-11 px-4 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <Filter className="size-3.5" /> Filter
         </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classroom.materials.map((m: any) => (
          <Card key={m.id} className="group overflow-hidden bg-slate-900/40 border-white/5 backdrop-blur-md hover:bg-slate-900/60 transition-all hover:border-primary/30 cursor-default">
            <CardHeader className="p-6">
              <div className="flex items-start justify-between">
                 <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText className="size-6" />
                 </div>
                 <div className="flex items-center gap-1">
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                       <Download className="size-4" />
                    </button>
                    {user?.role === "TEACHER" && (
                      <button className="p-2 text-slate-600 hover:text-destructive transition-colors">
                         <Trash2 className="size-4" />
                      </button>
                    )}
                 </div>
              </div>
              <div className="mt-4 space-y-1">
                 <CardTitle className="text-lg font-black text-white uppercase italic tracking-tight truncate">{m.title}</CardTitle>
                 <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    {m.type || "Neural Document"} • {new Date(m.createdAt).toLocaleDateString()}
                 </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
        {classroom.materials.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
             <FileText className="size-16 text-slate-700 mb-4 opacity-20" />
             <p className="text-slate-500 font-black uppercase tracking-widest text-sm italic">Knowledge Repository Empty</p>
          </div>
        )}
      </div>
    </div>
  )
}
