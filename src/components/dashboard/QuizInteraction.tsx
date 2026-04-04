"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitQuiz } from "@/lib/actions/quiz"
import { toast } from "sonner"
import { GraduationCap, Timer, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizInteractionProps {
  quiz: any
  classId: string
}

export function QuizInteraction({ quiz, classId }: QuizInteractionProps) {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number } | null>(null)

  const currentQuestion = quiz.questions[currentIdx]
  const isLastQuestion = currentIdx === quiz.questions.length - 1
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100

  const handleSelect = (questionId: string, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const res = await submitQuiz(quiz.id, answers)
    if (res?.success) {
      setResult({ score: res.score! })
      toast.success("Neuro-Protocol Sync Successful")
    } else {
      toast.error(res?.error || "Submission Failed")
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
        <Card className="bg-slate-900/60 border-emerald-500/20 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12">
             <CheckCircle2 className="size-48 text-emerald-400" />
          </div>
          <CardHeader className="text-center pt-12">
             <div className="size-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="size-10 text-emerald-400" />
             </div>
             <CardTitle className="text-4xl font-black text-white uppercase italic tracking-tight">EVALUATION COMPLETE</CardTitle>
             <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-xs mt-2">Neural Synchronization Hash Verified</p>
          </CardHeader>
          <CardContent className="text-center pb-12">
             <div className="text-8xl font-black text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)] mb-2">
                {result.score.toFixed(0)}<span className="text-4xl opacity-50">%</span>
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Overall Sync Efficiency</p>
          </CardContent>
          <CardFooter className="flex justify-center pb-12">
             <Button 
               onClick={() => router.push(`/class/${classId}/student`)} 
               className="rounded-2xl h-14 px-10 font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500"
             >
                Return to Hub
             </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-slate-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
         <div className="space-y-1">
            <h3 className="text-white font-black text-xl uppercase italic tracking-tight">{quiz.title}</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-60">ID: {quiz.id.slice(0, 10)}</p>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Time Elapsed</span>
               <div className="flex items-center gap-2 text-primary font-black italic">
                  <Timer className="size-4" />
                  00:00:00
               </div>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Completion</span>
               <div className="flex items-center gap-2 text-white font-black italic">
                  {currentIdx + 1} / {quiz.questions.length}
               </div>
            </div>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 border border-white/5 relative overflow-hidden">
         <div 
           className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500"
           style={{ width: `${progress}%` }}
         />
      </div>

      {/* Question Card */}
      <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md shadow-2xl min-h-[400px] flex flex-col justify-between overflow-hidden relative group">
        <div className="absolute top-0 full left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
           <GraduationCap className="size-64" />
        </div>
        <CardHeader className="p-8 pt-10">
           <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm italic shrink-0">
                 {currentIdx + 1}
              </div>
              <CardTitle className="text-2xl font-black text-white leading-tight uppercase italic tracking-tight">
                 {currentQuestion.questionText}
              </CardTitle>
           </div>
        </CardHeader>
        <CardContent className="px-8 pb-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer: any) => (
                <button
                  key={answer.id}
                  onClick={() => handleSelect(currentQuestion.id, answer.id)}
                  className={cn(
                    "relative p-6 rounded-2xl border-2 text-left transition-all group overflow-hidden",
                    answers[currentQuestion.id] === answer.id 
                    ? "bg-primary border-primary shadow-2xl shadow-primary/20 scale-[1.02]" 
                    : "bg-slate-950/50 border-white/5 hover:border-primary/50 hover:bg-slate-900"
                  )}
                >
                  <div className={cn(
                    "absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity",
                    answers[currentQuestion.id] === answer.id && "opacity-20"
                  )}>
                     <Sparkles className="size-8" />
                  </div>
                  <span className={cn(
                    "text-base font-bold tracking-tight uppercase italic",
                    answers[currentQuestion.id] === answer.id ? "text-white" : "text-slate-300"
                  )}>
                    {answer.answerText}
                  </span>
                </button>
              ))}
           </div>
        </CardContent>
        <CardFooter className="px-8 py-6 border-t border-white/5 bg-slate-950/20 flex justify-between items-center">
           <Button 
             variant="ghost" 
             disabled={currentIdx === 0}
             onClick={() => setCurrentIdx(currentIdx - 1)}
             className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white"
           >
              <ChevronLeft className="size-4 mr-2" /> Previous Directive
           </Button>
           
           {isLastQuestion ? (
             <Button 
               onClick={handleSubmit}
               disabled={!answers[currentQuestion.id] || submitting}
               className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500"
             >
                {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
                Finalize Protocol Sync
             </Button>
           ) : (
             <Button 
               onClick={() => setCurrentIdx(currentIdx + 1)}
               disabled={!answers[currentQuestion.id]}
               className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-primary/20"
             >
                Continue <ChevronRight className="size-4 ml-2" />
             </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  )
}
