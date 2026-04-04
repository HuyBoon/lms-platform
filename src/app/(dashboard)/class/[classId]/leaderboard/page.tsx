import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Star, Target, Zap, LayoutDashboard, MoreVertical } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export default async function LeaderboardPage({
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
      enrollments: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              submissions: {
                where: {
                  quiz: {
                    classId: classId
                  }
                },
                select: { score: true }
              }
            }
          }
        }
      }
    }
  })

  if (!classroom) return <div className="p-8 text-center text-slate-500 font-black uppercase italic">Neural Network Disconnected</div>

  // Calculate scores for each student
  const ranking = classroom.enrollments.map((enrollment: any) => {
    const student = enrollment.student;
    const totalScore = student.submissions.reduce((acc: number, s: any) => acc + (s.score || 0), 0);
    const avgScore = student.submissions.length > 0 ? totalScore / student.submissions.length : 0;
    return {
      ...student,
      avgScore,
      totalQuizzes: student.submissions.length
    }
  }).sort((a: any, b: any) => b.avgScore - a.avgScore);

  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight uppercase italic text-white flex items-center gap-3">
            <Trophy className="size-8 text-amber-500 shadow-amber-500/20" />
            RANKING PROTOCOL
          </h2>
          <p className="text-slate-400 font-medium tracking-tight truncate max-w-2xl italic opacity-60">
             Live performance benchmarking for <span className="text-primary font-bold">{classroom.name}</span>.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-7 ">
        <div className="col-span-4 space-y-6">
           <div className="grid grid-cols-3 gap-4 items-end pb-8">
              {/* Silver (Rank 2) */}
              {top3[1] && (
                <div className="space-y-4 flex flex-col items-center group cursor-default">
                   <div className="relative size-20 md:size-24 rounded-3xl bg-slate-400/10 border-2 border-slate-400/20 flex items-center justify-center p-2 group-hover:scale-105 transition-transform overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-opacity group-hover:opacity-20">
                         <Medal className="size-20" />
                      </div>
                      <span className="text-2xl font-black text-slate-400 uppercase italic drop-shadow-2xl">2</span>
                   </div>
                   <div className="text-center">
                     <p className="text-white text-sm font-black uppercase tracking-tight truncate mb-1">{top3[1].name}</p>
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{top3[1].avgScore.toFixed(1)}% Core Sync</p>
                   </div>
                </div>
              )}
              {/* Gold (Rank 1) */}
              {top3[0] && (
                <div className="space-y-4 flex flex-col items-center group cursor-default">
                   <div className="relative size-28 md:size-32 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center p-2 group-hover:scale-110 transition-transform overflow-hidden shadow-2xl shadow-amber-500/10 mb-2">
                      <div className="absolute top-0 right-0 p-2 opacity-10 scale-150 rotate-12 transition-opacity group-hover:opacity-30">
                         <Trophy className="size-24" />
                      </div>
                      <span className="text-4xl font-black text-amber-500 uppercase italic drop-shadow-2xl">1</span>
                   </div>
                   <div className="text-center">
                     <p className="text-white text-lg font-black uppercase tracking-tight truncate mb-1">{top3[0].name}</p>
                     <p className="text-amber-500/80 text-[10px] font-black uppercase tracking-[0.2em]">{top3[0].avgScore.toFixed(1)}% Core Sync</p>
                   </div>
                </div>
              )}
              {/* Bronze (Rank 3) */}
              {top3[2] && (
                <div className="space-y-4 flex flex-col items-center group cursor-default">
                   <div className="relative size-16 md:size-20 rounded-3xl bg-orange-600/10 border-2 border-orange-600/20 flex items-center justify-center p-2 group-hover:scale-105 transition-transform overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-opacity group-hover:opacity-20">
                         <Star className="size-16" />
                      </div>
                      <span className="text-xl font-black text-orange-600 uppercase italic drop-shadow-2xl">3</span>
                   </div>
                   <div className="text-center">
                     <p className="text-white text-xs font-black uppercase tracking-tight truncate mb-1">{top3[2].name}</p>
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{top3[2].avgScore.toFixed(1)}% Core Sync</p>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] ml-1 mb-4">Neural Grid Rankings</h3>
              {others.map((student: any, i: number) => (
                <div key={student.id} className="group flex items-center gap-5 p-5 bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-md hover:bg-slate-900/60 transition-all cursor-default">
                   <div className="size-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 font-black italic">
                      {i + 4}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-white text-base font-black uppercase tracking-tight truncate mb-1 group-hover:text-primary transition-colors">{student.name}</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-60">Status: Verified | Modules: {student.totalQuizzes}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-white font-black text-lg italic tracking-tight">{student.avgScore.toFixed(1)}%</p>
                      <p className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Sync Efficiency</p>
                   </div>
                </div>
              ))}
              {ranking.length === 0 && (
                <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] opacity-20">
                   <LayoutDashboard className="size-20 text-slate-500 mx-auto mb-4" />
                   <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-sm italic">Ranking Layer Initializing</p>
                </div>
              )}
           </div>
        </div>

        <div className="col-span-3 space-y-8">
           <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md overflow-hidden relative group cursor-default">
              <CardHeader>
                 <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-1.5 border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full w-fit">
                    <Zap className="size-3 fill-primary" /> SYSTEM ANALYTICS
                 </div>
                 <CardTitle className="text-xl font-black text-white uppercase italic tracking-tight">Academic Integrity</CardTitle>
                 <CardDescription className="text-slate-400 font-medium">Core neural synchronization across all identifiers.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {[
                      { name: "Average Sync Rate", value: "82.4%", icon: Target },
                      { name: "Protocol Accuracy", value: "91.2%", icon: Zap },
                    ].map((s: any) => (
                      <div key={s.name} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group-hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                            <s.icon className="size-4 text-slate-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.name}</span>
                         </div>
                         <span className="text-white font-black italic">{s.value}</span>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md">
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-black text-white uppercase italic">Active Nodes</CardTitle>
                <MoreVertical className="size-4 text-slate-600 cursor-pointer" />
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   {ranking.slice(0, 5).map((s: any) => (
                     <div key={s.id} className="flex items-center gap-3 px-1">
                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-white font-bold text-xs truncate flex-1 uppercase tracking-tight italic">{s.name}</span>
                        <span className="text-slate-600 font-black text-[10px]">SYNC_OK</span>
                     </div>
                   ))}
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
