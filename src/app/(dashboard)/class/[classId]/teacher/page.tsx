import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Plus, FileText, BarChart3, Settings, MoreVertical, GraduationCap } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function TeacherClassDashboard({
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
        select: { enrollments: true, quizzes: true, materials: true }
      }
    }
  })

  if (!classroom) return <div>Neural Environment Disconnected</div>

  const quickActions = [
    { name: "Create Quiz", href: `/class/${classId}/teacher/quizzes/new`, icon: Plus, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { name: "Add Material", href: `/class/${classId}/teacher/materials`, icon: FileText, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { name: "Global Settings", href: `/class/${classId}/teacher/settings`, icon: Settings, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ]

  return (
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest bg-secondary/10 px-4 py-1.5 rounded-full border-2 border-secondary/20 w-fit italic">
             <GraduationCap className="size-4 text-secondary" /> SAGE MODE ON
          </div>
          <h2 className="text-5xl font-black tracking-tight text-foreground uppercase italic truncate max-w-2xl underline decoration-primary decoration-8 underline-offset-8">
            {classroom.name}
          </h2>
          <p className="text-slate-500 font-bold text-lg italic uppercase tracking-wider ml-1">
            {classroom.description || "Guide your heroes to victory in this amazing world!"}
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Link href={`/class/${classId}/leaderboard`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-3xl border-4 border-yellow-400 bg-white text-yellow-600 font-black italic uppercase tracking-widest gap-2 bouncy-hover")}>
             <BarChart3 className="size-6 text-yellow-500" /> Hero Analytics
           </Link>
           <button className={cn(buttonVariants({ size: "lg" }), "rounded-[2rem] h-14 px-8 font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_#B89600] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bouncy-hover bg-primary")}>
             Magic Sync
           </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Total Fun", value: "89%", icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-400" },
          { name: "Hero Students", value: classroom._count.enrollments, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-400" },
          { name: "Active Missions", value: classroom._count.quizzes, icon: BookOpen, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-400" },
          { name: "Treasure Chests", value: classroom._count.materials, icon: FileText, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-400" },
        ].map((s: any) => (
          <Card key={s.name} className={cn("border-4 transition-all bouncy-hover sticker-shadow bg-white", s.border)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
                {s.name}
              </CardTitle>
              <div className={cn("p-2 rounded-xl border-2", s.bg, s.border)}>
                 <s.icon className={cn("size-5", s.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground italic">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-10">
           <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic ml-2">Magic Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {[
                   { name: "New Quest", href: `/class/${classId}/teacher/quizzes/new`, icon: Plus, color: "bg-pink-500 text-white border-pink-600 shadow-[4px_4px_0px_0px_#B3125C]" },
                   { name: "Add Loot", href: `/class/${classId}/teacher/materials`, icon: FileText, color: "bg-blue-500 text-white border-blue-600 shadow-[4px_4px_0px_0px_#096899]" },
                   { name: "World Setup", href: `/class/${classId}/teacher/settings`, icon: Settings, color: "bg-yellow-500 text-white border-yellow-600 shadow-[4px_4px_0px_0px_#B89600]" },
                 ].map((action: any) => (
                   <Link key={action.name} href={action.href}>
                     <Card className={cn("group transition-all bouncy-hover border-4 flex flex-col items-center justify-center h-40 text-center active:translate-x-[4px] active:translate-y-[4px] active:shadow-none", action.color)}>
                        <div className="p-4 bg-white/20 rounded-2xl border-4 border-white/20 mb-3 group-hover:rotate-12 transition-transform">
                           <action.icon className="size-8 stroke-[3]" />
                        </div>
                        <span className="text-lg font-black uppercase italic tracking-tight">{action.name}</span>
                     </Card>
                   </Link>
                 ))}
              </div>
           </div>
           
           <Card className="bg-white border-4 border-muted rounded-[2rem] sticker-shadow">
             <CardHeader className="flex flex-row items-center justify-between p-8 border-b-4 border-muted/30 border-dashed">
                <div className="space-y-1">
                   <CardTitle className="text-2xl font-black text-foreground uppercase italic tracking-tight">Hero Activity</CardTitle>
                   <CardDescription className="text-slate-500 font-bold italic">See what your students are achieving!</CardDescription>
                </div>
                <MoreVertical className="text-slate-300 cursor-pointer hover:text-primary transition-colors" />
             </CardHeader>
             <CardContent className="p-8">
                <div className="space-y-6">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-muted/20 border-4 border-white group hover:border-primary/20 transition-all cursor-default">
                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary group-hover:scale-110 transition-transform">
                           <Users className="size-7" />
                        </div>
                        <div className="flex-1 space-y-1">
                           <p className="text-foreground text-lg font-black tracking-tight italic uppercase truncate">Hero Milestone #{500 + i}</p>
                           <p className="text-slate-500 font-bold italic text-sm">A new group of heroes just joined your world! Ready for adventure.</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-black uppercase italic mt-1 tracking-widest">2m ago</span>
                     </div>
                   ))}
                </div>
             </CardContent>
           </Card>
        </div>

        <Card className="col-span-3 bg-white border-4 border-muted rounded-[2.5rem] sticker-shadow overflow-hidden p-0 flex flex-col">
          <CardHeader className="p-8 bg-secondary/5 border-b-4 border-muted/30 border-dashed">
            <CardTitle className="text-2xl font-black text-foreground uppercase italic tracking-tight">Current Missions</CardTitle>
            <CardDescription className="text-slate-500 font-bold italic">Manage your created quests and loot.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex-grow">
             <div className="space-y-6">
                <div className="group p-6 rounded-[2rem] bg-emerald-50 border-4 border-emerald-400 hover:bg-emerald-100 transition-all cursor-pointer sticker-shadow active:scale-95">
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-600 italic">MISSION STATS</span>
                      <ArrowUpRight className="size-6 text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </div>
                   <p className="text-foreground font-black text-2xl uppercase italic tracking-tight mb-2 truncate">QUEST 01: MAGIC BASICS</p>
                   <p className="text-emerald-700/60 text-sm font-black uppercase italic tracking-widest">Participation: 100% | Fun: High</p>
                </div>
                
                <div className="group p-6 rounded-[2rem] bg-blue-50 border-4 border-blue-400 hover:bg-blue-100 transition-all cursor-pointer sticker-shadow active:scale-95">
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-widest text-blue-600 italic">LOOT STATUS</span>
                      <ArrowUpRight className="size-6 text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </div>
                   <p className="text-foreground font-black text-2xl uppercase italic tracking-tight mb-2 truncate">SECRET MAP PDF v1.4</p>
                   <p className="text-blue-700/60 text-sm font-black uppercase italic tracking-widest">Findings: 432 | Safe: Yes</p>
                </div>

                <div className="p-8 rounded-[2rem] bg-muted/20 border-4 border-dashed border-muted flex flex-col items-center justify-center text-center space-y-4">
                   <Plus className="size-10 text-slate-300" />
                   <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">Add more magic here!</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ArrowUpRight({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}
