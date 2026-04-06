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
    <div className="z-10 w-full max-w-md space-y-10 animate-in fade-in zoom-in-95 duration-1000 relative">
      <div className="absolute -top-10 -left-10 size-32 bg-primary/20 rounded-full blur-3xl animate-bounce-subtle" />
      <div className="absolute -bottom-10 -right-10 size-32 bg-secondary/20 rounded-full blur-3xl animate-bounce-subtle delay-700" />
      
      <div className="flex flex-col items-center text-center space-y-6 relative z-10">
        <div className="p-4 bg-primary rounded-[2rem] shadow-2xl rotate-3 animate-bounce-subtle">
          <GraduationCap className="size-12 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-4">HUYBOON PLAYHUB</h1>
          <p className="text-slate-500 font-bold text-lg italic uppercase tracking-wider">Chào mừng trở lại, Anh hùng!</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white sticker-shadow">
        <LoginForm />
      </div>
    </div>
  )
}
