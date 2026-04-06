import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * Công thức tính Cấp độ (Level) dựa trên Kinh nghiệm (XP)
 * Giữ nguyên logic gamification ban đầu
 */
function calculateLevel(xp: number) {
  if (xp <= 0) return 1
  return Math.floor((1 + Math.sqrt(1 + 0.08 * xp)) / 2)
}

async function main() {
  console.log("🌱 Đang khởi tạo dữ liệu mẫu (Vietnamese Localization)...")

  const hashedPassword = await bcrypt.hash("password123", 10)

  // 0. Dọn dẹp cơ sở dữ liệu
  console.log("🧹 Đang dọn dẹp kho lưu trữ cũ...")
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

  // 1. Tạo Quản trị viên (Admin)
  const admin = await prisma.user.create({
    data: {
      name: "Quản trị viên HuyBoon",
      email: "admin@huyboon.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("✅ Đã tạo Quản trị viên:", admin.email)

  // 2. Tạo Giảng viên (Teachers)
  const sages = await Promise.all([
    prisma.user.create({
      data: { name: "Thầy Nguyễn Văn Minh", email: "minh.nv@huyboon.com", password: hashedPassword, role: "TEACHER" }
    }),
    prisma.user.create({
      data: { name: "Cô Trần Thị Tuyết Mai", email: "mai.tt@huyboon.com", password: hashedPassword, role: "TEACHER" }
    }),
    prisma.user.create({
      data: { name: "Thầy Lê Hoàng Nam", email: "nam.lh@huyboon.com", password: hashedPassword, role: "TEACHER" }
    })
  ])
  console.log("✅ Đã tạo Giảng viên:", sages.length)

  // Dữ liệu mẫu cho các khóa học
  const courseTemplates = [
    {
      name: "Lập trình Web Frontend với React",
      description: "Làm chủ React.js từ cơ bản đến nâng cao. Xây dựng các ứng dụng web hiện đại và hiệu năng cao.",
      materials: ["Giới thiệu về React & JSX", "Component & Props", "State & Lifecycle", "Hooks cơ bản (useState, useEffect)", "Quản lý State với Redux"],
      quizzes: ["Kiểm tra kiến thức JSX", "Thử thách Props & State", "Quiz về React Hooks", "Xử lý sự kiện trong React", "Bài tập tổng hợp Frontend"]
    },
    {
      name: "Phát triển Backend với Node.js & Express",
      description: "Xây dựng hệ thống API mạnh mẽ, bảo mật và khả năng mở rộng vượt trội với hệ sinh thái Node.js.",
      materials: ["Cơ bản về Node.js Runtime", "Xây dựng Server với Express", "Kết nối Cơ sở dữ liệu Prisma/MongoDB", "Xác thực người dùng với JWT", "Kiến trúc RESTful API"],
      quizzes: ["Kiểm tra Runtime & NPM", "Routing trong Express", "Thao tác Database", "Middleware & Security", "Bài tập cuối khóa Backend"]
    },
    {
      name: "Khoa học Dữ liệu với Python",
      description: "Khám phá thế giới dữ liệu thông qua ngôn ngữ Python. Sử dụng NumPy, Pandas và Matplotlib để phân tích xu hướng.",
      materials: ["Cú pháp Python cho Data Science", "Xử lý mảng với NumPy", "Phân tích bảng dữ liệu Pandas", "Trực quan hóa với Matplotlib", "Giới thiệu Machine Learning cơ bản"],
      quizzes: ["Kiểm tra Python Syntax", "Thử thách NumPy", "Xử lý Dataset thực tế", "Vẽ biểu đồ phân tích", "Quiz cuối khóa Data Science"]
    }
  ];

  const worlds: any[] = []

  // 3. Tạo Khóa học (Classes), Tài liệu (Materials) và Bài kiểm tra (Quizzes)
  for (let i = 0; i < sages.length; i++) {
    const sage = sages[i];
    const template = courseTemplates[i];

    const course = await prisma.class.create({
      data: {
        name: template.name,
        description: template.description,
        teacherId: sage.id,
      }
    })
    worlds.push(course)

    // Tạo 5 Tài liệu và 5 Bài kiểm tra cho mỗi khóa học
    for (let j = 0; j < 5; j++) {
      await prisma.material.create({
        data: {
          title: `Tài liệu: ${template.materials[j]}`,
          fileUrl: "https://example.com/tai-lieu-hoc-tap.pdf",
          classId: course.id,
          createdById: sage.id
        }
      })

      const quiz = await prisma.quiz.create({
        data: {
          title: `Bài kiểm tra: ${template.quizzes[j]}`,
          description: `Đánh giá mức độ nắm vững kiến thức phần: ${template.materials[j]}.`,
          classId: course.id,
          createdById: sage.id,
          questions: {
            create: Array.from({ length: 5 }).map((_, qIdx) => ({
              questionText: `Câu hỏi #${qIdx + 1}: Vai trò chính của ${template.materials[j]} trong quy trình phát triển là gì?`,
              points: 10,
              answers: {
                create: [
                  { answerText: "Là thành phần cốt lõi và quan trọng nhất", isCorrect: true },
                  { answerText: "Chỉ là thành phần bổ trợ không bắt buộc", isCorrect: false },
                  { answerText: "Đã lỗi thời và không nên sử dụng", isCorrect: false },
                  { answerText: "Không liên quan đến nội dung bài học", isCorrect: false },
                ]
              }
            }))
          }
        }
      })
    }
  }

  // 4. Tạo Khóa học tiếng Anh chuyên biệt cho Thầy Lê Hoàng Nam (sage[2])
  const teacherNam = sages[2];
  const englishCourses = [
    {
      name: "Tiếng Anh Giao tiếp Công sở",
      description: "Tự tin giao tiếp trong môi trường làm việc chuyên nghiệp, phỏng vấn và thuyết trình.",
      materials: ["Greeting & Introduction", "Office Communication", "Emails & Professional Writing", "Presentation Skills", "Job Interview Preparation"],
      quizTitle: "Kiểm tra Tiếng Anh Giao tiếp #1"
    },
    {
      name: "Ngữ pháp Tiếng Anh Cơ bản",
      description: "Hệ thống lại toàn bộ nền tảng ngữ pháp quan trọng nhất cho người mới bắt đầu.",
      materials: ["Các thì cơ bản", "Từ loại & Cấu trúc câu", "Mệnh đề quan hệ", "Câu bị động", "Câu điều kiện"],
      quizTitle: "Kiểm tra Ngữ pháp Tổng hợp"
    }
  ];

  for(const content of englishCourses) {
      const course = await prisma.class.create({
          data: {
              name: content.name,
              description: content.description,
              teacherId: teacherNam.id,
          }
      })
      worlds.push(course)

      for (const title of content.materials) {
          await prisma.material.create({
              data: {
                  title: `Bài học: ${title}`,
                  fileUrl: "https://example.com/english-lesson.pdf",
                  classId: course.id,
                  createdById: teacherNam.id
              }
          })
      }

      await prisma.quiz.create({
          data: {
              title: content.quizTitle,
              description: "Đánh giá khả năng hiểu và vận dụng các cấu trúc tiếng Anh đã học.",
              classId: course.id,
              createdById: teacherNam.id,
              questions: {
                  create: [
                      {
                          questionText: "Chọn đáp án đúng nhất để hoàn thành câu: 'I ____ to the market yesterday.'",
                          points: 10,
                          answers: {
                              create: [
                                  { answerText: "Went", isCorrect: true },
                                  { answerText: "Go", isCorrect: false },
                                  { answerText: "Gone", isCorrect: false },
                                  { answerText: "Going", isCorrect: false },
                              ]
                          }
                      },
                      {
                          questionText: "Trong tiếng Anh công sở, cụm từ 'Please find attached' thường dùng để làm gì?",
                          points: 10,
                          answers: {
                              create: [
                                  { answerText: "Đính kèm tài liệu trong Email", isCorrect: true },
                                  { answerText: "Chào hỏi khách hàng", isCorrect: false },
                                  { answerText: "Kết thúc cuộc trò chuyện", isCorrect: false },
                                  { answerText: "Yêu cầu một cuộc họp", isCorrect: false },
                              ]
                          }
                      }
                  ]
              }
          }
      })
  }

  console.log("✅ Khóa học, Tài liệu và Bài kiểm tra đã được khởi tạo:", worlds.length)

  // 5. Tạo Học viên (Students) - Danh sách tên phổ biến tại Việt Nam
  const studentNames = [
    "Nguyễn Hoàng Long", "Trần Minh Quân", "Lê Thị Thu Hà", "Phạm Minh Đức", 
    "Đỗ Thanh Hải", "Ngô Bảo Châu", "Vũ Minh Anh", "Lý Gia Hân", 
    "Bùi Vĩnh Phát", "Hồ Nhã Phương"
  ]

  const students: any[] = []
  for (let i = 0; i < studentNames.length; i++) {
    const student = await prisma.user.create({
        data: {
            name: studentNames[i],
            email: `hocvien${i + 1}@huyboon.com`,
            password: hashedPassword,
            role: "STUDENT",
            xp: 0,
            level: 1
        }
    })
    students.push(student)

    // 6. Đăng ký ngẫu nhiên vào 3-5 khóa học
    const numEnrolled = 3 + Math.floor(Math.random() * 3)
    const randomWorlds = [...worlds].sort(() => 0.5 - Math.random()).slice(0, numEnrolled)
    
    for (const world of randomWorlds) {
        await prisma.enrollment.create({
            data: {
                studentId: student.id,
                classId: world.id
            }
        })

        // 7. Học sinh xem 3-5 tài liệu ngẫu nhiên trong mỗi khóa học đã đăng ký
        const materials = await prisma.material.findMany({ where: { classId: world.id } })
        const randomMaterials = materials.sort(() => 0.5 - Math.random()).slice(0, 3)
        for (const mat of randomMaterials) {
            await prisma.materialView.create({
                data: {
                    studentId: student.id,
                    materialId: mat.id
                }
            })
        }

        // 8. Hoàn thành 1-2 bài kiểm tra mỗi khóa học
        const quizzes = await prisma.quiz.findMany({ where: { classId: world.id } })
        const randomQuizzes = quizzes.sort(() => 0.5 - Math.random()).slice(0, 1)
        for (const qz of randomQuizzes) {
            const score = 80 + Math.floor(Math.random() * 21) // Điểm từ 80 - 100
            await prisma.submission.create({
                data: {
                    quizId: qz.id,
                    studentId: student.id,
                    score,
                    totalPoints: 50 // Giả định mỗi bài kiểm tra có 5 câu, mỗi câu 10 điểm
                }
            })
        }
    }
    
    // Cập nhật lại XP và Cấp độ cuối cùng dựa trên quá trình học tập
    const viewsCount = await prisma.materialView.count({ where: { studentId: student.id } })
    const subs = await prisma.submission.findMany({ where: { studentId: student.id } })
    const subXp = subs.reduce((acc, curr) => acc + curr.score, 0)
    const totalXp = (viewsCount * 20) + subXp // Mỗi lượt xem nhận 20 XP + điểm thi
    
    await prisma.user.update({
        where: { id: student.id },
        data: {
            xp: totalXp,
            level: calculateLevel(totalXp)
        }
    })
  }

  console.log("✅ Học viên đã sẵn sàng hành trình chinh phục kiến thức:", students.length)
  console.log("🏁 Hoàn tất khởi tạo dữ liệu mẫu! Hệ thống đã sẵn sàng cho trải nghiệm e-learning chuyên nghiệp.")
}

main()
  .catch((e) => {
    console.error("❌ Khởi tạo dữ liệu thất bại:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
