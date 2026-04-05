"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { calculateLevel } from "@/lib/gamification"

/**
 * Enrolls the current student into a specific world (class).
 * awards 50 XP for the first time discovery!
 */
export async function enrollInWorld(classId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!session || !userId) {
    return { error: "Unauthorized" }
  }

  // Ensure user is a student
  if (session.user.role !== "STUDENT") {
    return { error: "Only Students can join worlds as explorers!" }
  }

  try {
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: userId,
          classId: classId
        }
      }
    })

    if (existingEnrollment) {
      return { error: "You are already an explorer in this world!" }
    }

    // Join World Transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Create Enrollment
      await tx.enrollment.create({
        data: {
          studentId: userId,
          classId: classId
        }
      })

      // 2. Award Discovery XP (50 XP)
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true }
      })

      if (user) {
        const newXp = user.xp + 50
        const newLevel = calculateLevel(newXp)

        await tx.user.update({
          where: { id: userId },
          data: {
             xp: newXp,
             level: newLevel
          }
        })
      }
    })

    // Revalidate relevant paths
    revalidatePath("/dashboard")
    revalidatePath("/worlds")
    revalidatePath("/profile")
    
    return { success: true }
  } catch (error) {
    console.error("Enrollment Error:", error)
    return { error: "Failed to join current world protocol" }
  }
}
