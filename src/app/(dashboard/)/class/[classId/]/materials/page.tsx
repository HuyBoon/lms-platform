import { createClient } from "@/lib/supabase/server"
import { FileDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function MaterialsPage({
  params,
}: {
  params: { classId: string }
}) {
  const { classId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single()

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'

  // Fetch materials for the class
  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('class_id', classId)
    .order('chapter_session', { ascending: true })

  // Group materials by chapter_session
  const groupedMaterials: Record<string, any[]> = (materials || []).reduce((acc, material) => {
    const chapter = material.chapter_session || 'Other Materials'
    if (!acc[chapter]) {
      acc[chapter] = []
    }
    acc[chapter].push(material)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course Materials</h2>
        {isTeacher && (
          <Button variant="outline" className="gap-2">
            <Plus className="size-4" /> Upload Material
          </Button>
        )}
      </div>

      {Object.keys(groupedMaterials).length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-center text-sm text-muted-foreground">
          No materials uploaded yet.
        </div>
      ) : (
        Object.entries(groupedMaterials).map(([chapter, items]) => (
          <div key={chapter} className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-2 py-0.5 font-medium uppercase text-xs">
                {chapter}
              </Badge>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:bg-muted/50 transition-colors">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileDown className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground italic">
                          Click to view or download
                        </p>
                      </div>
                    </div>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
