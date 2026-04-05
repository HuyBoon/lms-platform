import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { 
  Users, 
  ArrowLeft, 
  GraduationCap, 
  Sword, 
  Trophy, 
  Search,
  ChevronRight,
  TrendingUp,
  BookOpen,
  ScrollText
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default async function HeroAnalyticsPage({
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
    where: { id: classId },
    include: {
      _count: {
        select: {
          quizzes: true,
          materials: true
        }
      },
      enrollments: {
        include: {
          student: {
            include: {
              submissions: {
                where: { quiz: { classId } }
              },
              loreViews: {
                where: { material: { classId } }
              }
            }
          }
        }
      }
    }
  })

  if (!classroom) return <div>Neural Environment Disconnected</div>

  const totalQuizzes = classroom._count.quizzes
  const totalMaterials = classroom._count.materials

  return (
    <div className="flex-1 space-y-16 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <Link href={`/class/${classId}/teacher`} className="p-4 bg-white border-4 border-slate-100 rounded-[1.5rem] sticker-shadow transition-all hover:scale-110 active:scale-95 group">
              <ArrowLeft className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
           </Link>
           <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
                <div className="p-4 bg-yellow-400 rounded-[1.5rem] shadow-xl border-4 border-white rotate-[-3deg] sticker-shadow">
                  <Users className="size-10 text-white" />
                </div>
                Hero Analytics
              </h1>
              <p className="text-slate-500 font-bold text-xl italic uppercase tracking-wider ml-1 flex items-center gap-2">
                Monitor the <span className="text-primary font-black italic">Ascension</span> of your world's <span className="text-yellow-600 font-black italic underline decoration-wavy decoration-yellow-500/30">Brave Adventurers!</span>
              </p>
           </div>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
         <Card className="bg-white border-4 border-slate-200 rounded-[2.5rem] sticker-shadow p-8 flex items-center gap-6">
            <div className="p-5 bg-blue-50 rounded-2xl border-4 border-blue-200 text-blue-500">
               <GraduationCap className="size-8" />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Total Heroes</p>
               <p className="text-4xl font-black text-foreground italic">{classroom.enrollments.length}</p>
            </div>
         </Card>
         
         <Card className="bg-white border-4 border-slate-200 rounded-[2.5rem] sticker-shadow p-8 flex items-center gap-6">
            <div className="p-5 bg-emerald-50 rounded-2xl border-4 border-emerald-200 text-emerald-500">
               <TrendingUp className="size-8" />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Group Morale</p>
               <p className="text-4xl font-black text-foreground italic">92%</p>
            </div>
         </Card>

         <Card className="bg-white border-4 border-slate-200 rounded-[2.5rem] sticker-shadow p-8 flex items-center gap-6">
            <div className="p-5 bg-pink-50 rounded-2xl border-4 border-pink-200 text-pink-500">
               <Trophy className="size-8" />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Quests Comp.</p>
               <p className="text-4xl font-black text-foreground italic">
                 {classroom.enrollments.length > 0 
                   ? Math.round(classroom.enrollments.reduce((acc, curr) => acc + curr.student.submissions.length, 0) / (classroom.enrollments.length * (totalQuizzes || 1)) * 100) 
                   : 0}%
               </p>
            </div>
         </Card>
      </div>

      <div className="space-y-8">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <h3 className="text-2xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
               Registered Adventurers <span className="text-sm font-bold text-slate-300 italic">({classroom.enrollments.length})</span>
            </h3>
            <div className="relative w-full md:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
               <Input 
                 placeholder="Search by Hero Name..." 
                 className="pl-12 h-14 bg-white border-4 border-slate-100 rounded-2xl font-bold italic focus-visible:ring-primary/20 transition-all text-lg"
               />
            </div>
         </div>

         <div className="bg-white border-4 border-slate-200 rounded-[3rem] overflow-hidden sticker-shadow">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b-4 border-slate-100 border-dashed uppercase text-[10px] font-black tracking-[0.3em] text-slate-400 italic">
                     <th className="px-10 py-6">Identity</th>
                     <th className="px-10 py-6">Level & XP</th>
                     <th className="px-10 py-6 text-center">Lore Absorbed</th>
                     <th className="px-10 py-6 text-center">Quest Completion</th>
                     <th className="px-10 py-6">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y-4 divide-slate-100 divide-dashed">
                  {classroom.enrollments.map((enrollment) => {
                     const submissions = enrollment.student.submissions.length
                     const views = enrollment.student.loreViews.length
                     const questPercent = totalQuizzes > 0 ? Math.round((submissions / totalQuizzes) * 100) : 0
                     const lorePercent = totalMaterials > 0 ? Math.round((views / totalMaterials) * 100) : 0

                     return (
                        <tr key={enrollment.id} className="group hover:bg-slate-50/30 transition-colors">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                 <div className="size-16 rounded-2xl bg-slate-100 border-4 border-white sticker-shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                                    {enrollment.student.image ? (
                                       <img src={enrollment.student.image} alt={enrollment.student.name || ""} className="size-full object-cover" />
                                    ) : (
                                       <div className="size-full flex items-center justify-center text-slate-300">
                                          <GraduationCap className="size-8" />
                                       </div>
                                    )}
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-xl font-black uppercase italic tracking-tight text-foreground">{enrollment.student.name || "Unknown Hero"}</p>
                                    <p className="text-xs font-bold text-slate-400 italic">Joined {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                 <div className="px-4 py-2 bg-primary/10 border-2 border-primary/20 rounded-full text-primary font-black italic text-xs uppercase tracking-widest">
                                    Lvl {enrollment.student.level}
                                 </div>
                                 <p className="text-lg font-black text-slate-400 italic">{enrollment.student.xp.toLocaleString()} <span className="text-[10px] uppercase tracking-widest">XP</span></p>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="space-y-3 flex flex-col items-center">
                                 <div className="flex items-center gap-2 text-xs font-black italic uppercase text-amber-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                                    <BookOpen className="size-3" /> {views}/{totalMaterials}
                                 </div>
                                 <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-white shadow-inner">
                                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${lorePercent}%` }} />
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="space-y-3 flex flex-col items-center">
                                 <div className="flex items-center gap-2 text-xs font-black italic uppercase text-pink-500 bg-pink-50 px-3 py-1 rounded-lg border border-pink-100">
                                    <ScrollText className="size-3" /> {submissions}/{totalQuizzes}
                                 </div>
                                 <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-white shadow-inner">
                                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${questPercent}%` }} />
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <button className="p-4 bg-white border-4 border-slate-100 rounded-2xl text-slate-300 hover:text-primary hover:border-primary/20 transition-all active:scale-90">
                                 <ChevronRight className="size-6" />
                              </button>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
            
            {classroom.enrollments.length === 0 && (
               <div className="py-32 flex flex-col items-center justify-center space-y-6 opacity-30">
                  <Sword className="size-20 text-slate-200" />
                  <p className="text-2xl font-black uppercase italic text-slate-300 tracking-widest text-center">The Roster is empty.<br/>No Heroes have arrived.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
