import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get user profile role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single()

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'

  // Fetch classes
  let classes = []
  if (isTeacher) {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user?.id)
    classes = data || []
  } else {
    // For students, fetch enrolled classes
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('classes(*)')
      .eq('student_id', user?.id)
    classes = enrollments?.map((e: any) => e.classes) || []
  }

  return (
    <div className="space-y-6 flex-1 h-full pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Classes</h1>
          <p className="text-muted-foreground text-sm">
            {isTeacher 
              ? "Manage your classrooms and curriculum" 
              : "Access your enrolled courses and quizzes"}
          </p>
        </div>
        {isTeacher && (
          <Button className="gap-2">
            <Plus className="size-4" /> New Class
          </Button>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No classes found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {isTeacher 
                ? "You haven't created any classes yet. Start by creating one." 
                : "You aren't enrolled in any classes yet. Join a class to see it here."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {classes.map((cls: any) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">Class</Badge>
                </div>
                <CardTitle className="line-clamp-1">{cls.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {cls.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                Created {new Date(cls.created_at).toLocaleDateString()}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
