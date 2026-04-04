import { GraduationCap } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary/30 relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
      
      <header className="h-20 flex items-center px-10 relative z-10">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 group-hover:scale-110 transition-transform">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-white">HUYBOON</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        {children}
      </main>

      <footer className="py-10 text-center relative z-10">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          Strictly Monitored Academic Environment &copy; 2026
        </p>
      </footer>
    </div>
  )
}
