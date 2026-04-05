import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { MaterialCapsuleForm } from "@/components/dashboard/MaterialCapsuleForm"
import { MaterialCapsuleList } from "@/components/dashboard/MaterialCapsuleList"
import { Sparkles, ScrollText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function TeacherMaterialsPage({
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

  const materials = await prisma.material.findMany({
    where: { classId },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex-1 space-y-16 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <Link href={`/class/${classId}/teacher`} className="p-4 bg-white border-4 border-slate-100 rounded-[1.5rem] sticker-shadow transition-all hover:scale-110 active:scale-95 group">
              <ArrowLeft className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
           </Link>
           <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
                <div className="p-4 bg-amber-400 rounded-[1.5rem] shadow-xl border-4 border-white rotate-[-3deg] sticker-shadow">
                  <ScrollText className="size-10 text-white" />
                </div>
                Material Vault
              </h1>
              <p className="text-slate-500 font-bold text-xl italic uppercase tracking-wider ml-1 flex items-center gap-2">
                Infuse your world with <span className="text-primary font-black italic">Ancient Knowledge</span> and <Sparkles className="size-5 text-yellow-500" /> <span className="text-amber-500 font-black italic underline decoration-wavy decoration-amber-500/30">Epic Loot!</span>
              </p>
           </div>
        </div>
      </div>

      <div className="grid gap-16 lg:grid-cols-12 items-start">
        {/* Left: Creation Portal */}
        <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-24">
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-foreground ml-2">Creation Portal</h2>
              <MaterialCapsuleForm classId={classId} />
           </div>
        </div>

        {/* Right: Existing Loot */}
        <div className="lg:col-span-7 space-y-10">
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-foreground ml-2">Deployed Capsules</h2>
              <MaterialCapsuleList materials={materials} classId={classId} isTeacher />
           </div>
        </div>
      </div>
    </div>
  )
}
