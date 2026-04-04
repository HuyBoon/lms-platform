import { createClient } from "@/lib/supabase/server"
import { ClassTabs } from "@/components/class/ClassTabs"
import { Separator } from "@/components/ui/separator"

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { classId: string }
}) {
  const supabase = await createClient()
  const { classId } = await params

  // Fetch class title
  const { data: cls } = await supabase
    .from('classes')
    .select('name')
    .eq('id', classId)
    .single()

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{cls?.name || "Loading class..."}</h1>
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
