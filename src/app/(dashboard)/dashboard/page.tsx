import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Plus, Users, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  // Fetch classes based on role
  const classes = await prisma.class.findMany({
    where: user?.role === "TEACHER" 
      ? { teacherId: user.id } 
      : { enrollments: { some: { studentId: user?.id } } },
    include: {
      _count: {
        select: { enrollments: true, quizzes: true }
      }
    }
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight uppercase italic text-white flex items-center gap-3">
            <LayoutDashboard className="size-8 text-primary" />
            Control Center
          </h2>
          <p className="text-slate-400 font-medium tracking-wide first-letter:uppercase">
            Welcome back, <span className="text-primary font-bold">{user?.name}</span>. Protocol initialized.
          </p>
        </div>
        {user?.role === "TEACHER" && (
          <Link href="/class/create" className={cn(buttonVariants(), "rounded-2xl h-12 px-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-100 transition-all gap-2")}>
            <Plus className="size-4" />
            Initialize Class
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls: any) => (
          <Link key={cls.id} href={`/class/${cls.id}/${user?.role === "TEACHER" ? "teacher" : "student"}`}>
            <Card className="group relative overflow-hidden bg-slate-900/40 border-white/5 backdrop-blur-md hover:bg-slate-900/60 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer h-full">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <GraduationCap className="size-24" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                    <BookOpen className="size-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                    ID: {cls.id.slice(0, 8)}
                  </span>
                </div>
                <CardTitle className="text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight uppercase italic truncate">
                  {cls.name}
                </CardTitle>
                <CardDescription className="text-slate-400 font-medium line-clamp-2 mt-1">
                  {cls.description || "Academic neural-network focused learning environment."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Users className="size-3.5 text-blue-400" />
                    {cls._count.enrollments} <span className="text-slate-500 uppercase tracking-tighter">Students</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Plus className="size-3.5 text-emerald-400 rotate-45" />
                    {cls._count.quizzes} <span className="text-slate-500 uppercase tracking-tighter">Modules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
             <LayoutDashboard className="size-16 text-slate-700 mb-4 opacity-20" />
             <p className="text-slate-500 font-black uppercase tracking-widest text-sm italic">No active environments found</p>
          </div>
        )}
      </div>
    </div>
  )
}
