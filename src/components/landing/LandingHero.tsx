import { Zap, ArrowRight, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"

interface LandingHeroProps {
  isLoggedIn: boolean
}

export function LandingHero({ isLoggedIn }: LandingHeroProps) {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-6 overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-20 left-10 size-32 bg-yellow-400/20 rounded-full blur-3xl animate-bounce-subtle" />
      <div className="absolute bottom-20 right-10 size-48 bg-blue-400/20 rounded-full blur-3xl animate-bounce-subtle delay-700" />
      
      <div className="container mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-3xl bg-white shadow-xl sticker-shadow border-4 border-yellow-400 text-yellow-600 text-sm font-black tracking-widest uppercase rotate-1 hover:rotate-0 transition-transform cursor-default">
          <Zap className="size-5 fill-yellow-400" />
          <span>JOIN THE ADVENTURE!</span>
        </div>

        <div className="space-y-8 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.85] text-foreground uppercase italic underline decoration-blue-400 decoration-8 underline-offset-8">
            Ready for <br/> <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent italic">SUPER LEARNING?</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-500 font-bold leading-relaxed italic">
            Unlock your secret powers, earn shiny medals, and <br/>
            conquer the worlds of knowledge with your friends!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <Link 
            href={isLoggedIn ? "/dashboard" : "/login"}
            className={cn(buttonVariants({ size: "lg" }), "h-20 px-12 rounded-[2rem] text-2xl font-black italic shadow-[8px_8px_0px_0px_#B89600] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bouncy-hover")}
          >
            {isLoggedIn ? "Go to Playroom!" : "Start My Mission!"} 
            <ArrowRight className="size-8" />
          </Link>
          <Link 
            href="#features"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-20 px-12 rounded-[2rem] text-2xl font-black italic bouncy-hover border-blue-400 text-blue-500 hover:bg-blue-50")}
          >
            Explore Worlds
          </Link>
        </div>
        
        <div className="pt-24 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default overflow-hidden">
           {['QUICK', 'FUN', 'BRIGHT', 'SAFE'].map((word) => (
             <div key={word} className="flex flex-col items-center gap-2">
                <div className="size-16 rounded-3xl border-4 border-dashed border-slate-300 flex items-center justify-center">
                   <Globe className="size-8 text-slate-400" />
                </div>
                <span className="font-black italic tracking-widest text-2xl text-slate-400">{word}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}
