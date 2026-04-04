import { prisma } from "@/lib/prisma"
import { ClassTabs } from "@/components/class/ClassTabs"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { classId: string }
}) {
  const { classId } = await params

  // Fetch class title using Prisma
  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: { name: true }
  })

  if (!cls) return notFound()

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{cls.name || "Loading class..."}</h1>
        <p className="text-muted-foreground text-sm">Class ID: {classId}</p>
      </div>

      <div className="space-y-4">
        <ClassTabs classId={classId} />
        <Separator />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
