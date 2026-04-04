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
    <header className="sticky top-0 z-50 w-full border-b-8 border-primary/20 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group cursor-pointer bouncy-hover">
          <div className="p-3 bg-primary rounded-2xl shadow-lg border-4 border-white rotate-3 group-hover:rotate-12 transition-transform sticker-shadow">
            <GraduationCap className="size-8 text-primary-foreground stroke-[3]" />
          </div>
          <span className="text-3xl font-black tracking-tight uppercase italic text-foreground flex flex-col leading-none">
            <span className="text-sm not-italic tracking-[0.3em] text-slate-400 mb-1">HUYBOON</span>
            <span className="text-primary drop-shadow-sm">PLAYHUB</span>
          </span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-2">
          {[
            { name: "Adventure", href: "#features", color: "hover:bg-primary/10 hover:text-primary" },
            { name: "Worlds", href: "#about", color: "hover:bg-secondary/10 hover:text-secondary" },
            { name: "Magic", href: "#enterprise", color: "hover:bg-accent/10 hover:text-accent" },
          ].map((item) => (
            <a 
              key={item.name}
              href={item.href} 
              className={cn(
                "px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest text-slate-500 transition-all bouncy-hover",
                item.color
              )}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="font-black uppercase tracking-widest text-slate-400 hover:text-destructive bouncy-hover h-12 px-6 rounded-2xl"
              >
                <LogOut className="size-5" />
                Exit
              </Button>
              <Link 
                href="/dashboard" 
                className={cn(buttonVariants({ size: "lg" }), "bouncy-hover rounded-2xl h-14 px-8 italic shadow-[4px_4px_0px_0px_#B89600] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]")}
              >
                My Playroom
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "font-black bouncy-hover h-14 px-8 uppercase tracking-widest text-slate-500")}
              >
                Sign In
              </Link>
              <Link 
                href="/login"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "bouncy-hover rounded-2xl h-14 px-10 italic shadow-[6px_6px_0px_0px_#B89600] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] font-black uppercase tracking-widest")}
              >
                Join Fun!
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
