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
    <div className="flex-1 space-y-12 p-10 pt-8 bg-background/50">
      <ProfileHeader 
        user={fullUser as any} 
        awardsCount={awards.length}
      />
      
      <div className="space-y-16">
         <section>
            <div className="flex items-center gap-4 mb-10 ml-4">
               <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
               <h2 className="text-xl font-black uppercase text-foreground tracking-[0.4em] italic leading-none">Adventure Metrics</h2>
            </div>
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

         {/* Lore Customization Teaser */}
         <section className="relative overflow-hidden p-16 rounded-[4rem] border-8 border-white bg-white sticker-shadow text-center space-y-6 group">
            <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-4xl font-black text-slate-300 uppercase italic tracking-tighter">Lore Customization Hub Locked</h3>
               <p className="text-slate-400 font-bold italic text-lg uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                  The Master Archivists are currently preparing the <span className="text-primary italic">Sticker Book Interface</span>. 
                  Soon you will be able to customize your Hero Lore, change your avatar sigil, and rearrange your medals!
               </p>
               <div className="pt-6">
                  <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-100 border-4 border-white shadow-inner text-slate-400 font-black italic uppercase tracking-tighter text-sm">
                     Return in v1.3 for Lore Management
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  )
}
