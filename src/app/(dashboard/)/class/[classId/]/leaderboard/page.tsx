import { prisma } from "@/lib/prisma"
import { Trophy, Medal, Award } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function LeaderboardPage({
  params,
}: {
  params: { classId: string }
}) {
  const { classId } = await params

  // Fetch all submissions for quizzes in this class using Prisma
  const submissions = await prisma.submission.findMany({
    where: {
      quiz: { classId: classId }
    },
    include: {
      student: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // Aggregate scores by student
  const leaderboardData: Record<string, any> = {}
  
  submissions.forEach((sub) => {
    const studentId = sub.student.id
    if (!leaderboardData[studentId]) {
      leaderboardData[studentId] = {
        name: sub.student.name || "Unknown Student",
        email: sub.student.email,
        totalScore: 0,
        totalPoints: 0,
        quizzesCompleted: 0
      }
    }
    leaderboardData[studentId].totalScore += sub.score
    leaderboardData[studentId].totalPoints += sub.totalPoints
    leaderboardData[studentId].quizzesCompleted += 1
  })

  // Sort by total score
  const sortedLeaderboard = Object.values(leaderboardData).sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Trophy className="size-6 text-yellow-500" />
        <h2 className="text-xl font-semibold">Class Leaderboard</h2>
      </div>

      <div className="grid gap-6">
        {sortedLeaderboard.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-center text-sm text-muted-foreground">
            No quiz records yet.
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Tests</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLeaderboard.map((student, index) => (
                    <TableRow key={student.email}>
                      <TableCell className="font-bold text-center">
                        {index === 0 ? <Trophy className="size-5 text-yellow-500 mx-auto" /> :
                         index === 1 ? <Medal className="size-5 text-slate-400 mx-auto" /> :
                         index === 2 ? <Award className="size-5 text-amber-600 mx-auto" /> :
                         index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-xs text-muted-foreground">{student.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{student.quizzesCompleted}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {student.totalScore} / {student.totalPoints}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
