import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * Calculates student level based on the Magic XP formula.
 * Formula: Level n = floor((1 + sqrt(1 + 0.08 * xp)) / 2)
 */
function calculateLevel(xp: number) {
  if (xp <= 0) return 1
  return Math.floor((1 + Math.sqrt(1 + 0.08 * xp)) / 2)
}

async function main() {
  console.log("🌱 Starting Hero Identity seeding...")

  const hashedPassword = await bcrypt.hash("password123", 10)

  // 1. Create The Grand Arbiter (Admin)
  const admin = await prisma.user.upsert({
    where: { email: "admin@huyboon.com" },
    update: {},
    create: {
      name: "Grand Arbiter",
      email: "admin@huyboon.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("✅ Admin created:", admin.email)

  // 2. Create Venerable Sages (Teachers)
  const teacherData = [
    { name: "Professor Sage", email: "profsage@huyboon.com" },
    { name: "Lore Keeper", email: "lorekeeper@huyboon.com" },
  ]

  const teachers = await Promise.all(
    teacherData.map((data) =>
      prisma.user.upsert({
        where: { email: data.email },
        update: {},
        create: {
          ...data,
          password: hashedPassword,
          role: "TEACHER",
        },
      })
    )
  )
  console.log("✅ Teachers created:", teachers.length)

  // 3. Create Brave Heroes (10 Students) with varying XP/Levels
  const studentXpValues = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500]
  const students = await Promise.all(
    studentXpValues.map((xp, idx) => {
      const email = `hero${idx + 1}@huyboon.com`
      const level = calculateLevel(xp)
      return prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: `Hero ${idx + 1}`,
          email,
          password: hashedPassword,
          role: "STUDENT",
          xp: xp,
          level: level,
        },
      })
    })
  )
  console.log("✅ Students created:", students.length)

  // 4. Create initial world (Class) for context
  const mainClass = await prisma.class.findFirst({
    where: { name: "Full Stack Mastery: Next.js 16" }
  })

  if (!mainClass) {
    const demoWorld = await prisma.class.create({
      data: {
        name: "Full Stack Mastery: Next.js 16",
        description: "A deep dive into modern web architecture and agentic AI patterns.",
        teacherId: teachers[0].id,
      }
    })
    
    // Enroll the top 5 heroes in the demo world
    await Promise.all(
      students.slice(0, 5).map((student: any) => 
        prisma.enrollment.create({
          data: {
            studentId: student.id,
            classId: demoWorld.id
          }
        })
      )
    )
    console.log("✅ Demo world and initial enrollments created!")
  }

  console.log("🏁 Hero Identity Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
