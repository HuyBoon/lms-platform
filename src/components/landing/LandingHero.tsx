import { Zap, ArrowRight, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"

interface LandingHeroProps {
  isLoggedIn: boolean
}

export function LandingHero({ isLoggedIn }: LandingHeroProps) {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-6">
      <div className="container mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-primary text-xs font-black tracking-widest uppercase">
          <Zap className="size-3" />
          <span>Next-Gen LMS Architecture</span>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
            Elevate Your <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">Academic Journey.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            A modern, high-performance Learning Management System designed 
            for seamless educator-student collaboration and automated assessment precision.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href={isLoggedIn ? "/" : "/login"}
            className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 rounded-2xl text-lg font-black tracking-tight shadow-2xl shadow-primary/30 hover:scale-105 active:scale-100 transition-all gap-2")}
          >
            {isLoggedIn ? "Enter Dashboard" : "Start Learning Now"} 
            <ArrowRight className="size-5" />
          </Link>
          <Link 
            href="https://github.com/huyboon"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 rounded-2xl text-lg font-bold border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all gap-2")}
          >
            <Globe className="size-5" /> Open Source
          </Link>
        </div>
        
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default text-white">
          <div className="flex flex-col items-center gap-1 font-black italic tracking-tighter text-2xl">VERCEL</div>
          <div className="flex flex-col items-center gap-1 font-black italic tracking-tighter text-2xl">PRISMA</div>
          <div className="flex flex-col items-center gap-1 font-black italic tracking-tighter text-2xl">NEXT.JS</div>
          <div className="flex flex-col items-center gap-1 font-black italic tracking-tighter text-2xl">NEON DB</div>
        </div>
      </div>
    </section>
  )
}
