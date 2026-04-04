import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { QuizInteraction } from "@/components/dashboard/QuizInteraction"

export default async function QuizPage({
  params
}: {
  params: Promise<{ classId: string; quizId: string }>
}) {
  const { classId, quizId } = await params
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect("/login")
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: { answers: true }
      }
    }
  })

  if (!quiz || quiz.classId !== classId) {
    redirect(`/class/${classId}/student`)
  }

  // Check if student already submitted
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      quizId: quizId,
      studentId: user.id
    }
  })

  if (existingSubmission && user.role !== "TEACHER") {
    redirect(`/class/${classId}/student`)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
       <QuizInteraction quiz={quiz} classId={classId} />
    </div>
  )
}
