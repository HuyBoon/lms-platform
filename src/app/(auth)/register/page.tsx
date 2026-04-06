import { Card } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default async function RegisterPage() {
  return (
    <Card className="w-full max-w-lg border-none bg-white p-2 rounded-[2.5rem] shadow-xl sticker-shadow transition-all animate-in fade-in zoom-in duration-500">
      <RegisterForm />
    </Card>
  )
}
