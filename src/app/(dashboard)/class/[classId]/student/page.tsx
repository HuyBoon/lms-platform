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

  if (!classroom) return <div className="p-8 text-center text-slate-500 font-black uppercase italic">Sync Failed</div>

  return (
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full border-2 border-primary/20 w-fit italic">
             <Star className="size-4 fill-primary" /> HERO MODE ON
          </div>
          <h2 className="text-5xl font-black tracking-tight text-foreground uppercase italic truncate max-w-2xl underline decoration-secondary decoration-8 underline-offset-8">
            {classroom.name}
          </h2>
          <p className="text-slate-500 font-bold text-lg italic uppercase tracking-wider ml-1">
            {classroom.description || "Welcome to your next big learning adventure!"}
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Link href={`/class/${classId}/leaderboard`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-3xl border-4 border-yellow-400 bg-white text-yellow-600 font-black italic uppercase tracking-widest gap-2 bouncy-hover")}>
             <Trophy className="size-6 text-yellow-500" /> Rank #0
           </Link>
           <Link href={`/class/${classId}/materials`} className={cn(buttonVariants({ size: "lg" }), "rounded-[2rem] h-14 px-8 font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_#B89600] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bouncy-hover bg-primary")}>
             Study Hub
           </Link>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-7">
        <div className="col-span-4 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic">Quest Log</h3>
              <span className="text-xs font-black uppercase text-secondary tracking-widest bg-secondary/10 px-4 py-2 rounded-full border-2 border-secondary/20">{classroom.quizzes.length} Missions Ready</span>
           </div>

           <div className="grid gap-6">
              {classroom.quizzes.map((quiz: any) => {
                const isCompleted = quiz.submissions.length > 0;
                return (
                  <Card key={quiz.id} className={cn(
                    "overflow-hidden border-4 transition-all bouncy-hover sticker-shadow flex flex-col",
                    isCompleted ? "border-emerald-400 bg-emerald-50/50" : "border-muted bg-white"
                  )}>
                    <CardHeader className="p-8">
                       <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest italic">
                               {isCompleted ? (
                                 <span className="text-emerald-500 flex items-center gap-1.5"><Trophy className="size-4" /> Mission Accomplished!</span>
                               ) : (
                                 <span className="text-amber-500">New Mission Available!</span>
                               )}
                            </div>
                            <CardTitle className="text-3xl font-black text-foreground tracking-tight uppercase italic">{quiz.title}</CardTitle>
                          </div>
                          {!isCompleted && (
                            <Link href={`/class/${classId}/quizzes/${quiz.id}`} className={cn(buttonVariants({ size: "lg" }), "rounded-2xl h-14 px-8 font-black italic tracking-widest uppercase gap-3 bouncy-hover")}>
                              Start Quest! <ArrowRight className="size-5" />
                            </Link>
                          )}
                       </div>
                    </CardHeader>
                    <CardContent className={cn(
                      "px-8 py-5 flex items-center justify-between border-t-4 border-dashed",
                      isCompleted ? "border-emerald-400/30 bg-emerald-100/20" : "border-muted bg-muted/20"
                    )}>
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm font-black text-slate-500 italic">
                             <Clock className="size-5 text-blue-400" /> 20m Fun
                          </div>
                          <div className="flex items-center gap-2 text-sm font-black text-slate-500 italic">
                             <Star className="size-5 text-yellow-400 fill-yellow-400" /> Super Easy
                          </div>
                       </div>
                       {isCompleted && (
                         <div className="text-emerald-500 font-black text-xl uppercase italic tracking-widest bg-white px-4 py-2 rounded-2xl border-2 border-emerald-400 shadow-sm">
                            SCORE: {quiz.submissions[0].score}%
                         </div>
                       )}
                    </CardContent>
                  </Card>
                );
              })}
           </div>
        </div>

        <div className="col-span-3 space-y-10">
           <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic text-right">Treasure Maps</h3>
              <div className="space-y-4">
                 {classroom.materials.map((m: any) => (
                   <div key={m.id} className="group p-6 rounded-3xl bg-white border-4 border-muted hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-5 sticker-shadow active:scale-95">
                      <div className="size-12 rounded-2xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform">
                         <FileText className="size-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-foreground text-lg font-black tracking-tight truncate uppercase italic">{m.title}</p>
                         <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">Secret Intel Attached</p>
                      </div>
                      <ArrowRight className="size-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                   </div>
                 ))}
                 {classroom.materials.length === 0 && (
                   <div className="p-16 text-center border-4 border-dashed border-muted rounded-[2rem] bg-white/30">
                      <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic opacity-60">No Maps Found Yet</p>
                   </div>
                 )}
              </div>
           </div>

           <Card className="bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-400 p-1 border-none sticker-shadow group relative overflow-hidden rounded-[2.5rem]">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity rotate-12 group-hover:scale-125">
                 <Trophy className="size-32 text-white" />
              </div>
              <CardContent className="bg-white m-1 rounded-[2rem] p-8 space-y-6 relative z-10 text-center">
                 <div className="space-y-2">
                    <CardTitle className="text-3xl font-black text-foreground uppercase italic tracking-tight">Trophy Room</CardTitle>
                    <CardDescription className="text-slate-500 font-bold italic text-base">Check how you compare to other Heroes!</CardDescription>
                 </div>
                 <Link href={`/class/${classId}/leaderboard`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full border-4 border-secondary text-secondary font-black italic uppercase tracking-widest rounded-2xl bouncy-hover h-14")}>
                    View Rankings
                 </Link>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
