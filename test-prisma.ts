import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const users = await prisma.user.findMany({ take: 1 })
    console.log("Connection successful! Found:", users.length, "users")
  } catch (error) {
    console.error("Connection failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
