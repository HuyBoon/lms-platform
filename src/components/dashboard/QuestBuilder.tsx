"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Sword, 
  Save, 
  Loader2,
  AlertCircle,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { createQuiz, updateQuiz } from "@/lib/actions/quiz"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Answer {
  id?: string
  answerText: string
  isCorrect: boolean
}

interface Question {
  id?: string
  questionText: string
  points: number
  answers: Answer[]
}

interface QuizData {
  id: string
  title: string
  description?: string | null
  questions: Question[]
}

export function QuestBuilder({ classId, initialData }: { classId: string, initialData?: QuizData }) {
  const router = useRouter()
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [description, setDescription] = React.useState(initialData?.description || "")
  const [questions, setQuestions] = React.useState<Question[]>(
    initialData?.questions.map(q => ({
        ...q,
        answers: q.answers.map(a => ({ ...a }))
    })) || [
    { questionText: "", points: 10, answers: [
      { answerText: "", isCorrect: true },
      { answerText: "", isCorrect: false }
    ]}
  ])
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const addQuestion = () => {
    setQuestions([...questions, { 
      questionText: "", 
      points: 10, 
      answers: [
        { answerText: "", isCorrect: true },
        { answerText: "", isCorrect: false }
      ]
    }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[index].questionText = text
    setQuestions(newQuestions)
  }

  const addAnswer = (qIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].answers.push({ answerText: "", isCorrect: false })
    setQuestions(newQuestions)
  }

  const updateAnswerText = (qIndex: number, aIndex: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].answers[aIndex].answerText = text
    setQuestions(newQuestions)
  }

  const toggleCorrect = (qIndex: number, aIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.map((a, i) => ({
      ...a,
      isCorrect: i === aIndex
    }))
    setQuestions(newQuestions)
  }

  const handleSave = async () => {
    if (!title) {
       setError("Quest Title is missing, Sage!")
       return
    }

    setIsPending(true)
    setError(null)

    const result = await createQuiz({
      title,
      description,
      classId,
      questions
    })

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      router.push(`/class/${classId}/teacher/quizzes`)
      router.refresh()
    }
  }

  return (
    <div className="space-y-12 pb-32">
      <Card className="bg-white border-4 border-slate-200 rounded-[2.5rem] sticker-shadow p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[10rem] -mr-8 -mt-8" />
        
        <div className="space-y-6 relative">
          <div className="space-y-4">
             <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic ml-2">Quest Metadata</label>
             <Input 
               placeholder="Quest Title (e.g. Trial of Ancient Logic)" 
               className="text-4xl font-black italic uppercase placeholder:text-slate-200 border-none px-0 focus-visible:ring-0 h-auto bg-transparent border-b-4 border-slate-100 rounded-none focus:border-primary transition-colors"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
             />
          </div>
          
          <Textarea 
            placeholder="Describe the epic journey that awaits your heroes..." 
            className="text-xl font-bold italic placeholder:text-slate-200 border-none px-0 focus-visible:ring-0 min-h-[100px] bg-transparent resize-none overflow-hidden"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Card>

      <div className="space-y-10">
        <div className="flex items-center justify-between px-4">
           <h3 className="text-xl font-black uppercase text-slate-300 tracking-[0.3em] italic">Hero Trials ({questions.length})</h3>
           <Sparkles className="size-6 text-yellow-400 animate-pulse" />
        </div>

        <AnimatePresence mode="popLayout">
          {questions.map((q, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: qIndex * 0.05 }}
            >
              <Card className="bg-white border-4 border-slate-200 rounded-[2rem] sticker-shadow overflow-hidden group">
                <CardHeader className="bg-slate-50/50 p-8 border-b-4 border-slate-100 border-dashed flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="size-12 rounded-2xl bg-white border-4 border-slate-200 flex items-center justify-center font-black text-slate-400 text-xl shadow-inner italic">
                         {qIndex + 1}
                     </div>
                     <CardTitle className="text-xl font-black text-foreground uppercase italic tracking-tight">Question {qIndex + 1}</CardTitle>
                  </div>
                  <button 
                    onClick={() => removeQuestion(qIndex)}
                    className="p-3 bg-white border-4 border-slate-100 rounded-2xl text-slate-300 hover:text-red-500 hover:border-red-100 transition-all active:scale-90"
                  >
                     <Trash2 className="size-5" />
                  </button>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">The Inquiry</label>
                      <Input 
                        placeholder="State your question clearly, Sage..." 
                        className="text-2xl font-black italic bg-muted/20 border-4 border-white rounded-[1.5rem] p-6 h-16 group/input focus:border-primary transition-all sticker-shadow-sm"
                        value={q.questionText}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      />
                   </div>

                   <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Potential Paths (Answers)</label>
                      <div className="grid gap-6 md:grid-cols-2">
                         {q.answers.map((a, aIndex) => (
                            <div key={aIndex} className="relative group/ans">
                               <Input 
                                  placeholder={`Answer ${aIndex + 1}...`}
                                  className={cn(
                                    "text-lg font-bold italic bg-white border-4 rounded-2xl p-6 h-14 pl-14 transition-all focus-visible:ring-0",
                                    a.isCorrect ? "border-emerald-400 text-emerald-600 bg-emerald-50/30" : "border-slate-100 text-slate-500"
                                  )}
                                  value={a.answerText}
                                  onChange={(e) => updateAnswerText(qIndex, aIndex, e.target.value)}
                               />
                               <button 
                                 onClick={() => toggleCorrect(qIndex, aIndex)}
                                 className="absolute left-4 top-1/2 -translate-y-1/2 p-1 transition-all"
                               >
                                  {a.isCorrect ? (
                                    <CheckCircle2 className="size-6 text-emerald-500 fill-emerald-50" />
                                  ) : (
                                    <Circle className="size-6 text-slate-200" />
                                  )}
                               </button>
                            </div>
                         ))}
                         <button 
                           onClick={() => addAnswer(qIndex)}
                           className="h-14 border-4 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-black uppercase italic tracking-widest hover:bg-slate-50 transition-colors"
                         >
                            <Plus className="size-5" /> Add Path
                         </button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-6 mt-16 pt-10 border-t-8 border-dashed border-slate-100">
           <button 
             onClick={addQuestion}
             className="flex-1 h-20 bg-white border-4 border-slate-200 rounded-[2rem] sticker-shadow flex items-center justify-center gap-4 text-slate-400 font-black uppercase italic tracking-widest hover:border-primary/50 hover:text-primary transition-all active:scale-95 text-xl"
           >
              <Plus className="size-8 stroke-[3]" /> Forge Another Trial
           </button>
           
           <button 
             onClick={handleSave}
             disabled={isPending}
             className="flex-1 h-20 bg-primary border-4 border-white rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(255,255,255,1),8px_8px_0px_4px_#B89600] flex items-center justify-center gap-4 text-primary-foreground font-black uppercase italic tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all text-xl disabled:opacity-50"
           >
              {isPending ? (
                <Loader2 className="size-8 animate-spin" />
              ) : (
                <>
                  <Save className="size-8 stroke-[3]" /> Finalize Scrolls
                </>
              )}
           </button>
        </div>

        {error && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-6 bg-red-50 border-4 border-red-500 rounded-3xl text-red-600 font-black uppercase italic tracking-widest flex items-center gap-4"
           >
              <AlertCircle className="size-8 shrink-0 saturate-150" />
              {error}
           </motion.div>
        )}
      </div>
    </div>
  )
}
