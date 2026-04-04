import { createClient } from "@/lib/supabase/server"
import { QuizInterface } from "@/components/quiz/QuizInterface"
import { notFound } from "next/navigation"

export default async function QuizPage({
  params,
}: {
  params: { classId: string; quizId: string }
}) {
  const { classId, quizId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return notFound()

  return (
    <div className="w-full">
      <QuizInterface quizId={quizId} studentId={user.id} />
    </div>
  )
}
