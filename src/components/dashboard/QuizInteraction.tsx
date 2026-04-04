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
      <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in zoom-in duration-700">
        <Card className="bg-white border-8 border-emerald-400 sticker-shadow overflow-hidden relative rounded-[3rem]">
          <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12">
             <CheckCircle2 className="size-48 text-emerald-500" />
          </div>
          <CardHeader className="text-center pt-16">
             <div className="size-24 bg-emerald-100 border-4 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
                <CheckCircle2 className="size-12 text-emerald-500 stroke-[3]" />
             </div>
             <CardTitle className="text-5xl font-black text-foreground uppercase italic tracking-tight underline decoration-emerald-400 decoration-8 underline-offset-8">QUEST ACCOMPLISHED!</CardTitle>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-4 italic">You did an amazing job, Hero!</p>
          </CardHeader>
          <CardContent className="text-center pb-16">
             <div className="text-9xl font-black text-emerald-500 drop-shadow-[0_0_30px_rgba(52,211,153,0.4)] mb-3 italic">
                {result.score.toFixed(0)}<span className="text-4xl opacity-50 not-italic">%</span>
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Your Final Magic Score</p>
          </CardContent>
          <CardFooter className="flex justify-center pb-16">
             <Button 
               onClick={() => router.push(`/class/${classId}/student`)} 
               className="rounded-3xl h-16 px-12 font-black uppercase italic tracking-widest shadow-[8px_8px_0px_0px_#059669] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bg-emerald-500 hover:bg-emerald-400 text-white text-lg bouncy-hover"
             >
                Return to Hub
             </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-[2.5rem] border-4 border-muted sticker-shadow gap-6">
         <div className="space-y-2 text-center md:text-left">
            <h3 className="text-foreground font-black text-3xl uppercase italic tracking-tight">{quiz.title}</h3>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">Mission # {quiz.id.slice(0, 8).toUpperCase()}</p>
         </div>
         <div className="flex items-center gap-10">
            <div className="flex flex-col items-center md:items-end">
               <span className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1 italic">Quest Timer</span>
               <div className="flex items-center gap-2 text-secondary font-black text-2xl italic">
                  <Timer className="size-6" />
                  00:00
               </div>
            </div>
            <div className="h-12 w-1 bg-muted rounded-full hidden md:block" />
            <div className="flex flex-col items-center md:items-end">
               <span className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1 italic">World Progress</span>
               <div className="flex items-center gap-2 text-foreground font-black text-2xl italic">
                  {currentIdx + 1} <span className="text-slate-300">/</span> {quiz.questions.length}
               </div>
            </div>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-4 border-4 border-white shadow-inner relative overflow-hidden">
         <div 
           className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-1000 ease-out"
           style={{ width: `${progress}%` }}
         />
      </div>

      {/* Question Card */}
      <Card className="bg-white border-4 border-muted rounded-[3rem] sticker-shadow min-h-[450px] flex flex-col justify-between overflow-hidden relative group">
        <div className="absolute -top-12 -left-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity rotate-[-15deg] group-hover:rotate-0">
           <GraduationCap className="size-80" />
        </div>
        <CardHeader className="p-10 pb-6 relative z-10">
           <div className="flex items-start gap-6">
              <div className="size-14 rounded-2xl bg-primary border-4 border-white shadow-md flex items-center justify-center text-primary-foreground font-black text-2xl italic shrink-0 rotate-[-8deg] group-hover:rotate-0 transition-transform">
                 {currentIdx + 1}
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-foreground leading-tight uppercase italic tracking-tight mt-1">
                 {currentQuestion.questionText}
              </CardTitle>
           </div>
        </CardHeader>
        <CardContent className="px-10 pb-16 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuestion.answers.map((answer: any) => (
                <button
                  key={answer.id}
                  onClick={() => handleSelect(currentQuestion.id, answer.id)}
                  className={cn(
                    "relative p-8 rounded-[2rem] border-4 text-left transition-all bouncy-hover overflow-hidden group/btn h-full flex items-center",
                    answers[currentQuestion.id] === answer.id 
                    ? "bg-primary border-primary shadow-[6px_6px_0px_0px_#B89600] active:shadow-none translate-y-[-4px]" 
                    : "bg-white border-muted hover:border-primary/50 text-slate-500"
                  )}
                >
                  <div className={cn(
                    "absolute top-0 right-0 p-4 opacity-0 group-hover/btn:opacity-20 transition-opacity",
                    answers[currentQuestion.id] === answer.id && "opacity-40"
                  )}>
                     <Sparkles className="size-10" />
                  </div>
                  <span className={cn(
                    "text-xl font-black tracking-tight uppercase italic leading-tight",
                    answers[currentQuestion.id] === answer.id ? "text-primary-foreground" : "text-slate-500 group-hover/btn:text-foreground"
                  )}>
                    {answer.answerText}
                  </span>
                </button>
              ))}
           </div>
        </CardContent>
        <CardFooter className="px-10 py-8 border-t-4 border-dashed border-muted bg-muted/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <Button 
             variant="ghost" 
             disabled={currentIdx === 0}
             onClick={() => setCurrentIdx(currentIdx - 1)}
             className="text-slate-300 font-black uppercase text-xs tracking-[0.2em] hover:text-foreground bouncy-hover h-12 flex items-center gap-2"
           >
              <ChevronLeft className="size-5" /> Go Back
           </Button>
           
           {isLastQuestion ? (
             <Button 
               onClick={handleSubmit}
               disabled={!answers[currentQuestion.id] || submitting}
               className="rounded-[2rem] h-16 px-12 font-black uppercase italic tracking-widest shadow-[8px_8px_0px_0px_#059669] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bg-emerald-500 hover:bg-emerald-400 text-white text-lg bouncy-hover"
             >
                {submitting ? <Loader2 className="size-6 animate-spin mr-3" /> : <CheckCircle2 className="size-6 mr-3 stroke-[3]" />}
                Finish Quest!
             </Button>
           ) : (
             <Button 
               onClick={() => setCurrentIdx(currentIdx + 1)}
               disabled={!answers[currentQuestion.id]}
               className="rounded-[2rem] h-16 px-12 font-black uppercase italic tracking-widest shadow-[8px_8px_0px_0px_#B89600] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bg-primary hover:bg-primary/90 text-primary-foreground text-lg bouncy-hover flex items-center gap-3"
             >
                Next Level <ChevronRight className="size-6 stroke-[3]" />
             </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  )
}
