"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { calculateLevel } from "@/lib/gamification"

// ... existing schemas and addMaterial/deleteMaterial actions ...

export async function absorbMaterialLore(materialId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!session || !userId || session.user.role !== "STUDENT") {
    return { error: "Only Heroes can absorb world lore!" }
  }

  try {
    // Check if already absorbed
    const existingView = await prisma.materialView.findUnique({
      where: {
        studentId_materialId: {
          studentId: userId,
          materialId: materialId
        }
      }
    })

    if (existingView) {
      return { error: "You have already absorbed this lore capsule." }
    }

    // Award XP Transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Mark as seen
      await tx.materialView.create({
        data: {
          studentId: userId,
          materialId: materialId
        }
      })

      // 2. Award 20 XP
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true }
      })

      if (user) {
        const newXp = user.xp + 20
        const newLevel = calculateLevel(newXp)

        await tx.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: newLevel > user.level ? newLevel : user.level
          }
        })
      }
    })

    revalidatePath("/profile")
    revalidatePath("/dashboard")
    
    return { success: true, xpEarned: 20 }
  } catch (error) {
    console.error("Lore Absorption Error:", error)
    return { error: "Failed to absorb the wisdom of this capsule." }
  }
}

const MaterialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileUrl: z.string().url("Valid URL is required"),
  classId: z.string().min(1, "Class ID is required"),
  chapterSession: z.string().optional(),
})

export async function addMaterial(data: z.infer<typeof MaterialSchema>) {
  const session = await auth()
  const userId = session?.user?.id

  if (!session || !userId || session.user.role !== "TEACHER") {
    return { error: "Unauthorized access detected. Only Sages can cast Material Capsules!" }
  }

  try {
    // 1. Verify that the teacher owns the class
    const classroom = await prisma.class.findFirst({
      where: {
        id: data.classId,
        teacherId: userId
      }
    })

    if (!classroom) {
      return { error: "World connection failed. You are not the Sage of this world." }
    }

    // 2. Create Material
    const material = await prisma.material.create({
      data: {
        title: data.title,
        fileUrl: data.fileUrl,
        classId: data.classId,
        createdById: userId,
        chapterSession: data.chapterSession || "Common Knowledge"
      }
    })

    // 3. Revalidate path
    revalidatePath(`/class/${data.classId}/teacher`)
    revalidatePath(`/class/${data.classId}/student`)

    return { success: true, material }
  } catch (error) {
    console.error("Material Capsule Error:", error)
    return { error: "Failed to cast Material Capsule into the world." }
  }
}

export async function deleteMaterial(materialId: string, classId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!session || !userId || session.user.role !== "TEACHER") {
    return { error: "Unauthorized" }
  }

  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId }
    })

    if (!material || material.createdById !== userId) {
      return { error: "You cannot transmute this material." }
    }

    await prisma.material.delete({
      where: { id: materialId }
    })

    revalidatePath(`/class/${classId}/teacher`)
    revalidatePath(`/class/${classId}/student`)

    return { success: true }
  } catch (error) {
    console.error("Transmutation Error:", error)
    return { error: "Failed to remove material from the world." }
  }
}
