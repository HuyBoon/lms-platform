"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createQuiz } from "@/lib/actions/quiz"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, Save, ArrowLeft, Wand2, Sparkles, Sword, Trophy, Zap, AlertCircle, ScrollText } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Answer {
  answerText: string
  isCorrect: boolean
}

interface Question {
  questionText: string
  points: number
  answers: Answer[]
}

interface QuizBuilderProps {
  classId: string
}

export function QuizBuilder({ classId }: QuizBuilderProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      points: 10,
      answers: [
        { answerText: "", isCorrect: true },
        { answerText: "", isCorrect: false }
      ]
    }
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        points: 10,
        answers: [
          { answerText: "", isCorrect: true },
          { answerText: "", isCorrect: false }
        ]
      }
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    } else {
      toast.error("A Quest needs at least one Challenge!")
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const addAnswer = (qIndex: number) => {
    const updated = [...questions]
    updated[qIndex].answers.push({ answerText: "", isCorrect: false })
    setQuestions(updated)
  }

  const removeAnswer = (qIndex: number, aIndex: number) => {
    if (questions[qIndex].answers.length > 2) {
      const updated = [...questions]
      updated[qIndex].answers = updated[qIndex].answers.filter((_, i) => i !== aIndex)
      setQuestions(updated)
    } else {
      toast.error("Every Challenge needs at least two paths!")
    }
  }

  const updateAnswer = (qIndex: number, aIndex: number, field: keyof Answer, value: any) => {
    const updated = [...questions]
    if (field === 'isCorrect' && value === true) {
      updated[qIndex].answers = updated[qIndex].answers.map((a, i) => ({
        ...a,
        isCorrect: i === aIndex
      }))
    } else {
      updated[qIndex].answers[aIndex] = { ...updated[qIndex].answers[aIndex], [field]: value }
    }
    setQuestions(updated)
  }

  async function handleSave() {
    if (!title.trim()) return toast.error("Your Quest needs a name, Great Sage!")
    if (questions.some(q => !q.questionText.trim())) return toast.error("All Challenges must have lore (text)!")
    if (questions.some(q => q.answers.every(a => !a.isCorrect))) return toast.error("Every Challenge needs a Victory Path!")
    
    setLoading(true)
    const result = await createQuiz({
      title,
      description,
      classId,
      questions
    })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("Huzzah! Your Quest has been forged!")
      router.push(`/class/${classId}/teacher`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Magic Portal Header */}
      <div className="sticky top-4 z-50 flex items-center justify-between p-6 mb-12 bg-white/90 backdrop-blur-xl border-4 border-primary rounded-[2.5rem] sticker-shadow">
        <div className="flex items-center gap-6">
          <Link href={`/class/${classId}/teacher`} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all bouncy-hover border-2 border-slate-200 group">
            <ArrowLeft className="size-6 text-slate-400 group-hover:text-slate-600" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <Wand2 className="size-5 text-primary animate-pulse" />
               <h1 className="text-2xl font-black tracking-tight uppercase italic text-foreground">QUEST MASTER</h1>
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic opacity-60">Forge Your Adventure</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 px-8 rounded-2xl border-4 border-slate-200 font-black italic uppercase transition-all hover:bg-slate-50" onClick={() => router.back()}>
            Discard
          </Button>
          <Button className="h-12 px-8 rounded-2xl font-black italic uppercase gap-2 sticker-shadow bouncy-hover bg-primary shadow-[4px_4px_0px_0px_#B89600]" onClick={handleSave} disabled={loading}>
            <Save className="size-5" />
            {loading ? "Forging..." : "Finalize Quest ⚔️"}
          </Button>
        </div>
      </div>

      <div className="space-y-16 px-4">
        {/* Quest Lore Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-yellow-400 rounded-2xl border-4 border-white sticker-shadow rotate-[-3deg]">
              <ScrollText className="size-8 text-white" />
            </div>
            <div className="space-y-1">
               <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground">Quest Lore</h2>
               <p className="text-slate-500 font-bold italic">The story behind your challenge...</p>
            </div>
          </div>
          <Card className="border-4 border-white bg-white sticker-shadow rounded-[3rem] p-10 space-y-8 group transition-transform hover:scale-[1.01]">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 ml-2 italic">Quest Title</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Secret of the Magic Kingdom..."
                className="h-16 bg-slate-50 border-4 border-slate-100 focus:border-primary text-2xl font-black rounded-2xl px-8 italic placeholder:opacity-30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 ml-2 italic">Contextual Lore</label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Once upon a time, in a world far away..."
                className="min-h-[120px] bg-slate-50 border-4 border-slate-100 focus:border-primary font-bold italic text-lg rounded-3xl p-8 resize-none placeholder:opacity-30"
              />
            </div>
          </Card>
        </section>

        {/* Quest Challenges area */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-pink-500 rounded-2xl border-4 border-white sticker-shadow rotate-[3deg]">
                <Sword className="size-8 text-white" />
              </div>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground">Challenges</h2>
                 <p className="text-slate-500 font-bold italic">The trials your heroes must face!</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="relative group/card">
                <Card className="border-4 border-white bg-white sticker-shadow-lg rounded-[3rem] overflow-hidden group-hover/card:translate-y-[-4px] transition-all">
                  <div className="h-4 w-full bg-primary/10 group-hover/card:bg-primary/20 transition-colors" />
                  
                  <div className="p-10 space-y-10">
                    {/* Challenge Header */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                      <div className="flex-1 w-full space-y-6">
                         <div className="flex items-center gap-6">
                           <div className="flex items-center justify-center size-14 rounded-2xl bg-primary border-4 border-white sticker-shadow text-white font-black text-2xl italic rotate-[-5deg] group-hover/card:rotate-0 transition-transform">
                             {qIndex + 1}
                           </div>
                           <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Challenge Task</label>
                              <Input 
                                value={q.questionText}
                                onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                placeholder="What is the true power of coding?..."
                                className="h-12 border-none bg-transparent text-3xl font-black p-0 focus-visible:ring-0 placeholder:opacity-30 italic leading-none"
                              />
                           </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none flex items-center justify-between gap-4 bg-muted/40 px-6 py-3 rounded-2xl border-4 border-white sticker-shadow">
                          <span className="text-xs font-black uppercase text-slate-400 italic">XP Reward</span>
                          <div className="flex items-center gap-2">
                             <Zap className="size-4 text-yellow-500 fill-yellow-500" />
                             <input 
                              type="number"
                              value={q.points}
                              onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                              className="w-10 bg-transparent border-none text-xl font-black focus:outline-none italic text-primary"
                            />
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-14 rounded-2xl text-slate-300 hover:text-destructive hover:bg-destructive/5 transition-all active:scale-90 border-2 border-transparent hover:border-destructive/10" 
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="size-6" />
                        </Button>
                      </div>
                    </div>

                    {/* Solutions Grid */}
                    <div className="grid gap-6 pl-0 md:pl-20">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">Possible Paths</span>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">Victory?</span>
                      </div>
                      
                      <div className="grid gap-4">
                        {q.answers.map((a, aIndex) => (
                          <div key={aIndex} className="flex items-center gap-4 p-2 rounded-2xl bg-slate-50 border-4 border-white sticker-shadow hover:bg-white transition-all group/ans">
                            <div className="size-8 rounded-xl bg-slate-200/50 flex items-center justify-center text-[10px] font-black text-slate-400">
                              {String.fromCharCode(65 + aIndex)}
                            </div>
                            <Input 
                              value={a.answerText}
                              onChange={(e) => updateAnswer(qIndex, aIndex, 'answerText', e.target.value)}
                              placeholder={`Path to destiny...`}
                              className="h-10 bg-transparent border-none focus-visible:ring-0 text-lg font-bold italic"
                            />
                            <div className="flex items-center gap-2 pr-2">
                              <Checkbox 
                                checked={a.isCorrect}
                                onCheckedChange={(checked) => updateAnswer(qIndex, aIndex, 'isCorrect', !!checked)}
                                className={cn(
                                  "size-8 rounded-xl transition-all border-4",
                                  a.isCorrect ? "bg-primary border-primary" : "bg-white border-slate-200"
                                )}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded-lg text-slate-300 hover:text-destructive opacity-0 group-hover/ans:opacity-100 transition-all" 
                                onClick={() => removeAnswer(qIndex, aIndex)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addAnswer(qIndex)}
                        className="w-fit text-sm font-black text-primary hover:bg-primary/5 mt-4 gap-2 border-2 border-dashed border-primary/20 rounded-xl h-10 px-6"
                      >
                        <Plus className="size-4" /> ADD MORE MAGIC
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            <Button 
              variant="outline" 
              className="w-full h-28 border-8 border-dashed border-primary/10 bg-white/50 hover:bg-white hover:border-primary/20 rounded-[3rem] transition-all gap-6 group sticker-shadow overflow-hidden active:scale-[0.98]"
              onClick={addQuestion}
            >
              <div className="p-5 bg-primary/10 rounded-2xl border-4 border-white sticker-shadow group-hover:rotate-12 transition-transform">
                <Plus className="size-10 text-primary" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-2xl font-black tracking-tight italic uppercase text-foreground">Summon Next Challenge</span>
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em] italic opacity-60">Add another portal to your quest</span>
              </div>
            </Button>
          </div>
        </section>

        {/* Sage Wisdom section */}
        <section className="relative overflow-hidden bg-primary/5 border-8 border-white sticker-shadow rounded-[3rem] p-12 flex flex-col md:flex-row gap-10 items-center justify-between group">
           {/* Decor */}
           <Sparkles className="absolute -top-10 -right-10 size-40 text-primary/5 group-hover:text-primary/10 transition-colors" />
           
           <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
              <div className="p-6 bg-primary rounded-3xl border-4 border-white sticker-shadow rotate-[5deg] group-hover:rotate-0 transition-transform">
                 <Zap className="size-10 text-white fill-white" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight">Sage Wisdom</h3>
                 <p className="text-slate-500 font-bold italic text-lg max-w-xl">
                    Heroes earn Magic XP based on the rewards you set! Make sure your Challenges are epic and your Victory Paths are clear.
                 </p>
              </div>
           </div>
           
           <Button className="h-16 px-12 rounded-2xl font-black italic uppercase text-xl gap-3 sticker-shadow bouncy-hover bg-primary shadow-[6px_6px_0px_0px_#B89600]" onClick={handleSave} disabled={loading}>
              <Sword className="size-6" />
              Finalize Quest ⚔️
           </Button>
        </section>
      </div>
    </div>
  )
}
