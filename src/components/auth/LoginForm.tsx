'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { loginUser } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await loginUser(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <Card className="w-full border-none bg-white p-2 rounded-[2.5rem] shadow-xl sticker-shadow transition-all">
      <CardHeader className="space-y-2 pt-8 px-8 text-center">
        <CardTitle className="text-3xl font-black tracking-tight text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-4">Time to Play!</CardTitle>
        <CardDescription className="text-slate-500 font-bold italic text-lg uppercase tracking-wider">
          Jump back into your adventure!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-8 space-y-6 pb-6">
        {/* Social Provider */}
        <Button 
          variant="outline" 
          className="w-full h-14 rounded-2xl border-4 border-muted hover:border-primary hover:bg-primary/5 transition-all gap-3 text-foreground font-black uppercase italic tracking-widest bouncy-hover" 
          onClick={handleGoogleLogin}
          type="button"
        >
          <svg className="size-6" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              fill="#EA4335"
            />
          </svg>
          Magic Login
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-4 border-muted/50 border-dashed" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] font-black text-slate-400">
            <span className="bg-white px-6">OR USE KEY</span>
          </div>
        </div>

        <form action={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">Secret Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="hero@playhub.com" 
                  required 
                  className="pl-12" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">Hidden Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="pl-12" 
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 rounded-2xl text-xl font-black italic uppercase bouncy-hover"
          >
            {loading ? <Loader2 className="size-6 animate-spin" /> : "Let's Go!"}
            {!loading && <ArrowRight className="size-6" />}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="pb-8 px-8 flex flex-col items-center">
        <p className="text-lg font-bold text-slate-500 italic">
          New here?{" "}
          <Link href="/register" className="text-secondary font-black hover:underline underline-offset-8">
            Create Hero
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
