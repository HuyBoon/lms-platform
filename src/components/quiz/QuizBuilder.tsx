"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createQuiz } from "@/lib/actions/quiz"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, Save, ArrowLeft, HelpCircle, GripVertical, CheckCircle2, AlertCircle } from "lucide-react"
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
      points: 1,
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
        points: 1,
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
      toast.error("At least one question is required.")
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
      toast.error("At least two answers are required.")
    }
  }

  const updateAnswer = (qIndex: number, aIndex: number, field: keyof Answer, value: any) => {
    const updated = [...questions]
    // If setting isCorrect to true, set others to false (Single Choice for now)
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
    // Validation
    if (!title.trim()) return toast.error("Quiz title is required")
    if (questions.some(q => !q.questionText.trim())) return toast.error("All questions must have text")
    if (questions.some(q => q.answers.every(a => !a.isCorrect))) return toast.error("Every question needs a correct answer")
    if (questions.some(q => q.answers.some(a => !a.answerText.trim()))) return toast.error("All answers must have text")

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
      toast.success("Quiz built successfully!")
      router.push(`/class/${classId}/teacher`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="sticky top-0 z-40 flex items-center justify-between py-6 px-4 mb-8 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center gap-4">
          <Link href={`/class/${classId}/teacher`} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight">Builder Mode</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title || "Untitled Assessment"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 px-6 rounded-xl font-bold" onClick={() => router.back()}>
            Discard
          </Button>
          <Button className="h-10 px-6 rounded-xl font-black gap-2 shadow-lg shadow-primary/20" onClick={handleSave} disabled={loading}>
            <Save className="size-4" />
            {loading ? "Constructing..." : "Finalize Quiz"}
          </Button>
        </div>
      </div>

      <div className="space-y-12 px-2">
        {/* Quiz Metadata */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <HelpCircle className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-black">Meta Information</h2>
          </div>
          <Card className="border-none shadow-xl bg-card/40 backdrop-blur-sm p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Assessment Title</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Physics: Thermodynamics"
                className="h-14 bg-muted/20 border-border/40 text-lg font-bold rounded-2xl px-6"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Contextual Description (Optional)</label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the scope of this assessment..."
                className="min-h-[100px] bg-muted/20 border-border/40 font-medium rounded-2xl p-6 resize-none"
              />
            </div>
          </Card>
        </section>

        {/* Questions Area */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <CheckCircle2 className="size-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-black">Question Stack</h2>
            </div>
            <Badge variant="outline" className="text-xs font-black px-3 py-1">
              {questions.length} MODULES
            </Badge>
          </div>

          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="relative group">
                <Card className="border-none shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden group-hover:shadow-2xl transition-all">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  
                  <div className="p-8 space-y-8">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center gap-4">
                           <span className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-black text-xs">
                             {qIndex + 1}
                           </span>
                           <Input 
                             value={q.questionText}
                             onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                             placeholder="Instate the question text here..."
                             className="h-12 border-none bg-transparent text-xl font-bold p-0 focus-visible:ring-0 placeholder:opacity-50"
                           />
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-xl border border-border/20">
                          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Points</span>
                          <input 
                            type="number"
                            value={q.points}
                            onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                            className="w-8 bg-transparent border-none text-sm font-black focus:outline-none"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" 
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Answers Grid */}
                    <div className="grid gap-4 pl-12">
                      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 leading-none">Response Variants</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 leading-none px-4">Key</span>
                      </div>
                      
                      {q.answers.map((a, aIndex) => (
                        <div key={aIndex} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                          <Input 
                            value={a.answerText}
                            onChange={(e) => updateAnswer(qIndex, aIndex, 'answerText', e.target.value)}
                            placeholder={`Option ${aIndex + 1}`}
                            className="h-11 bg-muted/20 border-border/20 rounded-xl px-4 font-semibold"
                          />
                          <div className="flex items-center gap-2 pr-2">
                            <Checkbox 
                              checked={a.isCorrect}
                              onCheckedChange={(checked) => updateAnswer(qIndex, aIndex, 'isCorrect', !!checked)}
                              className="size-6 rounded-lg transition-all"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="size-9 rounded-lg text-muted-foreground/40 hover:text-destructive" 
                              onClick={() => removeAnswer(qIndex, aIndex)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addAnswer(qIndex)}
                        className="w-fit text-xs font-bold text-primary hover:bg-primary/5 mt-2 gap-2"
                      >
                        <Plus className="size-4" /> Add Logic Alternative
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            <Button 
              variant="outline" 
              className="w-full h-20 border-2 border-dashed border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/40 rounded-3xl transition-all gap-3 overflow-hidden group"
              onClick={addQuestion}
            >
              <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="size-6 text-primary" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-lg font-black tracking-tight">Expand Assessment</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Add another question module</span>
              </div>
            </Button>
          </div>
        </section>

        {/* Final Guidelines */}
        <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 flex gap-6">
          <div className="p-4 bg-emerald-500/10 rounded-2xl h-fit">
            <AlertCircle className="size-6 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-emerald-400">Automated Grading Integrity</h3>
            <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-2xl">
              Ensure only one answer is marked as correct for single-choice logic. 
              The system will automatically calculate the total score based on the sum of question points defined within the builder.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
