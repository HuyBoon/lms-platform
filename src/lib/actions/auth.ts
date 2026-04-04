"use server"

import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "TEACHER"]),
})

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function loginUser(formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: "Invalid credentials" }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error // Re-throw to allow Next.js redirect to work
  }
}

export async function registerUser(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: Object.values(validatedFields.error.flatten().fieldErrors).flat()[0] }
  }

  const { name, email, password, role } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "Email already in use" }
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    })

    // Auto login after registration
    return await loginUser(formData)
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" })
}
