import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { quizId, answers: studentAnswers, studentId } = await req.json()

    if (!quizId || !studentAnswers || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Fetch questions and correct answers for this quiz
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select(`
        id,
        points,
        answers (
          id,
          is_correct
        )
      `)
      .eq('quiz_id', quizId)

    if (questionsError || !questions) {
      return NextResponse.json({ error: 'Quiz not found or fetch failed' }, { status: 404 })
    }

    let totalScore = 0
    let totalPossiblePoints = 0
    const submissionDetails = []

    // 2. Auto-grading logic
    for (const question of questions) {
      totalPossiblePoints += question.points || 0
      
      // Find the student's answer for this question
      const studentAnswer = studentAnswers.find((a: any) => a.questionId === question.id)
      const selectedAnswerId = studentAnswer?.selectedAnswerId
      
      // Find the correct answer for this question
      const correctAnswer = (question.answers as any[]).find(a => a.is_correct)
      
      const isCorrect = selectedAnswerId === correctAnswer?.id
      
      if (isCorrect) {
        totalScore += question.points || 0
      }

      submissionDetails.push({
        question_id: question.id,
        selected_answer_id: selectedAnswerId,
        is_correct: isCorrect
      })
    }

    // 3. Store the submission in Supabase
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        student_id: studentId,
        quiz_id: quizId,
        score: totalScore,
        total_points: totalPossiblePoints
      })
      .select('id')
      .single()

    if (submissionError) {
      return NextResponse.json({ error: submissionError.message }, { status: 500 })
    }

    // 4. Store submission details
    const detailsToInsert = submissionDetails.map(detail => ({
      ...detail,
      submission_id: submission.id
    }))

    const { error: detailsError } = await supabase
      .from('submission_details')
      .insert(detailsToInsert)

    if (detailsError) {
      // Note: In production, you might want to handle this partial success
      console.error('Failed to store submission details:', detailsError)
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      score: totalScore,
      totalPossiblePoints,
      percentage: (totalScore / totalPossiblePoints) * 100,
      breakdown: submissionDetails
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
