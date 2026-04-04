"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getQuizData(quizId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

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

  // Check if student has a submission
  const submission = await prisma.submission.findUnique({
    where: {
      studentId_quizId: {
        studentId: session.user.id,
        quizId: quizId
      }
    },
    include: {
      details: true
    }
  })

  return { quiz, submission }
}
