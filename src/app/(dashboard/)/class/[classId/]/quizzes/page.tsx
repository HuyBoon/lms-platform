import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { ClipboardList, Plus, PlayCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function QuizzesPage({
  params,
}: {
  params: { classId: string }
}) {
  const { classId } = await params
  const session = await auth()
  const user = session?.user

  if (!user) return null

  const isTeacher = user.role === 'TEACHER' || user.role === 'ADMIN'

  // Fetch quizzes for the class using Prisma
  const quizzes = await prisma.quiz.findMany({
    where: { classId: classId },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  })

  // Fetch submissions for this student
  const submissions = await prisma.submission.findMany({
    where: { studentId: user.id }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Quizzes</h2>
        {isTeacher && (
          <Button variant="outline" className="gap-2">
            <Plus className="size-4" /> Create Quiz
          </Button>
        )}
      </div>

      {(!quizzes || quizzes.length === 0) ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-center text-sm text-muted-foreground">
          No quizzes available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => {
            const submission = submissions?.find(s => s.quizId === quiz.id)
            const completed = !!submission

            return (
              <Card key={quiz.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={completed ? "secondary" : "outline"}>
                      {completed ? "Completed" : "Available"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{quiz.title}</CardTitle>
                  <CardDescription>
                    {quiz._count.questions} Questions
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  {completed ? (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <CheckCircle2 className="size-4" />
                        Score: {submission.score}/{submission.totalPoints}
                      </div>
                      <Button variant="ghost" size="sm" render={(props) => (
                        <Link {...props} href={`/class/${classId}/quizzes/${quiz.id}`}>
                          View Result
                        </Link>
                      )} />
                    </div>
                  ) : (
                    <Button className="w-full gap-2" render={(props) => (
                      <Link {...props} href={`/class/${classId}/quizzes/${quiz.id}`}>
                        <PlayCircle className="size-4" /> Start Quiz
                      </Link>
                    )} />
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
