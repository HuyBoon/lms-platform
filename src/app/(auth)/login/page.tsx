import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/LoginForm"
import { GraduationCap } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-2xl shadow-primary/20 backdrop-blur-sm">
          <GraduationCap className="size-10 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">HUYBOON ACADEMY</h1>
          <p className="text-slate-400 font-medium text-sm tracking-widest uppercase">High-Performance Neural Network Learning</p>
        </div>
      </div>
      
      <LoginForm />
    </div>
  )
}
