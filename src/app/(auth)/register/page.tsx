"use client"

import { useState } from "react"
import { registerUser } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, User, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT")

  async function onSubmit(formData: FormData) {
    setLoading(true)
    formData.set("role", role)
    
    const result = await registerUser(formData)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-none bg-white p-2 rounded-[2.5rem] shadow-xl sticker-shadow transition-all animate-in fade-in zoom-in duration-500">
      <CardHeader className="space-y-4 pt-10 px-10 text-center">
        <div className="flex items-center gap-3 group justify-center border-b-4 border-muted/50 border-dashed pb-8">
          <div className="p-3 bg-primary rounded-2xl shadow-lg rotate-3 group-hover:rotate-12 transition-transform">
            <GraduationCap className="size-8 text-primary-foreground" />
          </div>
          <span className="text-3xl font-black tracking-tight text-foreground uppercase italic">HUYBOON <span className="text-primary font-black">PLAYHUB</span></span>
        </div>
        <div className="space-y-2 pt-4">
          <CardTitle className="text-4xl font-black tracking-tight text-foreground uppercase italic underline decoration-secondary decoration-4 underline-offset-4">Hero Discovery!</CardTitle>
          <CardDescription className="text-slate-500 font-bold text-lg italic uppercase tracking-wider">
            Choose your path to start the fun
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="px-10 pb-8">
        <form action={onSubmit} className="space-y-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">Who are you?</label>
            <div className="grid grid-cols-2 gap-4 p-2 bg-muted/30 rounded-3xl border-4 border-muted">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-sm uppercase italic tracking-widest bouncy-hover ${
                  role === "STUDENT" 
                  ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <User className="size-5" />
                Student Hero
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-sm uppercase italic tracking-widest bouncy-hover ${
                  role === "TEACHER" 
                  ? "bg-secondary text-secondary-foreground shadow-lg scale-105" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <ShieldCheck className="size-5" />
                Master Sage
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">Hero Name</label>
              <Input 
                name="name" 
                placeholder="What should we call you?" 
                required 
                className="h-14" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">Magic Email</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="hero@playhub.com" 
                required 
                className="h-14" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">Secret Key</label>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="h-14" 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 rounded-2xl text-xl font-black italic uppercase bouncy-hover"
          >
            {loading ? <Loader2 className="size-6 animate-spin" /> : "Start My Mission!"}
            {!loading && <ArrowRight className="size-6" />}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pb-10 px-10 border-t-4 border-muted/50 border-dashed pt-8 text-center">
        <p className="text-lg font-bold text-slate-500 italic">
          Already a hero?{" "}
          <Link href="/login" className="text-primary font-black hover:underline underline-offset-8">
            Enter Playroom
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
