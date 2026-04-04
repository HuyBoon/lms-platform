'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, SendHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface QuizProps {
  quizId: string
  studentId: string
}

export function QuizInterface({ quizId, studentId }: QuizProps) {
  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch quiz and questions
      const { data: quizData } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions (
            *,
            answers (*)
          )
        `)
        .eq('id', quizId)
        .single()

      if (quizData) {
        setQuiz(quizData)
        setQuestions(quizData.questions || [])
      }

      // 2. Check for existing submission
      const { data: subData } = await supabase
        .from('submissions')
        .select(`
          *,
          submission_details (
            *
          )
        `)
        .eq('quiz_id', quizId)
        .eq('student_id', studentId)
        .single()

      if (subData) {
        setSubmission(subData)
        setPercentage(Math.round((subData.score / subData.total_points) * 100))
        
        // Reconstruct selected answers from submission details
        const reconstructed: Record<string, string> = {}
        subData.submission_details.forEach((detail: any) => {
          reconstructed[detail.question_id] = detail.selected_answer_id
        })
        setSelectedAnswers(reconstructed)
      }

      setLoading(false)
    }

    fetchData()
  }, [quizId, studentId, supabase])

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (submission) return // Disable if already submitted
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    
    const answersArray = Object.entries(selectedAnswers).map(([qId, aId]) => ({
      questionId: qId,
      selectedAnswerId: aId
    }))

    const response = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId,
        studentId,
        answers: answersArray
      })
    })

    const result = await response.json()
    
    if (result.success) {
      // Refresh to show breakdown
      window.location.reload()
    } else {
      alert('Error submitting quiz: ' + result.error)
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading quiz...</div>
  if (!quiz) return <div>Quiz not found.</div>

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        {submission && (
          <Badge variant={percentage >= 50 ? "default" : "destructive"} className="text-sm px-3 py-1">
            Score: {submission.score}/{submission.total_points} ({percentage}%)
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center">
            Question {currentQuestionIndex + 1} of {questions.length}
            {!submission && (
              <span className="text-sm font-normal text-muted-foreground">
                Progress: {Math.round(((Object.keys(selectedAnswers).length) / questions.length) * 100)}%
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-base text-foreground font-medium mt-2">
            {currentQuestion.question_text}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.answers.map((answer: any) => {
            const isSelected = selectedAnswers[currentQuestion.id] === answer.id
            const showBreakdown = submission
            const isCorrect = answer.is_correct
            const studentSelectedCorrectly = showBreakdown && isSelected && isCorrect
            const studentSelectedIncorrectly = showBreakdown && isSelected && !isCorrect
            
            let btnClass = "w-full justify-start text-left h-auto py-4 px-4 border-2 "
            if (isSelected && !showBreakdown) btnClass += "border-primary bg-primary/5 "
            else if (showBreakdown && isCorrect) btnClass += "border-green-500 bg-green-50 "
            else if (studentSelectedIncorrectly) btnClass += "border-red-500 bg-red-50 "
            else btnClass += "border-transparent bg-muted/50 "

            return (
              <Button
                key={answer.id}
                variant="ghost"
                className={btnClass}
                onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                disabled={!!submission}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{answer.answer_text}</span>
                  {showBreakdown && isCorrect && <CheckCircle2 className="size-5 text-green-600" />}
                  {studentSelectedIncorrectly && <XCircle className="size-5 text-red-600" />}
                </div>
              </Button>
            )
          })}
        </CardContent>
        <CardFooter className="flex justify-between border-t mt-4 pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={isFirstQuestion}
            className="gap-2"
          >
            <ChevronLeft className="size-4" /> Previous
          </Button>

          {isLastQuestion && !submission ? (
            <Button 
              className="gap-2" 
              onClick={handleSubmit} 
              disabled={submitting || Object.keys(selectedAnswers).length < questions.length}
            >
              {submitting ? "Submitting..." : "Submit Quiz"} <SendHorizontal className="size-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={isLastQuestion}
              className="gap-2 focus:ring-primary"
            >
              Next <ChevronRight className="size-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {submission && (
        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Quiz Summary</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You completed this quiz on {new Date(submission.submitted_at).toLocaleDateString()}.
          </p>
          <Button variant="outline" onClick={() => router.push(`/class/${quiz.class_id}/quizzes`)}>
            Back to Quizzes
          </Button>
        </div>
      )}
    </div>
  )
}
