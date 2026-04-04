"use client"

import { GraduationCap, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface LandingHeaderProps {
  isLoggedIn: boolean
}

export function LandingHeader({ isLoggedIn }: LandingHeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 group-hover:scale-110 transition-transform">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">HUYBOON</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Ecosystem</a>
          <a href="#about" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Protocol</a>
          <a href="#enterprise" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Enterprise</a>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all gap-2"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </Button>
              <Link 
                href="/dashboard" 
                className={cn(buttonVariants({ size: "sm" }), "h-9 px-5 rounded-full font-black text-xs tracking-widest uppercase shadow-lg shadow-primary/20")}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className={cn(buttonVariants({ variant: "ghost" }), "text-sm font-bold text-slate-300 hover:text-white transition-colors")}
              >
                Sign In
              </Link>
              <Link 
                href="/login"
                className={cn(buttonVariants(), "h-9 px-5 rounded-full font-bold shadow-lg shadow-primary/20")}
              >
                Join Academy
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
