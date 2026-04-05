"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Users, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { enrollInWorld } from "@/lib/actions/enrollment"
import { useRouter } from "next/navigation"

interface WorldCardProps {
  world: {
    id: string
    name: string
    description: string | null
    teacher: {
      name: string | null
      image: string | null
    }
    _count: {
      enrollments: number
      quizzes: number
    }
  }
  index: number
}

export function WorldCard({ world, index }: WorldCardProps) {
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  const colors = [
    { bg: "bg-yellow-400/10", border: "border-yellow-400", meta: "text-yellow-600", shadow: "shadow-yellow-400/20" },
    { bg: "bg-blue-400/10", border: "border-blue-400", meta: "text-blue-600", shadow: "shadow-blue-400/20" },
    { bg: "bg-pink-400/10", border: "border-pink-400", meta: "text-pink-600", shadow: "shadow-pink-400/20" },
    { bg: "bg-green-400/10", border: "border-green-400", meta: "text-green-600", shadow: "shadow-green-400/20" },
  ]
  const color = colors[index % colors.length]

  async function handleJoin() {
    setIsJoining(true)
    try {
      const result = await enrollInWorld(world.id)
      if (result.success) {
        // Celebratory redirect could happen here, or just let revalidate work
        router.push(`/class/${world.id}/student`)
      } else if (result.error) {
        alert(result.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Card className={cn(
      "group relative overflow-hidden border-4 bg-white transition-all bouncy-hover sticker-shadow h-full p-0 flex flex-col",
      color.border
    )}>
      <div className={cn("absolute -top-6 -right-6 p-6 opacity-10 group-hover:opacity-20 transition-all rotate-12 group-hover:rotate-45", color.meta)}>
        <Sparkles className="size-32" />
      </div>
      
      <div className={cn("h-40 w-full flex items-center justify-center relative overflow-hidden", color.bg)}>
         <BookOpen className={cn("size-20 opacity-40 group-hover:scale-125 transition-transform", color.meta)} />
         <div className="absolute top-4 left-4">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-white text-slate-500 shadow-sm">
              NEW WORLD
            </span>
         </div>
      </div>

      <CardHeader className="p-8 space-y-3 flex-grow">
        <div className="flex items-center gap-2 text-primary font-black italic uppercase text-xs tracking-widest mb-1">
          <Wand2 className="size-4" />
          Sage: {world.teacher.name || "Unknown Master"}
        </div>
        <CardTitle className="text-3xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight uppercase italic leading-tight line-clamp-1">
          {world.name}
        </CardTitle>
        <CardDescription className="text-slate-500 font-bold italic line-clamp-3 text-base">
          {world.description || "An unexplored world waiting for a brave hero to begin their legend!"}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("p-8 pt-0 flex flex-col gap-6", color.bg)}>
        <div className="flex items-center gap-8 border-t-4 border-dashed pt-6 border-white/50">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Current Explorers</span>
            <div className="flex items-center gap-1.5 font-black text-2xl text-foreground italic">
              <Users className="size-5 text-blue-500" />
              {world._count.enrollments}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Quests Awaiting</span>
            <div className="flex items-center gap-1.5 font-black text-2xl text-foreground italic">
              <GraduationCap className="size-5 text-emerald-500" />
              {world._count.quizzes}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleJoin}
          loading={isJoining}
          size="lg"
          className={cn(
            "w-full bouncy-hover italic text-xl",
            isJoining ? "opacity-50" : ""
          )}
        >
          JOIN ADVENTURE ⚔️
        </Button>
      </CardContent>
    </Card>
  )
}
