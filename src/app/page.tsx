import { auth } from "@/auth"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingHero } from "@/components/landing/LandingHero"
import { LandingFeatures } from "@/components/landing/LandingFeatures"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default async function Home() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 selection:bg-primary/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-[400px] -left-[100px] size-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[100px] -right-[100px] size-[400px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Modular Landing UI */}
      <LandingHeader isLoggedIn={isLoggedIn} />
      
      <main>
        <LandingHero isLoggedIn={isLoggedIn} />
        <LandingFeatures />
      </main>

      <LandingFooter />
    </div>
  )
}
