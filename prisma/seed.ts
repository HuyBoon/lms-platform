import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting database seeding...")

  const hashedPassword = await bcrypt.hash("password123", 10)

  // 1. Create Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@huyboon.com" },
    update: {},
    create: {
      name: "Professor Huy Boon",
      email: "teacher@huyboon.com",
      password: hashedPassword,
      role: "TEACHER",
    },
  })
  console.log("✅ Teacher created:", teacher.email)

  // 2. Create Student
  const student = await prisma.user.upsert({
    where: { email: "student@huyboon.com" },
    update: {},
    create: {
      name: "Boon Student",
      email: "student@huyboon.com",
      password: hashedPassword,
      role: "STUDENT",
    },
  })
  console.log("✅ Student created:", student.email)

  // 3. Create a Demo Class for the teacher
  const demoClass = await prisma.class.create({
    data: {
      name: "Full Stack Mastery: Next.js 16",
      description: "A deep dive into modern web architecture and agentic AI patterns.",
      teacherId: teacher.id,
    }
  })
  console.log("✅ Demo class created:", demoClass.name, `(ID: ${demoClass.id})`)

  // 4. Enroll Student in Demo Class
  await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: student.id,
        classId: demoClass.id
      }
    },
    update: {},
    create: {
      studentId: student.id,
      classId: demoClass.id
    }
  })
  console.log("✅ Student enrolled in demo class")

  console.log("🏁 Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
