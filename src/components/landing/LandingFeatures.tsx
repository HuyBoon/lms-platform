import { ShieldCheck, BookOpen, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <section id="features" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent" />
      <div className="container mx-auto px-6 space-y-20 relative z-10">
        <div className="max-w-3xl text-center mx-auto space-y-4">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary">Discovery Zone</h2>
          <h3 className="text-5xl md:text-6xl font-black text-foreground leading-[1.1] italic uppercase">
            Everything You Need <br/> for the <span className="text-secondary">Perfect Mission!</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Magic Medals",
              desc: "Complete fun quests and earn shiny medals! Show the world what a super student you are!",
              icon: ShieldCheck,
              bg: "bg-yellow-400/10",
              border: "border-yellow-400",
              text: "text-yellow-600"
            },
            {
              title: "Treasure Chest",
              desc: "Keep all your magic maps, books, and videos in one safe spot. Always ready for adventure!",
              icon: BookOpen,
              bg: "bg-blue-400/10",
              border: "border-blue-400",
              text: "text-blue-600"
            },
            {
              title: "Hero Rankings",
              desc: "See who's the fastest learner in the kingdom! Challenge your friends to a friendly race!",
              icon: BarChart3,
              bg: "bg-pink-400/10",
              border: "border-pink-400",
              text: "text-pink-600"
            }
          ].map((f) => (
            <div key={f.title} className={cn("p-10 rounded-[3rem] bg-white border-4 transition-all group bouncy-hover sticker-shadow", f.border)}>
              <div className={cn("p-4 rounded-2xl w-fit mb-8 shadow-lg group-hover:rotate-12 transition-transform", f.bg, f.text)}>
                <f.icon className="size-10" />
              </div>
              <h4 className="text-3xl font-black text-foreground mb-4 italic uppercase">{f.title}</h4>
              <p className="text-slate-500 font-bold leading-relaxed text-lg">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
