"use client"

import { useState } from "react"
import { deleteQuiz } from "@/lib/actions/quiz"
import { 
  ScrollText, 
  Trash2, 
  Edit3,
  Clock, 
  Plus, 
  ChevronRight,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button-variants"

interface Quiz {
  id: string
  title: string
  description?: string | null
  createdAt: Date
  _count: {
    questions: number
    submissions: number
  }
}

interface QuizzesListProps {
  quizzes: Quiz[]
  classId: string
  isTeacher?: boolean
}

export function QuizzesList({ quizzes, classId, isTeacher = false }: QuizzesListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to transmute this quest scroll back into energy?")) return
    
    setLoadingId(id)
    const result = await deleteQuiz(id, classId)
    
    if (result.error) {
      toast.error(result.error)
      setLoadingId(null)
    } else {
      toast.success("Quest transmuted successfully!")
    }
  }

  if (quizzes.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center border-8 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/50 space-y-10 group">
         <div className="relative">
            <div className="p-12 bg-white rounded-[2.5rem] shadow-2xl border-8 border-pink-200 rotate-3 sticker-shadow group-hover:scale-110 transition-transform">
               <ScrollText className="size-32 text-slate-100 group-hover:text-pink-100 transition-colors duration-500" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 size-16 text-yellow-500 animate-pulse" />
         </div>
         <div className="text-center space-y-4">
            <p className="text-4xl font-black uppercase tracking-tight text-slate-300 italic leading-none">The Vault is Empty</p>
            <p className="text-slate-400 font-bold italic text-xl uppercase tracking-widest">No Quest Scrolls discovered in this world yet.</p>
            {isTeacher && (
              <Link 
                href={`/class/${classId}/teacher/quizzes/new`}
                className={cn(buttonVariants({ variant: "outline" }), "mt-10 rounded-3xl border-4 border-pink-400 text-pink-500 font-black italic uppercase tracking-widest px-8 h-14 hover:bg-pink-50 transition-all")}
              >
                Forge First Quest
              </Link>
            )}
         </div>
      </div>
    )
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="group bg-white border-4 border-slate-200 rounded-[2.5rem] sticker-shadow overflow-hidden p-0 flex flex-col transition-all hover:border-pink-300">
          <CardHeader className="p-8 bg-pink-50/50 border-b-4 border-slate-100 border-dashed relative">
             <div className="flex justify-between items-start mb-4">
                <div className="px-4 py-1 bg-white border-2 border-pink-200 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                  <Clock className="size-3" /> {new Date(quiz.createdAt).toLocaleDateString()}
                </div>
                {isTeacher && (
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/class/${classId}/teacher/quizzes/${quiz.id}/edit`}
                      className="p-2 text-slate-300 hover:text-primary transition-colors"
                    >
                      <Edit3 className="size-5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(quiz.id)}
                      disabled={loadingId === quiz.id}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                )}
             </div>
             <CardTitle className="text-2xl font-black text-foreground uppercase italic tracking-tight mb-2 group-hover:text-pink-600 transition-colors">{quiz.title}</CardTitle>
             <CardDescription className="text-slate-500 font-bold italic line-clamp-2">
                {quiz.description || "No description provided for this epic trial."}
             </CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex-grow space-y-8">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Trial Size</p>
                   <p className="text-2xl font-black text-foreground italic flex items-center gap-2">
                     {quiz._count.questions} <span className="text-xs text-slate-400">Questions</span>
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Participation</p>
                   <p className="text-2xl font-black text-foreground italic flex items-center gap-2">
                     {quiz._count.submissions} <span className="text-xs text-slate-400">Heroes</span>
                   </p>
                </div>
             </div>

             <Link 
               href={isTeacher ? `/class/${classId}/teacher/quizzes/${quiz.id}` : `/class/${classId}/quizzes/${quiz.id}`}
               className="w-full h-14 rounded-2xl border-4 border-slate-200 bg-white text-slate-400 font-black italic uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:border-pink-500 hover:text-pink-500 group-hover:bg-pink-50"
             >
               {isTeacher ? "Explore Trial" : "Enter Quest"} <ChevronRight className="size-5" />
             </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
