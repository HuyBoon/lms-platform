import { QuizBuilder } from "@/components/dashboard/QuizBuilder"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function NewQuizPage({
  params
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const session = await auth()

  if (session?.user?.role !== "TEACHER") {
    redirect(`/class/${classId}/student`)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-black tracking-tight uppercase italic text-white">QUIZ ARCHITECTURE BUILDER</h2>
      </div>
      <QuizBuilder classId={classId} />
    </div>
  )
}
