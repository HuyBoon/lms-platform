'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, ClipboardList, Trophy } from "lucide-react"

export function ClassTabs({ classId }: { classId: string }) {
  const pathname = usePathname()
  
  // Determine active tab based on pathname
  let activeTab = "materials"
  if (pathname.includes("/quizzes")) activeTab = "quizzes"
  if (pathname.includes("/leaderboard")) activeTab = "leaderboard"

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted/50 p-1 text-muted-foreground w-full lg:w-auto">
        <TabsTrigger 
          value="materials" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm group"
          render={(props) => (
            <Link {...props} href={`/class/${classId}/materials`} className="flex items-center gap-2">
              <BookOpen className="size-4 opacity-70 group-data-[state=active]:opacity-100 transition-opacity" />
              <span>Materials</span>
            </Link>
          )} 
        />
        <TabsTrigger 
          value="quizzes" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm group"
          render={(props) => (
            <Link {...props} href={`/class/${classId}/quizzes`} className="flex items-center gap-2">
              <ClipboardList className="size-4 opacity-70 group-data-[state=active]:opacity-100 transition-opacity" />
              <span>Quizzes</span>
            </Link>
          )} 
        />
        <TabsTrigger 
          value="leaderboard" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm group"
          render={(props) => (
            <Link {...props} href={`/class/${classId}/leaderboard`} className="flex items-center gap-2">
              <Trophy className="size-4 opacity-70 group-data-[state=active]:opacity-100 transition-opacity" />
              <span>Leaderboard</span>
            </Link>
          )} 
        />
      </TabsList>
    </Tabs>
  )
}
