"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const QuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  classId: z.string().min(1),
  questions: z.array(z.object({
    questionText: z.string().min(1, "Question text is required"),
    points: z.number().min(1).default(1),
    answers: z.array(z.object({
      answerText: z.string().min(1, "Answer text is required"),
      isCorrect: z.boolean().default(false),
    })).min(2, "At least 2 answers required per question")
  })).min(1, "At least 1 question is required")
})

export async function createQuiz(data: z.infer<typeof QuizSchema>) {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
    return { error: "Unauthorized" }
  }

  const validatedFields = QuizSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: "Invalid quiz data. Please check all fields." }
  }

  const { title, description, classId, questions } = validatedFields.data

  try {
    // Verify class ownership
    const cls = await prisma.class.findUnique({
      where: { id: classId },
      select: { teacherId: true }
    })

    if (!cls || cls.teacherId !== session.user.id) {
      return { error: "Unauthorized to create quiz in this class" }
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        classId,
        createdById: session.user.id,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            points: q.points,
            answers: {
              create: q.answers.map((a) => ({
                answerText: a.answerText,
                isCorrect: a.isCorrect,
              }))
            }
          }))
        }
      }
    })

    revalidatePath(`/class/${classId}/quizzes`)
    return { success: true, quizId: quiz.id }
  } catch (error) {
    console.error("Quiz Creation Error:", error)
    return { error: "Failed to build quiz repository" }
  }
}

export async function submitQuiz(quizId: string, answers: Record<string, string>) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { answers: true }
        }
      }
    })

    if (!quiz) return { error: "Quiz not found" }

    let correctCount = 0
    const totalQuestions = quiz.questions.length

    quiz.questions.forEach((q: any) => {
      const selectedAnswerId = answers[q.id]
      const correctAnswer = q.answers.find((a: any) => a.isCorrect)
      if (selectedAnswerId === correctAnswer?.id) {
        correctCount++
      }
    })

    const score = (correctCount / totalQuestions) * 100

    const submission = await prisma.submission.create({
      data: {
        quizId,
        studentId: session.user.id,
        score
      }
    })

    revalidatePath(`/class/${quiz.classId}/leaderboard`)
    revalidatePath(`/class/${quiz.classId}/student`)
    return { success: true, submissionId: submission.id, score }
  } catch (error) {
    console.error("Quiz Submission Error:", error)
    return { error: "Failed to submit protocol" }
  }
}
