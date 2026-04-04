import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
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
  const session = await auth()
  const user = session?.user

  if (!user) return null

  const isTeacher = user.role === 'TEACHER' || user.role === 'ADMIN'

  // Fetch materials for the class using Prisma
  const materials = await prisma.material.findMany({
    where: { classId: classId },
    orderBy: { chapterSession: 'asc' }
  })

  // Group materials by chapterSession
  const groupedMaterials: Record<string, any[]> = (materials || []).reduce((acc, material) => {
    const chapter = material.chapterSession || 'Other Materials'
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
                    href={item.fileUrl}
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
