import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Plus, Users, LayoutDashboard, ArrowRight } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/format"

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
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg border-4 border-white rotate-2">
              <LayoutDashboard className="size-8 text-primary-foreground" />
            </div>
            Trung tâm Khám phá
          </h2>
          <p className="text-slate-500 font-bold text-lg italic uppercase tracking-wider ml-1">
            Chào {user?.name || "Anh hùng"}! Sẵn sàng cho Nhiệm vụ siêu cấp chưa?
          </p>
        </div>
        {user?.role === "TEACHER" && (
          <Link href="/class/create" className={cn(buttonVariants({ size: "lg" }), "bouncy-hover italic shadow-[6px_6px_0px_0px_#B89600] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]")}>
            <Plus className="size-6" />
            Tạo Thế giới mới
          </Link>
        )}
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls: any, index: number) => {
          const colors = [
            { bg: "bg-yellow-400/10", border: "border-yellow-400", meta: "text-yellow-600", shadow: "shadow-yellow-400/20" },
            { bg: "bg-blue-400/10", border: "border-blue-400", meta: "text-blue-600", shadow: "shadow-blue-400/20" },
            { bg: "bg-pink-400/10", border: "border-pink-400", meta: "text-pink-600", shadow: "shadow-pink-400/20" },
            { bg: "bg-green-400/10", border: "border-green-400", meta: "text-green-600", shadow: "shadow-green-400/20" },
          ]
          const color = colors[index % colors.length]
          
          return (
            <Link key={cls.id} href={`/class/${cls.id}/${user?.role === "TEACHER" ? "teacher" : "student"}`}>
              <Card className={cn(
                "group relative overflow-hidden border-4 bg-white transition-all bouncy-hover sticker-shadow h-full p-0 flex flex-col",
                color.border
              )}>
                <div className={cn("absolute -top-6 -right-6 p-6 opacity-10 group-hover:opacity-20 transition-all rotate-12 group-hover:rotate-45", color.meta)}>
                  <GraduationCap className="size-32" />
                </div>
                
                <div className={cn("h-32 w-full flex items-center justify-center relative overflow-hidden", color.bg)}>
                   <BookOpen className={cn("size-16 opacity-40 group-hover:scale-125 transition-transform", color.meta)} />
                   <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-white text-slate-500 shadow-sm">
                        LVL: {cls.id.slice(0, 4).toUpperCase()}
                      </span>
                   </div>
                </div>

                <CardHeader className="p-6 space-y-2 flex-grow">
                  <CardTitle className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight uppercase italic truncate">
                    {cls.name}
                  </CardTitle>
                  <CardDescription className="text-slate-500 font-bold italic line-clamp-2 mt-1 lowercase first-letter:uppercase">
                    {cls.description || "Bắt đầu hành trình kỳ thú của bạn tại thế giới học tập này!"}
                  </CardDescription>
                </CardHeader>

                <CardContent className={cn("p-6 pt-4 border-t-4 border-dashed flex items-center justify-between", color.bg, color.border.replace('border-', 'border-t-'))}>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Người khám phá</span>
                      <div className="flex items-center gap-1.5 font-black text-foreground">
                        <Users className="size-4 text-blue-500" />
                        {formatNumber(cls._count.enrollments)}
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Thử thách</span>
                      <div className="flex items-center gap-1.5 font-black text-foreground">
                        <Plus className="size-4 text-emerald-500 rotate-45" />
                        {formatNumber(cls._count.quizzes)}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-xl shadow-sm border-2 border-muted group-hover:rotate-12 transition-transform">
                     <ArrowRight className={cn("size-6", color.meta)} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {classes.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-4 border-dashed border-muted rounded-[3rem] bg-white/30 space-y-6">
             <div className="p-8 bg-muted/20 rounded-full animate-bounce-subtle">
                <LayoutDashboard className="size-24 text-slate-300 opacity-50" />
             </div>
             <div className="text-center space-y-2">
                <p className="text-2xl font-black uppercase tracking-tight text-slate-400 italic">Chưa có Nhiệm vụ nào</p>
                <p className="text-slate-400 font-bold italic">Hãy chờ Giảng viên mời bạn vào một Thế giới nhé!</p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
