import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { QuestBuilder } from "@/components/dashboard/QuestBuilder"
import { ScrollText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewQuizPage({
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

  return (
    <div className="flex-1 space-y-16 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <Link href={`/class/${classId}/teacher/quizzes`} className="p-4 bg-white border-4 border-slate-100 rounded-[1.5rem] sticker-shadow transition-all hover:scale-110 active:scale-95 group">
              <ArrowLeft className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
           </Link>
           <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
                <div className="p-4 bg-pink-500 rounded-[1.5rem] shadow-xl border-4 border-white rotate-[-3deg] sticker-shadow">
                  <ScrollText className="size-10 text-white" />
                </div>
                Rèn dũa Thử thách
              </h1>
              <p className="text-slate-500 font-bold text-xl italic uppercase tracking-wider ml-1 flex items-center gap-2">
                Hãy soạn thảo một Thử thách Sử thi và thử tài các Anh hùng của bạn!
              </p>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <QuestBuilder classId={classId} />
      </div>
    </div>
  )
}
