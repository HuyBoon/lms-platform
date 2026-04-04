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
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background/50">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
            <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg border-4 border-white rotate-2">
              <Trophy className="size-8 text-yellow-900" />
            </div>
            Hero Rankings
          </h2>
          <p className="text-slate-500 font-bold text-lg italic uppercase tracking-wider ml-1">
             See who is leading the adventure in <span className="text-primary font-black italic">{classroom.name}</span>!
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-7">
        <div className="col-span-4 space-y-10">
           <div className="grid grid-cols-3 gap-6 items-end pb-12 pt-6">
              {/* Silver (Rank 2) */}
              {top3[1] ? (
                <div className="space-y-6 flex flex-col items-center group cursor-default">
                   <div className="relative size-24 md:size-32 rounded-[2rem] bg-slate-100 border-4 border-slate-300 flex items-center justify-center p-2 group-hover:scale-105 transition-all sticker-shadow rotate-[-3deg] active:scale-95">
                      <div className="absolute -top-4 -right-4 p-3 bg-white rounded-full border-4 border-slate-300 shadow-sm rotate-12">
                         <Medal className="size-8 text-slate-400" />
                      </div>
                      <span className="text-4xl font-black text-slate-400 uppercase italic">2</span>
                   </div>
                   <div className="text-center">
                     <p className="text-foreground text-lg font-black uppercase tracking-tight truncate mb-1 italic">{top3[1].name}</p>
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">{top3[1].avgScore.toFixed(1)}% Magic</p>
                   </div>
                </div>
              ) : <div />}

              {/* Gold (Rank 1) */}
              {top3[0] ? (
                <div className="space-y-6 flex flex-col items-center group cursor-default z-10">
                   <div className="relative size-32 md:size-44 rounded-[2.5rem] bg-yellow-50 border-4 border-yellow-400 flex items-center justify-center p-2 group-hover:scale-110 transition-all sticker-shadow mb-4 active:scale-95">
                      <div className="absolute -top-6 -right-6 p-4 bg-white rounded-full border-4 border-yellow-400 shadow-md rotate-12 animate-bounce-subtle">
                         <Trophy className="size-12 text-yellow-500" />
                      </div>
                      <span className="text-6xl font-black text-yellow-500 uppercase italic">1</span>
                   </div>
                   <div className="text-center">
                     <p className="text-foreground text-2xl font-black uppercase tracking-tight truncate mb-1 italic underline decoration-yellow-400 decoration-4 underline-offset-4">{top3[0].name}</p>
                     <p className="text-yellow-600 font-black uppercase tracking-[0.2em] text-sm italic">{top3[0].avgScore.toFixed(1)}% Magic</p>
                   </div>
                </div>
              ) : <div />}

              {/* Bronze (Rank 3) */}
              {top3[2] ? (
                <div className="space-y-6 flex flex-col items-center group cursor-default">
                   <div className="relative size-20 md:size-28 rounded-[1.5rem] bg-orange-50 border-4 border-orange-300 flex items-center justify-center p-2 group-hover:scale-105 transition-all sticker-shadow rotate-[3deg] active:scale-95">
                      <div className="absolute -top-3 -right-3 p-2 bg-white rounded-full border-4 border-orange-300 shadow-sm rotate-12">
                         <Star className="size-6 text-orange-400 fill-orange-400" />
                      </div>
                      <span className="text-3xl font-black text-orange-400 uppercase italic">3</span>
                   </div>
                   <div className="text-center">
                     <p className="text-foreground text-base font-black uppercase tracking-tight truncate mb-1 italic">{top3[2].name}</p>
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">{top3[2].avgScore.toFixed(1)}% Magic</p>
                   </div>
                </div>
              ) : <div />}
           </div>

           <div className="space-y-6">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic ml-2">Hero Honor Roll</h3>
              <div className="space-y-4">
                 {others.map((student: any, i: number) => (
                   <div key={student.id} className="group flex items-center gap-6 p-6 bg-white border-4 border-muted rounded-[2rem] transition-all cursor-default sticker-shadow hover:translate-x-2">
                      <div className="size-12 rounded-2xl bg-muted/20 border-4 border-white flex items-center justify-center text-slate-400 font-black italic text-xl group-hover:rotate-12 transition-transform">
                         {i + 4}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-foreground text-xl font-black uppercase tracking-tight truncate mb-1 group-hover:text-primary transition-colors italic">{student.name}</p>
                         <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">Hero Level: Verified | Quests: {student.totalQuizzes}</p>
                      </div>
                      <div className="text-right bg-muted/10 px-4 py-2 rounded-2xl border-2 border-muted border-dashed">
                         <p className="text-foreground font-black text-2xl italic tracking-tight">{student.avgScore.toFixed(1)}%</p>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter italic">Magic Power</p>
                      </div>
                   </div>
                 ))}
                 {ranking.length === 0 && (
                   <div className="p-32 text-center border-4 border-dashed border-muted rounded-[3rem] bg-white/30 space-y-6">
                      <div className="p-8 bg-muted/20 rounded-full animate-bounce-subtle inline-block">
                         <LayoutDashboard className="size-20 text-slate-300 opacity-50" />
                      </div>
                      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-lg italic">Waiting for Heroes...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="col-span-3 space-y-10">
           <Card className="bg-white border-4 border-muted rounded-[2.5rem] sticker-shadow overflow-hidden group">
              <CardHeader className="p-8 border-b-4 border-muted/30 border-dashed bg-primary/5">
                 <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-3 border-4 border-white bg-white px-4 py-1.5 rounded-full w-fit shadow-sm italic">
                    <Zap className="size-4 fill-primary" /> HERO STATS
                 </div>
                 <CardTitle className="text-3xl font-black text-foreground uppercase italic tracking-tight">World Success</CardTitle>
                 <CardDescription className="text-slate-500 font-bold italic text-base">Check how everyone is doing in this adventure!</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="space-y-6">
                    {[
                      { name: "Global Magic Level", value: "82.4%", icon: Target, color: "text-blue-500", bg: "bg-blue-100" },
                      { name: "Hero Energy", value: "91.2%", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
                    ].map((s: any) => (
                      <div key={s.name} className="p-6 rounded-3xl bg-white border-4 border-muted flex items-center justify-between group-hover:border-primary/20 transition-all sticker-shadow active:scale-95">
                         <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-2xl", s.bg)}>
                               <s.icon className={cn("size-6", s.color)} />
                            </div>
                            <span className="text-sm font-black text-slate-500 uppercase tracking-widest italic">{s.name}</span>
                         </div>
                         <span className="text-foreground text-2xl font-black italic">{s.value}</span>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-white border-4 border-muted rounded-[2.5rem] sticker-shadow overflow-hidden">
             <CardHeader className="p-8 border-b-4 border-muted/30 border-dashed bg-secondary/5">
                <CardTitle className="text-2xl font-black text-foreground uppercase italic">Active Heroes</CardTitle>
                <CardDescription className="text-slate-500 font-bold italic">Heroes currently in the world.</CardDescription>
             </CardHeader>
             <CardContent className="p-8">
                <div className="space-y-5">
                   {ranking.slice(0, 5).map((s: any) => (
                     <div key={s.id} className="flex items-center gap-4 group">
                        <div className="size-3 rounded-full bg-secondary animate-pulse" />
                        <span className="text-foreground font-black text-lg truncate flex-1 uppercase tracking-tight italic group-hover:text-secondary transition-colors underline decoration-transparent group-hover:decoration-secondary decoration-4 underline-offset-4">{s.name}</span>
                        <span className="text-slate-300 font-black text-[10px] italic tracking-tighter">HERO_ONLINE</span>
                     </div>
                   ))}
                   {ranking.length === 0 && (
                     <p className="text-slate-300 font-black text-center italic py-4">No Heroes Spotted!</p>
                   )}
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
