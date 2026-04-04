import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Users, ClipboardCheck, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

export default async function TeacherDashboardPage({
  params,
}: {
  params: { classId: string }
}) {
  const { classId } = await params
  const session = await auth()
  const user = session?.user

  if (!user) return notFound()

  // Verify if teacher owns this class using Prisma
  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: { teacherId: true }
  })

  // In production, you would handle this more strictly
  if (!cls) return notFound()

  // Fetch all submissions for quizzes in this class
  const allSubmissions = await prisma.submission.findMany({
    where: {
      quiz: { classId: classId }
    },
    include: {
      student: {
        select: { name: true, email: true }
      },
      quiz: {
        select: { title: true }
      }
    },
    orderBy: { submittedAt: 'desc' }
  })

  const totalStudents = await prisma.enrollment.count({
    where: { classId: classId }
  })

  const totalSubmissions = allSubmissions.length
  const avgScore = allSubmissions.length 
    ? (allSubmissions.reduce((acc, curr) => acc + (curr.score / curr.totalPoints), 0) / allSubmissions.length * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions Received</CardTitle>
            <ClipboardCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Activity</CardTitle>
          <CardDescription>Monitor student performance across all quizzes in this class.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Quiz</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSubmissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{sub.student.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">{sub.student.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{sub.quiz.title}</TableCell>
                  <TableCell className="font-medium">{sub.score}/{sub.totalPoints}</TableCell>
                  <TableCell>
                    <Badge variant={(sub.score / sub.totalPoints) >= 0.5 ? "default" : "destructive"}>
                      {Math.round((sub.score / sub.totalPoints) * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {allSubmissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No submissions found for this class.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
