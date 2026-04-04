'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ClassTabs({ classId }: { classId: string }) {
  const pathname = usePathname()
  
  // Determine active tab based on pathname
  let activeTab = "materials"
  if (pathname.includes("/quizzes")) activeTab = "quizzes"
  if (pathname.includes("/leaderboard")) activeTab = "leaderboard"

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
        <TabsTrigger value="materials" render={(props) => (
          <Link {...props} href={`/class/${classId}/materials`}>
            Materials
          </Link>
        )} />
        <TabsTrigger value="quizzes" render={(props) => (
          <Link {...props} href={`/class/${classId}/quizzes`}>
            Quizzes
          </Link>
        )} />
        <TabsTrigger value="leaderboard" render={(props) => (
          <Link {...props} href={`/class/${classId}/leaderboard`}>
            Leaderboard
          </Link>
        )} />
      </TabsList>
    </Tabs>
  )
}
