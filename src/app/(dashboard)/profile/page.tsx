import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileHeader } from "@/components/dashboard/ProfileHeader"
import { HeroStats } from "@/components/dashboard/HeroStats"
import { SageStats } from "@/components/dashboard/SageStats"
import { AwardGallery } from "@/components/dashboard/AwardGallery"

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect("/login")
  }

  // Fetch full user data including createdAt
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      submissions: {
         include: { quiz: true }
      },
      enrollments: true,
      createdClasses: {
         include: {
            enrollments: true,
            materials: true,
            quizzes: true,
         }
      }
    }
  })

  if (!fullUser) {
    redirect("/login")
  }

  // Calculate Awards for Students
  const awards: any[] = []
  if (fullUser.role === "STUDENT") {
     fullUser.submissions.forEach((sub: any) => {
        const percentage = (sub.score / sub.totalPoints) * 100
        if (percentage >= 90) {
           awards.push({
              id: `gold-${sub.id}`,
              title: "World Champion",
              description: `Aced the '${sub.quiz.title}' quest!`,
              type: "GOLD",
              date: new Date(sub.submittedAt).toLocaleDateString()
           })
        } else if (percentage >= 80) {
           awards.push({
              id: `silver-${sub.id}`,
              title: "Elite Explorer",
              description: `Mastered the '${sub.quiz.title}' quest!`,
              type: "SILVER",
              date: new Date(sub.submittedAt).toLocaleDateString()
           })
        } else if (percentage >= 70) {
           awards.push({
              id: `bronze-${sub.id}`,
              title: "Brave Adventurer",
              description: `Finished the '${sub.quiz.title}' quest!`,
              type: "BRONZE",
              date: new Date(sub.submittedAt).toLocaleDateString()
           })
        }
     })
  }

  // Calculate Stats
  const stats = {
     student: {
        classesCount: fullUser.enrollments.length,
        quizzesCount: fullUser.submissions.length,
        avgScore: fullUser.submissions.length > 0 
           ? (fullUser.submissions.reduce((acc: number, s: any) => acc + (s.score / s.totalPoints), 0) / fullUser.submissions.length) * 100 
           : 0,
        xp: fullUser.xp,
        level: fullUser.level,
     },
     teacher: {
        classesCount: fullUser.createdClasses.length,
        studentsCount: fullUser.createdClasses.reduce((acc: number, c: any) => acc + c.enrollments.length, 0),
        materialsCount: fullUser.createdClasses.reduce((acc: number, c: any) => acc + c.materials.length, 0),
        quizzesCount: fullUser.createdClasses.reduce((acc: number, c: any) => acc + c.quizzes.length, 0),
     }
  }

  return (
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background/50">
      <ProfileHeader user={fullUser as any} />
      
      <div className="space-y-10">
         <section>
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] italic ml-2 mb-6">Adventure Metrics</h2>
            {fullUser.role === "TEACHER" ? (
               <SageStats stats={stats.teacher} />
            ) : (
               <HeroStats stats={stats.student} />
            )}
         </section>

         {fullUser.role === "STUDENT" && (
            <section>
               <AwardGallery awards={awards} />
            </section>
         )}

         {/* Settings Shortcut - Future Feature */}
         <section className="p-10 rounded-[3rem] border-4 border-muted border-dashed bg-white/30 text-center space-y-4">
            <h3 className="text-xl font-black text-slate-300 uppercase italic">Magic Settings Hub Locked</h3>
            <p className="text-slate-200 font-bold italic text-sm">Return soon to customize your Hero Lore!</p>
         </section>
      </div>
    </div>
  )
}
