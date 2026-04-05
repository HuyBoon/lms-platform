"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateClassSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
})

const EnrollSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
})

export async function createClassroom(formData: FormData) {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
    return { error: "Unauthorized" }
  }

  const validatedFields = CreateClassSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    const classroom = await prisma.class.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        teacherId: session.user.id,
      }
    })

    revalidatePath("/")
    return { success: true, classId: classroom.id }
  } catch (error) {
    return { error: "Failed to create classroom" }
  }
}

export async function enrollInClassroom(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = EnrollSchema.safeParse({
    classId: formData.get("classId"),
  })

  if (!validatedFields.success) {
    return { error: "Class ID is required" }
  }

  const { classId } = validatedFields.data

  try {
    // Check if class exists
    const classroom = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classroom) {
      return { error: "Classroom not found" }
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: session.user.id,
          classId: classId
        }
      }
    })

    if (existingEnrollment) {
      return { error: "Already enrolled in this class" }
    }
    
    // Cannot enroll in your own class
    if (classroom.teacherId === session.user.id) {
      return { error: "You are the teacher of this class" }
    }

    await prisma.enrollment.create({
      data: {
        studentId: session.user.id,
        classId: classId
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to enroll in classroom" }
  }
}

export async function updateClassroom(classId: string, data: { name: string, description?: string }) {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
    return { error: "Unauthorized" }
  }

  try {
    const classroom = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classroom || classroom.teacherId !== session.user.id) {
       return { error: "You are not the Sage of this world!" }
    }

    await prisma.class.update({
      where: { id: classId },
      data: {
        name: data.name,
        description: data.description,
      }
    })

    revalidatePath(`/class/${classId}/teacher`)
    revalidatePath(`/class/${classId}/teacher/settings`)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update world settings" }
  }
}

export async function deleteClassroom(classId: string) {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
    return { error: "Unauthorized" }
  }

  try {
    const classroom = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classroom || classroom.teacherId !== session.user.id) {
       return { error: "You are not the Sage of this world!" }
    }

    await prisma.class.delete({
      where: { id: classId }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("World Collapse Error:", error)
    return { error: "Failed to collapse the realm. Ancient magic protects it!" }
  }
}
