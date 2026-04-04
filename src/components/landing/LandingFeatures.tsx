import { ShieldCheck, BookOpen, BarChart3 } from "lucide-react"

export function LandingFeatures() {
  const features = [
    {
      title: "Smart Assessments",
      desc: "Real-time automated quiz evaluation with detailed student performance metrics and AI-driven insights.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    },
    {
      title: "Resource Hub",
      desc: "Optimized material management with instant file access, type-aware indexing, and secure distribution.",
      icon: BookOpen,
      color: "text-blue-400"
    },
    {
      title: "Performance Analytics",
      desc: "Live class leaderboards and individual progress tracking to foster a competitive yet healthy learning environment.",
      icon: BarChart3,
      color: "text-amber-400"
    }
  ]

  return (
    <section id="features" className="py-24 bg-slate-900/30 border-y border-white/5 px-6">
      <div className="container mx-auto space-y-16">
        <div className="max-w-2xl">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Core Ecosystem</h2>
          <h3 className="text-4xl font-black text-white leading-tight">Engineered for Academic Excellence.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-primary/20 transition-all group hover:bg-slate-900/50">
              <div className={`p-3 rounded-2xl bg-slate-950 border border-white/5 w-fit mb-6 shadow-2xl group-hover:scale-110 transition-transform ${f.color}`}>
                <f.icon className="size-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h4>
              <p className="text-slate-400 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
