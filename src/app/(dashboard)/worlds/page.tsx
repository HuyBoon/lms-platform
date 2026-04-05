import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Globe2, Sparkles } from "lucide-react"
import { WorldGallery } from "@/components/dashboard/WorldGallery"

export default async function WorldsPage() {
  const session = await auth()
  const userId = session?.user?.id

  // Fetch all classes where the user IS NOT enrolled
  const availableWorlds = await prisma.class.findMany({
    where: {
      enrollments: {
        none: {
          studentId: userId
        }
      }
    },
    include: {
      teacher: {
        select: {
          name: true,
          image: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          quizzes: true
        }
      }
    }
  })

  return (
    <div className="flex-1 space-y-10 p-10 pt-8 bg-background/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-foreground flex items-center gap-4">
            <div className="p-4 bg-secondary rounded-[1.5rem] shadow-xl border-4 border-white -rotate-3 sticker-shadow">
              <Globe2 className="size-10 text-secondary-foreground" />
            </div>
            World Discovery
          </h1>
          <p className="text-slate-500 font-bold text-xl italic uppercase tracking-wider ml-1 flex items-center gap-2">
            Explore the <span className="text-secondary font-black italic">Great Unknown</span> and find your next <Sparkles className="size-5 text-yellow-500" /> <span className="text-primary font-black italic underline decoration-wavy decoration-primary/30">Super Quest!</span>
          </p>
        </div>
      </div>

      <WorldGallery worlds={availableWorlds} />
    </div>
  )
}
