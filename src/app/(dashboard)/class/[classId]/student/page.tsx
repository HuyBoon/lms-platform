import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Clock, Trophy, Star, Sword } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"
import { MaterialCapsuleList } from "@/components/dashboard/MaterialCapsuleList"

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
    <div className="flex-1 space-y-16 p-10 pt-8 bg-background/50">
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
           <button className={cn(buttonVariants({ size: "lg" }), "rounded-[2rem] h-14 px-8 font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_#B89600] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bouncy-hover bg-primary")}>
             Magic Sync
           </button>
        </div>
      </div>

      <div className="grid gap-16 lg:grid-cols-7 items-start">
        <div className="col-span-4 space-y-10">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic">Active Quests</h3>
              <span className="text-xs font-black uppercase text-secondary tracking-widest bg-secondary/10 px-4 py-2 rounded-full border-2 border-secondary/20">{classroom.quizzes.length} Missions Ready</span>
           </div>

           <div className="grid gap-8">
              {classroom.quizzes.map((quiz: any) => {
                const isCompleted = quiz.submissions.length > 0;
                return (
                  <Card key={quiz.id} className={cn(
                    "overflow-hidden border-4 transition-all bouncy-hover sticker-shadow flex flex-col group",
                    isCompleted ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-white"
                  )}>
                    <CardHeader className="p-8">
                       <div className="flex items-start justify-between gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               {isCompleted ? (
                                 <div className="p-2 bg-emerald-500 rounded-xl border-4 border-white sticker-shadow-sm">
                                    <Trophy className="size-6 text-white" />
                                 </div>
                               ) : (
                                 <div className="p-2 bg-primary rounded-xl border-4 border-white sticker-shadow-sm animate-pulse">
                                    <Star className="size-6 text-white fill-white" />
                                 </div>
                               )}
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-[0.2em] italic",
                                 isCompleted ? "text-emerald-500" : "text-primary"
                               )}>
                                 {isCompleted ? "Mission Accomplished!" : "Quest Available"}
                               </span>
                            </div>
                            <CardTitle className="text-4xl font-black text-foreground tracking-tight uppercase italic group-hover:text-primary transition-colors leading-none">{quiz.title}</CardTitle>
                          </div>
                          {!isCompleted && (
                            <Link href={`/class/${classId}/quizzes/${quiz.id}`} className={cn(buttonVariants({ size: "lg" }), "rounded-[1.5rem] h-16 px-10 font-black italic tracking-widest uppercase gap-3 bouncy-hover shadow-[4px_4px_0px_0px_#B89600]")}>
                              START QUEST! <Sword className="size-6" />
                            </Link>
                          )}
                       </div>
                    </CardHeader>
                    <CardContent className={cn(
                      "px-8 py-6 flex items-center justify-between border-t-4 border-dashed",
                      isCompleted ? "border-emerald-400/30 bg-emerald-100/10" : "border-slate-100 bg-slate-50/50"
                    )}>
                       <div className="flex items-center gap-8">
                          <div className="flex items-center gap-3 text-sm font-black text-slate-500 italic uppercase tracking-tight">
                             <Clock className="size-5 text-blue-400" /> ~20m Fun
                          </div>
                          <div className="flex items-center gap-3 text-sm font-black text-slate-500 italic uppercase tracking-tight">
                             <GraduationCap className="size-5 text-secondary" /> Expert Sage
                          </div>
                       </div>
                       {isCompleted && (
                         <div className="text-emerald-600 font-black text-2xl uppercase italic tracking-widest bg-white px-6 py-3 rounded-2xl border-4 border-emerald-400 sticker-shadow-sm">
                            SCORE: {quiz.submissions[0].score}%
                         </div>
                       )}
                    </CardContent>
                  </Card>
                );
              })}
              {classroom.quizzes.length === 0 && (
                <div className="p-20 text-center border-8 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30 space-y-6">
                   <div className="p-8 bg-white rounded-full border-4 border-slate-100 sticker-shadow-sm opacity-50 mx-auto w-fit">
                      <BookOpen className="size-20 text-slate-200" />
                   </div>
                   <p className="text-3xl font-black uppercase text-slate-300 italic tracking-tight">No Quests Sighted</p>
                </div>
              )}
           </div>
        </div>

        <div className="col-span-3 space-y-12">
           <div className="space-y-6">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic text-left ml-2">Lore Capsules</h3>
              <MaterialCapsuleList materials={classroom.materials} classId={classId} isTeacher={false} />
           </div>

           <Card className="bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-400 p-1 border-none sticker-shadow group relative overflow-hidden rounded-[3rem]">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity rotate-12 group-hover:scale-125">
                 <Trophy className="size-40 text-white" />
              </div>
              <CardContent className="bg-white m-1 rounded-[2.8rem] p-10 space-y-8 relative z-10 text-center">
                 <div className="space-y-3">
                    <CardTitle className="text-4xl font-black text-foreground uppercase italic tracking-tight">Trophy Room</CardTitle>
                    <CardDescription className="text-slate-500 font-semibold italic text-lg leading-tight">Compare your conquests with other Heroes!</CardDescription>
                 </div>
                 <Link href={`/class/${classId}/leaderboard`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full border-4 border-secondary text-secondary font-black italic uppercase tracking-widest rounded-[1.5rem] bouncy-hover h-16 text-xl")}>
                    Open Rankings 🏆
                 </Link>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
