import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizId, answers: studentAnswers, studentId } = await req.json()

    if (!quizId || !studentAnswers || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Fetch questions and correct answers using Prisma
    const questions = await prisma.question.findMany({
      where: { quizId: quizId },
      include: {
        answers: true
      }
    })

    if (!questions) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    let totalScore = 0
    let totalPossiblePoints = 0
    const submissionDetails: any[] = []

    // 2. Auto-grading logic
    for (const question of questions) {
      totalPossiblePoints += question.points || 0
      
      const studentAnswer = studentAnswers.find((a: any) => a.questionId === question.id)
      const selectedAnswerId = studentAnswer?.selectedAnswerId
      
      const correctAnswer = question.answers.find(a => a.isCorrect)
      const isCorrect = selectedAnswerId === correctAnswer?.id
      
      if (isCorrect) {
        totalScore += question.points || 0
      }

      submissionDetails.push({
        questionId: question.id,
        selectedAnswerId: selectedAnswerId,
        isCorrect: isCorrect
      })
    }

    // 3. Use transaction to store submission and details
    const submission = await prisma.submission.create({
      data: {
        studentId: studentId,
        quizId: quizId,
        score: totalScore,
        totalPoints: totalPossiblePoints,
        details: {
          create: submissionDetails
        }
      }
    })

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      score: totalScore,
      totalPossiblePoints,
      percentage: (totalScore / totalPossiblePoints) * 100,
      breakdown: submissionDetails
    })

  } catch (error: any) {
    console.error('Quiz submission error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
