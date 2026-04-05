import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function calculateLevel(xp: number) {
  if (xp <= 0) return 1
  return Math.floor((1 + Math.sqrt(1 + 0.08 * xp)) / 2)
}

async function main() {
  console.log("🌱 Starting Expanded High-Density Seeding...")

  const hashedPassword = await bcrypt.hash("password123", 10)

  // 0. Clean Database
  console.log("🧹 Cleaning old scrolls from the archives...")
  await prisma.submissionDetail.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.materialView.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.material.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.class.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create The Council (Admin)
  const admin = await prisma.user.create({
    data: {
      name: "Grand Arbiter",
      email: "admin@huyboon.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("✅ Admin created:", admin.email)

  // 2. Create Venerable Sages (2 Teachers)
  const symbols = ["🔥", "❄️", "⚡", "🌿", "💎"]
  const sages = await Promise.all([
    prisma.user.create({
      data: { name: "Sage Altruis", email: "sage1@huyboon.com", password: hashedPassword, role: "TEACHER" }
    }),
    prisma.user.create({
      data: { name: "Sage Valerius", email: "sage2@huyboon.com", password: hashedPassword, role: "TEACHER" }
    })
  ])
  console.log("✅ Sages created:", sages.length)

  // 3. Create Worlds (10 Classes)
  const worlds: any[] = []
  for (const sage of sages) {
    for (let i = 1; i <= 5; i++) {
        const worldName = `${sage.name.split(' ')[1]}'s Realm of ${symbols[i-1]} Knowledge #${i}`
        const world = await prisma.class.create({
            data: {
                name: worldName,
                description: `Master the ancient arts of ${worldName} through epic trials and lore.`,
                teacherId: sage.id,
            }
        })
        worlds.push(world)

        // 4. Create Forge Items (5 Materials, 5 Quizzes per class)
        for (let j = 1; j <= 5; j++) {
            await prisma.material.create({
                data: {
                    title: `Scroll of ${symbols[j-1]} Wisdom #${j}`,
                    fileUrl: "https://example.com/scroll.pdf",
                    classId: world.id,
                    createdById: sage.id
                }
            })

            await prisma.quiz.create({
                data: {
                    title: `Quest of ${symbols[j-1]} Bravery #${j}`,
                    description: `Evaluate your understanding of the ${j}th chapter of lore.`,
                    classId: world.id,
                    createdById: sage.id,
                    questions: {
                        create: Array.from({ length: 5 }).map((_, qIdx) => ({
                            questionText: `Challenge #${qIdx + 1}: What is the essence of ${symbols[i-1]}?`,
                            points: 10,
                            answers: {
                                create: [
                                    { answerText: "The Pure Essence", isCorrect: true },
                                    { answerText: "Corrupted Shadow", isCorrect: false },
                                    { answerText: "Ancient Dust", isCorrect: false },
                                    { answerText: "Fading Echo", isCorrect: false },
                                ]
                            }
                        }))
                    }
                }
            })
        }
    }
  }
  console.log("✅ Worlds, Lore, and Quests forged:", worlds.length)

  // 5. Create Brave Heroes (10 Students)
  const heroes: any[] = []
  for (let i = 1; i <= 10; i++) {
    const hero = await prisma.user.create({
        data: {
            name: `Hero ${i}`,
            email: `hero${i}@huyboon.com`,
            password: hashedPassword,
            role: "STUDENT",
            xp: 0,
            level: 1
        }
    })
    heroes.push(hero)

    // 6. Enroll in 5 random worlds
    const randomWorlds = [...worlds].sort(() => 0.5 - Math.random()).slice(0, 5)
    for (const world of randomWorlds) {
        await prisma.enrollment.create({
            data: {
                studentId: hero.id,
                classId: world.id
            }
        })

        // 7. Absorb 5 random lore capsules from enrolled worlds
        const materials = await prisma.material.findMany({ where: { classId: world.id } })
        const randomLore = materials.sort(() => 0.5 - Math.random()).slice(0, 3)
        for (const lore of randomLore) {
            await prisma.materialView.create({
                data: {
                    studentId: hero.id,
                    materialId: lore.id
                }
            })
        }

        // 8. Complete 2 random quests per enrolled world
        const quizzes = await prisma.quiz.findMany({ where: { classId: world.id } })
        const randomQuests = quizzes.sort(() => 0.5 - Math.random()).slice(0, 2)
        for (const quest of randomQuests) {
            const score = 80 + Math.floor(Math.random() * 21) // 80 - 100
            await prisma.submission.create({
                data: {
                    quizId: quest.id,
                    studentId: hero.id,
                    score,
                    totalPoints: 50 // 5 questions * 10 points
                }
            })
        }
    }
    
    // Update Final XP/Level for the Hero based on their journey
    const viewsCount = await prisma.materialView.count({ where: { studentId: hero.id } })
    const subs = await prisma.submission.findMany({ where: { studentId: hero.id } })
    const subXp = subs.reduce((acc, curr) => acc + curr.score, 0)
    const totalXp = (viewsCount * 20) + subXp
    
    await prisma.user.update({
        where: { id: hero.id },
        data: {
            xp: totalXp,
            level: calculateLevel(totalXp)
        }
    })
  }
  console.log("✅ Heroes summoned and journeys completed:", heroes.length)

  console.log("🏁 All-Role High-Density Seeding complete! The World is now teeming with life.")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
