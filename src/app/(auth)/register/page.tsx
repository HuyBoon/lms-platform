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
    <Card className="w-full max-w-lg border-none bg-slate-900/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
      <CardHeader className="space-y-4 pt-10 px-10">
        <div className="flex items-center gap-2 group justify-center border-b border-white/5 pb-6">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 group-hover:scale-110 transition-transform">
            <GraduationCap className="size-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">HUYBOON</span>
        </div>
        <div className="text-center space-y-1.5 pt-4">
          <CardTitle className="text-3xl font-black tracking-tight text-white uppercase italic">ACCESS INITIALIZATION</CardTitle>
          <CardDescription className="text-slate-400 font-bold text-sm tracking-wide uppercase">
            Configure your academic parameters
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="px-10 pb-8">
        <form action={onSubmit} className="space-y-8">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Environment Protocol</label>
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-950/50 rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
                  role === "STUDENT" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <User className="size-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
                  role === "TEACHER" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <ShieldCheck className="size-4" />
                Teacher
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Universal Identifier</label>
              <Input 
                name="name" 
                placeholder="Huy Boon" 
                required 
                className="h-12 bg-slate-950/50 border-white/5 focus:border-primary/50 focus:ring-primary/20 rounded-xl px-4 text-white font-medium placeholder:opacity-40" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Neural Sync Access (Email)</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="dev@huyboon.com" 
                required 
                className="h-12 bg-slate-950/50 border-white/5 focus:border-primary/50 focus:ring-primary/20 rounded-xl px-4 text-white font-medium placeholder:opacity-40" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Encryption Sequence</label>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="h-12 bg-slate-950/50 border-white/5 focus:border-primary/50 focus:ring-primary/20 rounded-xl px-4 text-white font-medium placeholder:opacity-40" 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl font-black text-xs tracking-[0.2em] uppercase gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-100"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : "ENGAGE SYSTEM"}
            {!loading && <ArrowRight className="size-5" />}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pb-10 px-10 border-t border-white/5 pt-6 bg-slate-950/5 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Already verified?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4 tracking-tight">
            Access Vault
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
