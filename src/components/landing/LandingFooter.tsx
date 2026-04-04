export function LandingFooter() {
  return (
    <footer className="py-12 border-t border-white/5 bg-slate-950">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 font-medium text-sm">
          &copy; {new Date().getFullYear()} HuyBoon Academy. Built on Next.js 16 & Prisma.
        </p>
        <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
          <span className="text-primary/60">Status: Operational</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>
      </div>
    </footer>
  )
}
