import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { 
  Sparkles, 
  ScrollText, 
  ArrowLeft, 
  Plus
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import { QuizzesList } from "@/components/dashboard/QuizzesList"

export default async function TeacherQuizzesPage({
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

  const quizzes = await prisma.quiz.findMany({
    where: { classId },
    include: {
      _count: {
        select: { 
          questions: true,
          submissions: true 
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex-1 space-y-16 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <Link href={`/class/${classId}/teacher`} className="p-4 bg-white border-4 border-slate-100 rounded-[1.5rem] sticker-shadow transition-all hover:scale-110 active:scale-95 group">
              <ArrowLeft className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
           </Link>
           <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
                <div className="p-4 bg-pink-500 rounded-[1.5rem] shadow-xl border-4 border-white rotate-3 sticker-shadow">
                  <ScrollText className="size-10 text-white" />
                </div>
                Mission Control
              </h1>
              <p className="text-slate-500 font-bold text-xl italic uppercase tracking-wider ml-1 flex items-center gap-2">
                Forge your <span className="text-primary font-black italic">Super Quests</span> and monitor <Sparkles className="size-5 text-yellow-500" /> <span className="text-pink-500 font-black italic underline decoration-wavy decoration-pink-500/30">Hero Progress!</span>
              </p>
           </div>
        </div>
        <Link 
          href={`/class/${classId}/teacher/quizzes/new`}
          className={cn(buttonVariants({ size: "lg" }), "rounded-[2rem] h-16 px-10 font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_#B3125C] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bouncy-hover bg-pink-500 text-white text-xl gap-3 border-4 border-pink-600")}
        >
          <Plus className="size-8 stroke-[4]" /> New Quest
        </Link>
      </div>

      <QuizzesList quizzes={quizzes} classId={classId} isTeacher />
    </div>
  )
}
