import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, FileText, BarChart3, Clock, Trophy, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function StudentClassDashboard({
  params
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const session = await auth()
  const user = session?.user

  if (user?.role === "TEACHER") {
     redirect(`/class/${classId}/teacher`)
  }

  const classroom = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      quizzes: {
        include: {
          submissions: {
            where: { studentId: user?.id }
          }
        }
      },
      materials: true,
      _count: {
        select: { enrollments: true, quizzes: true, materials: true }
      }
    }
  })

  if (!classroom) return <div className="p-8 text-center text-slate-500 font-black uppercase italic">Neural Sync Failed</div>

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 w-fit">
             <Star className="size-3 fill-emerald-400" /> STUDENT ACCESS
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic truncate max-w-xl">
            {classroom.name}
          </h2>
          <p className="text-slate-400 font-medium tracking-tight truncate max-w-2xl italic opacity-60">
            {classroom.description || "Active academic journey in progress."}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Link href={`/class/${classId}/leaderboard`} className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm font-bold text-xs uppercase tracking-widest gap-2")}>
             <Trophy className="size-4 text-amber-500" /> Rank #0
           </Link>
           <Link href={`/class/${classId}/materials`} className={cn(buttonVariants(), "rounded-2xl h-11 px-6 font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 transition-all")}>
             Study Hub
           </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em]">Module Stream</h3>
              <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/5 px-2 py-1 rounded-full border border-primary/10">{classroom.quizzes.length} Active Directives</span>
           </div>

           <div className="grid gap-4">
              {classroom.quizzes.map((quiz: any) => {
                const isCompleted = quiz.submissions.length > 0;
                return (
                  <Card key={quiz.id} className={cn("overflow-hidden border-none shadow-xl transition-all group", isCompleted ? "bg-emerald-500/5" : "bg-slate-900/40 backdrop-blur-md border border-white/5")}>
                    <CardHeader className="p-6">
                       <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1">
                               {isCompleted ? (
                                 <span className="text-emerald-400">STATUS: VERIFIED</span>
                               ) : (
                                 <span className="text-amber-400">STATUS: INITIALIZING</span>
                               )}
                            </div>
                            <CardTitle className="text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight uppercase italic">{quiz.title}</CardTitle>
                          </div>
                          {!isCompleted && (
                            <Link href={`/class/${classId}/quizzes/${quiz.id}`} className={cn(buttonVariants({ size: "sm" }), "rounded-xl h-10 px-4 font-black text-[10px] tracking-widest uppercase gap-2")}>
                               Execute <ArrowRight className="size-3" />
                            </Link>
                          )}
                       </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-white/5 mt-2 pt-4">
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                             <Clock className="size-3.5" /> 20m Duration
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                             <BarChart3 className="size-3.5" /> Hardness: Neural
                          </div>
                       </div>
                       {isCompleted && (
                         <div className="text-emerald-400 font-black text-sm uppercase italic tracking-widest">
                            SCORE: {quiz.submissions[0].score}%
                         </div>
                       )}
                    </CardContent>
                  </Card>
                );
              })}
           </div>
        </div>

        <div className="col-span-3 space-y-6">
           <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em]">Knowledge Resources</h3>
           <div className="space-y-3">
              {classroom.materials.map((m: any) => (
                <div key={m.id} className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer flex items-center gap-4">
                   <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText className="size-5" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold tracking-tight truncate uppercase italic">{m.title}</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Protocol: Optimized</p>
                   </div>
                   <ArrowRight className="size-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
              {classroom.materials.length === 0 && (
                <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                   <p className="text-slate-600 font-black uppercase tracking-widest text-xs opacity-50 italic">Storage Empty</p>
                </div>
              )}
           </div>

           <Card className="bg-gradient-to-br from-primary/20 to-blue-600/20 border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                 <Trophy className="size-32" />
              </div>
              <CardHeader>
                 <CardTitle className="text-xl font-black text-white uppercase italic tracking-tight">Academic Ranking</CardTitle>
                 <CardDescription className="text-slate-300 opacity-60 font-medium">Evaluate your position in the class environment.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Link href={`/class/${classId}/leaderboard`} className={cn(buttonVariants({ variant: "outline" }), "w-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xs tracking-widest uppercase rounded-xl")}>
                    View Stats Protocol
                 </Link>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
