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
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/20 w-fit">
             <GraduationCap className="size-3" /> TEACHER PROTOCOL
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic truncate max-w-xl">
            {classroom.name}
          </h2>
          <p className="text-slate-400 font-medium tracking-tight truncate max-w-2xl">
            {classroom.description || "Active high-performance academic environment."}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm font-bold text-xs uppercase tracking-widest gap-2")}>
             <BarChart3 className="size-4" /> Live Analytics
           </Link>
           <button className={cn(buttonVariants(), "rounded-2xl h-11 px-6 font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-100 transition-all")}>
             Global Sync
           </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Total Engagement", value: "89%", icon: Users, color: "text-blue-400" },
          { name: "Neural Students", value: classroom._count.enrollments, icon: GraduationCap, color: "text-emerald-400" },
          { name: "Active Modules", value: classroom._count.quizzes, icon: BookOpen, color: "text-indigo-400" },
          { name: "Resources Sync", value: classroom._count.materials, icon: FileText, color: "text-amber-400" },
        ].map((s: any) => (
          <Card key={s.name} className="bg-slate-900/40 border-white/5 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {s.name}
              </CardTitle>
              <s.icon className={cn("size-4", s.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 ">
        <div className="col-span-4 space-y-4">
           <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] ml-1">Management Hub</h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action: any) => (
                <Link key={action.name} href={action.href}>
                  <Card className={cn("group hover:scale-105 transition-all cursor-pointer border-none shadow-xl", action.color)}>
                     <CardHeader className="p-6 flex flex-col items-center gap-4 text-center">
                        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 group-hover:bg-white/20 transition-colors">
                           <action.icon className="size-6" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{action.name}</span>
                     </CardHeader>
                  </Card>
                </Link>
              ))}
           </div>
           
           <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md">
             <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                   <CardTitle className="text-xl font-black text-white uppercase italic">Platform Activity</CardTitle>
                   <CardDescription className="text-slate-400">Live stream of classroom state updates.</CardDescription>
                </div>
                <MoreVertical className="text-slate-600 cursor-pointer" />
             </CardHeader>
             <CardContent>
                <div className="space-y-6 pt-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                        <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 text-primary">
                           <Users className="size-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                           <p className="text-white text-sm font-bold tracking-tight">System Notification #{500 + i}</p>
                           <p className="text-slate-500 text-xs font-medium">Neural link established with Student Group Delta. Initialization successful.</p>
                        </div>
                        <span className="text-[10px] text-slate-600 font-black uppercase mt-1">2m ago</span>
                     </div>
                   ))}
                </div>
             </CardContent>
           </Card>
        </div>

        <Card className="col-span-3 bg-slate-900/40 border-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-black text-white uppercase italic">Active Directives</CardTitle>
            <CardDescription className="text-slate-400">Manage your created modules and materials.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-4">
                   <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">QUICK STATS</span>
                         <ArrowUpRight className="size-4 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                      <p className="text-white font-black text-lg uppercase italic tracking-tight mb-1 truncate">Module 01: Core Neural Arch</p>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Enrollment: 100% | Success rate: 94%</p>
                   </div>
                   
                   <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">RESOURCE STATUS</span>
                         <ArrowUpRight className="size-4 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                      <p className="text-white font-black text-lg uppercase italic tracking-tight mb-1 truncate">Syllabus PDF v1.4</p>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Downloads: 432 | Encryption: Active</p>
                   </div>
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
