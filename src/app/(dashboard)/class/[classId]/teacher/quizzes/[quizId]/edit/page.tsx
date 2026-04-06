import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { QuestBuilder } from "@/components/dashboard/QuestBuilder"
import { ScrollText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditQuizPage({
  params
}: {
  params: Promise<{ classId: string, quizId: string }>
}) {
  const { classId, quizId } = await params
  const session = await auth()
  const user = session?.user

  if (user?.role !== "TEACHER") {
     redirect(`/class/${classId}/student`)
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          answers: true
        }
      }
    }
  })

  if (!quiz || quiz.classId !== classId) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-16 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <Link href={`/class/${classId}/teacher/quizzes`} className="p-4 bg-white border-4 border-slate-100 rounded-[1.5rem] sticker-shadow transition-all hover:scale-110 active:scale-95 group">
              <ArrowLeft className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
           </Link>
           <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
                <div className="p-4 bg-emerald-500 rounded-[1.5rem] shadow-xl border-4 border-white rotate-3 sticker-shadow">
                  <ScrollText className="size-10 text-white" />
                </div>
                Chỉnh sửa Thử thách
              </h1>
              <p className="text-slate-500 font-bold text-xl italic uppercase tracking-wider ml-1 flex items-center gap-2">
                Cập nhật Thử thách của bạn để phù hợp với trình độ của các Anh hùng.
              </p>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <QuestBuilder classId={classId} initialData={quiz} />
      </div>
    </div>
  )
}
