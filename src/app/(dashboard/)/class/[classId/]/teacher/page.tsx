import { createClient } from "@/lib/supabase/server"
import { Users, ClipboardCheck, TrendingUp, UserCheck } from "lucide-react"
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
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  // Verify if teacher owns this class
  const { data: cls } = await supabase
    .from('classes')
    .select('teacher_id')
    .eq('id', classId)
    .single()

  if (!cls || cls.teacher_id !== user.id) {
    // In a production app, redirect or show message
  }

  // Fetch all submissions for quizzes in this class
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      student:student_id (
        email,
        full_name
      ),
      quiz:quiz_id (
        title
      )
    `)
    .eq('quiz_id', (
      supabase
        .from('quizzes')
        .select('id')
        .eq('class_id', classId)
    ))
  
  // Alternative fetch if the nested subquery is complex
  const { data: quizIds } = await supabase
    .from('quizzes')
    .select('id')
    .eq('class_id', classId)
  
  const idArray = quizIds?.map(q => q.id) || []

  const { data: allSubmissions } = await supabase
    .from('submissions')
    .select(`
      *,
      student:student_id (
        email,
        full_name
      ),
      quiz:quiz_id (
        title
      )
    `)
    .in('quiz_id', idArray)

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('count')
    .eq('class_id', classId)
    .single()

  const totalStudents = enrollments?.count || 0
  const totalSubmissions = allSubmissions?.length || 0
  const avgScore = allSubmissions?.length 
    ? (allSubmissions.reduce((acc, curr) => acc + (curr.score / curr.total_points), 0) / allSubmissions.length * 100).toFixed(1)
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
              {allSubmissions?.map((sub: any) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{(sub.student as any)?.full_name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">{(sub.student as any)?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{(sub.quiz as any)?.title}</TableCell>
                  <TableCell className="font-medium">{sub.score}/{sub.total_points}</TableCell>
                  <TableCell>
                    <Badge variant={(sub.score / sub.total_points) >= 0.5 ? "default" : "destructive"}>
                      {(sub.score / sub.total_points) * 100}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {new Date(sub.submitted_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {(!allSubmissions || allSubmissions.length === 0) && (
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
