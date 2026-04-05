import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { Settings, ArrowLeft, Globe } from "lucide-react"
import Link from "next/link"
import { ClassSettingsForm } from "@/components/dashboard/ClassSettingsForm"
import { Card } from "@/components/ui/card"

export default async function ClassSettingsPage({
  params
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const session = await auth()
  const user = session?.user

  if (user?.role !== "TEACHER") {
     redirect(`/class/${classId}/student`)
  }

  const classroom = await prisma.class.findUnique({
    where: { id: classId }
  })

  if (!classroom || classroom.teacherId !== user.id) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-16 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <Link href={`/class/${classId}/teacher`} className="p-4 bg-white border-4 border-slate-100 rounded-[1.5rem] sticker-shadow transition-all hover:scale-110 active:scale-95 group">
              <ArrowLeft className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
           </Link>
           <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
                <div className="p-4 bg-slate-800 rounded-[1.5rem] shadow-xl border-4 border-white rotate-[-3deg] sticker-shadow">
                  <Settings className="size-10 text-white" />
                </div>
                World Settings
              </h1>
              <p className="text-slate-500 font-bold text-xl italic uppercase tracking-wider ml-1 flex items-center gap-2">
                Command the <span className="text-primary font-black italic underline decoration-wavy decoration-primary/30">Laws of this Realm</span> or permanently <span className="text-red-500 font-black italic">Collapse the World.</span>
              </p>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-white border-4 border-slate-200 rounded-[3rem] sticker-shadow overflow-hidden p-0">
           <div className="p-12 space-y-12">
              <div className="flex items-center gap-4 border-b-4 border-slate-100 border-dashed pb-8">
                 <div className="p-3 bg-primary/10 rounded-2xl border-2 border-primary/20">
                    <Globe className="size-8 text-primary" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-foreground">Realm Governance</h3>
                    <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">Identify and define your world</p>
                 </div>
              </div>

              <ClassSettingsForm classroom={classroom} />
           </div>
        </Card>
      </div>
    </div>
  )
}
